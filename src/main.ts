import { Actor, log } from 'apify';
import { createHash } from 'node:crypto';

type Mode = 'company' | 'mass';
type Input = {
    urls?: string[];
    urlsCsv?: string;
    fileUrl?: string;
    maxUrls?: number;
    concurrency?: number;
    resumeId?: string;
    freshStart?: boolean;
};

const MODE = (process.env.ACTOR_MODE || 'company') as Mode;
const API_BASE = (process.env.COMPANY_API_BASE_URL || '').replace(/\/+$/, '');
const API_KEY = process.env.COMPANY_API_KEY?.trim();
const EVENT = process.env.CHARGE_EVENT || 'company-details';
const DEFAULT_MAX = MODE === 'mass' ? 10000 : 100;
const HARD_MAX = MODE === 'mass' ? 1_000_000 : 50_000;
const SECRET_KEY = /^(api[-_]?key|x-api-key|token|access[-_]?token|refresh[-_]?token|secret|password|authorization|credential|credentials)$/i;

function normalizeUrl(raw: unknown): string | null {
    if (typeof raw !== 'string') return null;
    const value = raw.trim();
    if (!value) return null;
    try {
        const url = new URL(value.startsWith('http') ? value : `https://${value}`);
        if (!/(^|\.)linkedin\.com$/i.test(url.hostname)) return null;
        const match = url.pathname.match(/\/company\/([^/?#]+)/i);
        if (!match) return null;
        url.protocol = 'https:';
        url.hostname = 'www.linkedin.com';
        url.pathname = `/company/${match[1]}`;
        url.search = '';
        url.hash = '';
        return url.toString();
    } catch {
        return null;
    }
}

function parseCsv(text: string): string[] {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return [];
    const split = (line: string) => line.split(',').map((part) => part.trim().replace(/^"|"$/g, ''));
    const first = split(lines[0]).map((part) => part.toLowerCase());
    const hasHeader = first.some((part) => ['url', 'linkedinurl', 'linkedin_url', 'companyurl', 'company_url'].includes(part));
    const urlIndex = hasHeader
        ? Math.max(first.findIndex((part) => ['url', 'linkedinurl', 'linkedin_url', 'companyurl', 'company_url'].includes(part)), 0)
        : 0;
    return lines.slice(hasHeader ? 1 : 0).map((line) => split(line)[urlIndex] || '');
}

async function collectUrls(input: Input): Promise<string[]> {
    const raw = [...(input.urls || [])];
    if (input.urlsCsv) raw.push(...parseCsv(input.urlsCsv));
    if (input.fileUrl) {
        const response = await fetch(input.fileUrl, { signal: AbortSignal.timeout(120_000) });
        if (!response.ok) throw new Error(`Could not download input file (HTTP ${response.status}).`);
        raw.push(...parseCsv(await response.text()));
    }
    const seen = new Set<string>();
    const urls: string[] = [];
    for (const value of raw) {
        const url = normalizeUrl(value);
        if (!url || seen.has(url)) continue;
        seen.add(url);
        urls.push(url);
    }
    return urls;
}

function stripSecrets(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(stripSecrets);
    if (!value || typeof value !== 'object') return value;
    const output: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        if (SECRET_KEY.test(key)) continue;
        output[key] = stripSecrets(child);
    }
    return output;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const DIRECT_ATTEMPTS = 5;
const LOOKUP_TIMEOUT_MS = 45_000;

function cleanError(error: unknown, fallback: string): string {
    const message = error instanceof Error ? error.message : fallback;
    return message.replace(/https?:\/\/\S+/gi, 'the lookup service');
}

function permanentStatus(status: number): boolean {
    return status === 400 || status === 401 || status === 402 || status === 404 || status === 409 || status === 422;
}

function stalled(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return error.name === 'TimeoutError' || error.name === 'AbortError' || message.includes('fetch failed') || message.includes('network') || message.includes('timed out');
}

function backoff(attempt: number): number {
    return Math.min(8000, 1000 * (2 ** attempt));
}

async function apiLookup(url: string): Promise<Record<string, unknown>> {
    let lastError = 'Company lookup failed';
    for (let attempt = 0; attempt < DIRECT_ATTEMPTS; attempt += 1) {
        try {
            const response = await fetch(`${API_BASE}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': `Mawsool-Apify-Company-${MODE}/1.0`,
                    'x-api-key': API_KEY!,
                },
                body: JSON.stringify({ url }),
                signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
            });
            const text = await response.text();
            let body: Record<string, unknown> | null = null;
            try { body = JSON.parse(text) as Record<string, unknown>; } catch { /* handled below */ }
            if (response.ok && body) return stripSecrets(body) as Record<string, unknown>;
            lastError = body && typeof body.error === 'string' ? body.error : `Company lookup failed with HTTP ${response.status}`;
            if (permanentStatus(response.status)) break;
            log.warning(`Company lookup attempt ${attempt + 1} of ${DIRECT_ATTEMPTS} did not succeed. Retrying.`);
        } catch (error) {
            lastError = stalled(error) ? 'The company lookup did not answer in time.' : cleanError(error, 'Network request failed');
            log.warning(`Company lookup attempt ${attempt + 1} of ${DIRECT_ATTEMPTS} did not succeed. Retrying.`);
        }
        if (attempt < DIRECT_ATTEMPTS - 1) await sleep(backoff(attempt));
    }
    throw new Error(lastError.replace(/https?:\/\/\S+/gi, 'the lookup service'));
}

function slugHash(url: string): string {
    return createHash('sha256').update(url).digest('hex');
}

await Actor.init();
if (!API_BASE || !API_KEY) throw new Error('Company lookup is not configured.');

const input = (await Actor.getInput<Input>()) || {};
const maxUrls = Math.min(Math.max(Number(input.maxUrls ?? DEFAULT_MAX), 1), HARD_MAX);
const urls = (await collectUrls(input)).slice(0, maxUrls);
if (!urls.length) throw new Error('No valid LinkedIn company URLs found. Use a linkedin.com/company/... URL, CSV, or file upload.');

const concurrency = Math.min(Math.max(Number(input.concurrency ?? (MODE === 'mass' ? 30 : 10)), 1), MODE === 'mass' ? 100 : 40);
const progressId = (input.resumeId || 'auto').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60) || 'auto';
const saveProgress = MODE === 'mass' || urls.length > 20 || !!input.resumeId;
const skipFinished = saveProgress && !input.freshStart && (urls.length > 200 || !!input.resumeId || (MODE === 'mass' && urls.length > 20));
const resumeStore = saveProgress
    ? await Actor.openKeyValueStore(input.resumeId ? `mawsool-company-${MODE}-resume-${progressId}` : `mawsool-company-${MODE}-progress-auto`)
    : null;

log.info(`Starting ${urls.length} company lookup(s), concurrency=${concurrency}`);
if (skipFinished) log.info('Finished rows from an earlier run of this list are skipped. Set freshStart to look them up again.');

let batch = urls;
let deferFailures = urls.length > 1;
let nextIndex = 0;
const deferred: string[] = [];
let processed = 0;
let succeeded = 0;
let failed = 0;
let skipped = 0;
let stop = false;
let consecutiveOutages = 0;
function noteOutcome(message: string | null): void {
    if (!message) {
        consecutiveOutages = 0;
        return;
    }
    const text = message.toLowerCase();
    const outage = text.includes('did not answer') || text.includes('timed out') || text.includes('fetch failed') || text.includes('network') || text.includes('unavailable') || text.includes('unexpected response') || text.includes('403') || text.includes('429') || text.includes('502') || text.includes('503') || text.includes('504');
    if (!outage) {
        consecutiveOutages = 0;
        return;
    }
    consecutiveOutages += 1;
    if (consecutiveOutages >= 15 && !stop) {
        stop = true;
        log.error('The lookup service looks unavailable. Stopping so finished rows stay saved and the next run can continue.');
    }
}

async function worker(): Promise<void> {
    while (!stop) {
        const index = nextIndex++;
        if (index >= batch.length) return;
        const url = batch[index];
        const recordKey = slugHash(url);
        if (skipFinished && resumeStore && await resumeStore.getValue(`done-${recordKey}`)) {
            skipped += 1;
            continue;
        }
        try {
            const api = await apiLookup(url);
            const row = { ...api, inputUrl: url, success: true, checkedAt: new Date().toISOString() };
            const charge = await Actor.pushData(row, EVENT);
            if (charge?.eventChargeLimitReached) stop = true;
            if (resumeStore) await resumeStore.setValue(`done-${recordKey}`, { at: new Date().toISOString() });
            noteOutcome(null);
            processed += 1;
            succeeded += 1;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected company lookup error';
            noteOutcome(message);
            if (deferFailures && !stop) {
                deferred.push(url);
                log.warning(`Company lookup failed and will be retried at the end: ${message}`);
                continue;
            }
            const charge = await Actor.pushData({
                inputUrl: url,
                success: false,
                error: message,
                checkedAt: new Date().toISOString(),
            }, EVENT);
            if (charge?.eventChargeLimitReached) stop = true;
            processed += 1;
            failed += 1;
            log.warning(`Failed company lookup: ${message}`);
        }
    }
}

async function runBatch(): Promise<void> {
    nextIndex = 0;
    const workers = Math.min(concurrency, batch.length);
    if (workers > 0) await Promise.all(Array.from({ length: workers }, () => worker()));
}

await runBatch();
if (deferred.length && !stop) {
    log.info(`Retrying ${deferred.length} company lookup(s) that failed on the first pass.`);
    await sleep(3000);
    batch = deferred.splice(0, deferred.length);
    deferFailures = false;
    await runBatch();
}
await Actor.setValue('OUTPUT', {
    mode: MODE,
    requested: urls.length,
    processed,
    succeeded,
    failed,
    skipped,
    stoppedByChargeLimit: stop,
});
log.info(`Finished. Processed=${processed}, succeeded=${succeeded}, failed=${failed}, skipped=${skipped}`);
await Actor.exit();
