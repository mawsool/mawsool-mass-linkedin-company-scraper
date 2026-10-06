# Mass LinkedIn Company Scraper for Bulk URL Files

**Enrich large LinkedIn company lists with firmographics, locations, specialties, similar companies, and recent posts. From $2 per 1,000 URLs.**

Upload a CSV, paste company URLs, set concurrency, and optionally set a `resumeId`. Running again with the same ID skips company URLs that already completed.

**Mawsool LinkedIn data suite:** use **LinkedIn Company Details from URL** for a short interactive list. Use **LinkedIn Current Company Checker** when the input is a person, not a company page.

## Can it handle a million company URLs?

The Actor accepts up to **1,000,000 unique company URLs per run**. Completion depends on your Apify timeout, spending limit, plan, and concurrency. Start with 1,000 URLs, measure throughput, then scale. The default run uses 256 MB and a 24-hour timeout. You can raise memory up to 1024 MB.

## What company data is returned?

The dataset row is the company payload unchanged, plus `inputUrl`, `success`, and `checkedAt`. Secret fields such as API keys, tokens, passwords, and credentials are removed if a response ever contains them. Post authors stay in `recent_updates`, because that is the person or company that published the post.

This sample keeps every returned field. `recent_updates` is shortened to the first post here; a run returns the full list.

```json
{
  "entity_type": "company",
  "page_type": "company",
  "linkedin_company_id": "81831244",
  "slug": "mawsool-موصول",
  "url": "https://sa.linkedin.com/company/mawsool-%D9%85%D9%88%D8%B5%D9%88%D9%84",
  "name": "Mawsool International",
  "tagline": "Access the world's largest and most accurate live B2B database.",
  "description": "Mawsool is the next evolution in lead generation, offering unparalleled access to over 1 billion verified business contacts. Powered by an advanced AI agent, our patented technology ensures 98% contact accuracy, setting a new standard for precision and reliability. We stand by our data quality with a money-back guarantee—if you find better data elsewhere, we’ll refund you.",
  "website": "https://mawsool.tech/",
  "industry": "Software Development",
  "company_size": "2-10 employees",
  "company_size_min": 2,
  "company_size_max": 10,
  "employees_on_linkedin": 11,
  "headquarters": "Riyadh, Saudi Arabia",
  "address": {
    "street": null,
    "city": "Riyadh, Saudi Arabia ",
    "region": null,
    "postal_code": null,
    "country": "SA",
    "country_code": "SA"
  },
  "organization_type": "Privately Held",
  "founded": 2022,
  "specialties": [
    "Lead Generation",
    "B2B Data",
    "Account-Based Marketing (ABM)",
    "Talent Sourcing",
    "Data Science",
    "Artificial Intelligence",
    "Email Automation",
    "Sales Engagement",
    "Revenue Intelligence",
    "AI WhatsApp Marketing",
    "Headhunting",
    "Fund Sourcing",
    "GTM Strategy",
    "Intent Data",
    "DaaS",
    "Data Enrichment",
    "Business Contacts",
    "Big Data",
    "Prospecting",
    "Data-Driven Digital Marketing"
  ],
  "followers": 2141,
  "logo": "https://media.licdn.com/dms/image/v2/D4D0BAQFDtDXVm67_JA/company-logo_200_200/B4DZomXl7eIkAI-/0/1761580311052/mawsool__logo?e=2147483647&v=beta&t=KUzsiYmIdavZVMH_2WbCSl8BrpBFYyHo4d1_Phkm2m8",
  "employees": [
    {
      "title": "Islam AYD MHSA, PCT, CPHQ",
      "subtitle": null,
      "link": "https://www.linkedin.com/in/islamdardas",
      "img": "https://media.licdn.com/dms/image/v2/D4D03AQH0ZxWc9M5zXw/profile-displayphoto-scale_100_100/B4DZ9.jn0FJQAc-/0/1784534696258?e=2147483647&v=beta&t=hMumPomVgDa69cgQ-vLySAa7UwMhT4IY5F5fuS4TOUg"
    },
    {
      "title": "Sohaib Gherfal",
      "subtitle": null,
      "link": "https://www.linkedin.com/in/sohaib-gherfal-1bb92a88",
      "img": "https://media.licdn.com/dms/image/v2/D4D03AQEedIfsQ6LdZg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726826296592?e=2147483647&v=beta&t=YaXUgZ1pZ1q2SvesufNtniuBu5Z9jUVD4FTY7c1PA0o"
    },
    {
      "title": "Anas Al-Zaben",
      "subtitle": null,
      "link": "https://www.linkedin.com/in/anas-m-alzaben",
      "img": "https://media.licdn.com/dms/image/v2/D4E03AQHljsVTaILrow/profile-displayphoto-scale_100_100/B4EaBYgbgpH4AY-/0/1788191292098?e=2147483647&v=beta&t=CgXoSJXMOR5xth-OmHrr0XmiaR--cXms7qbBg5MtQEs"
    },
    {
      "title": "Muhammad Saghier",
      "subtitle": null,
      "link": "https://www.linkedin.com/in/muhammadalsaghier",
      "img": "https://media.licdn.com/dms/image/v2/D4D03AQFBpvaNyLCe_A/profile-displayphoto-scale_100_100/B4DZoqdW4XJAAc-/0/1761648934753?e=2147483647&v=beta&t=GL8p_-NO0-fH3ezZW1otYxRqmBKvPPk8ptIFOPV1ChY"
    }
  ],
  "similar_companies": [
    {
      "title": "موصول | MOSOOL",
      "subtitle": "Transportation, Logistics, Supply Chain and Storage",
      "location": null,
      "Links": "https://www.linkedin.com/company/mosool-net"
    },
    {
      "title": "Kaitamin",
      "subtitle": "Pharmaceutical Manufacturing",
      "location": "Wilmington, Delaware",
      "Links": "https://www.linkedin.com/company/kaitamin"
    },
    {
      "title": "RevGenius",
      "subtitle": "Think Tanks",
      "location": null,
      "Links": "https://www.linkedin.com/company/revgenius"
    },
    {
      "title": "PowerMatch",
      "subtitle": "Technology, Information and Internet",
      "location": null,
      "Links": "https://www.linkedin.com/company/powermatchai"
    },
    {
      "title": "National Unified Procurement Company \"NUPCO\"",
      "subtitle": "Hospitals and Health Care",
      "location": "Al Sahafah, Riyadh",
      "Links": "https://www.linkedin.com/company/nupco-national-unified-procurement-medical-supplies-company-"
    },
    {
      "title": "Kaizmed",
      "subtitle": "Medical Equipment Manufacturing",
      "location": null,
      "Links": "https://www.linkedin.com/company/kaizmed"
    },
    {
      "title": "Dollany",
      "subtitle": "Technology, Information and Internet",
      "location": null,
      "Links": "https://www.linkedin.com/company/dollany"
    },
    {
      "title": "Azeel | أزيل",
      "subtitle": "Technology, Information and Internet",
      "location": null,
      "Links": "https://www.linkedin.com/company/azeelapp"
    },
    {
      "title": "WalaPlus",
      "subtitle": "Technology, Information and Internet",
      "location": "Riyadh, Riyadh",
      "Links": "https://www.linkedin.com/company/walaplus"
    },
    {
      "title": "Done Deal | دنــ ديــل",
      "subtitle": "Marketing Services",
      "location": null,
      "Links": "https://www.linkedin.com/company/done-deal-sa"
    }
  ],
  "locations": [
    {
      "address": "Riyadh, Saudi Arabia , SA",
      "lines": [
        "Riyadh, Saudi Arabia , SA"
      ],
      "is_primary": true
    },
    {
      "address": "Dubai, United Arab Emirates , AE",
      "lines": [
        "Dubai, United Arab Emirates , AE"
      ],
      "is_primary": false
    }
  ],
  "locations_count": 2,
  "recent_updates": [
    {
      "id": "7497224930590134273",
      "urn": "urn:li:activity:7497224930590134273",
      "link": "https://www.linkedin.com/feed/update/urn:li:activity:7497224930590134273/",
      "date": "2026-08-23T09:35:15.156Z",
      "posted": "1mo",
      "author": {
        "name": "Mawsool International",
        "link": "https://www.linkedin.com/company/mawsool-%D9%85%D9%88%D8%B5%D9%88%D9%84",
        "type": "company"
      },
      "text": "We’re thrilled to be part of the future at LEAP 2026 in Riyadh, Saudi Arabia!\n\n#LEAP2026 #Mawsool #Riyadh #SaudiArabia #Vision2030 #B2B #Innovation #Technology #Network #Expo",
      "text_html": "We’re thrilled to be part of the future at LEAP 2026 in Riyadh, Saudi Arabia!\n\n<a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fleap2026&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#LEAP2026</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fmawsool&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Mawsool</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Friyadh&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Riyadh</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fsaudiarabia&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#SaudiArabia</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fvision2030&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Vision2030</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fb2b&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#B2B</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Finnovation&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Innovation</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Ftechnology&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Technology</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fnetwork&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Network</a> <a class=\"link\" data-tracking-control-name=\"organization_guest_main-feed-card-text\" data-tracking-will-navigate=\"\" href=\"https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2Fhashtag%2Fexpo&amp;trk=organization_guest_main-feed-card-text\" target=\"_self\">#Expo</a>",
      "hashtags": [
        "#LEAP2026",
        "#Mawsool",
        "#Riyadh",
        "#SaudiArabia",
        "#Vision2030",
        "#B2B",
        "#Innovation",
        "#Technology",
        "#Network",
        "#Expo"
      ],
      "tagged_companies": [],
      "tagged_people": [],
      "images": [
        "https://media.licdn.com/dms/image/v2/D4E22AQEHP7xSPn37Og/feedshare-shrink_800/B4EaAt.WMKK4Ac-/0/1787477714043?e=2147483647&v=beta&t=arM8sjfQZJrDJ2Psa6JIXAU8bB_eDmYJYTBi9Lzi0EE"
      ],
      "videos": [],
      "img": "https://media.licdn.com/dms/image/v2/D4E22AQEHP7xSPn37Og/feedshare-shrink_800/B4EaAt.WMKK4Ac-/0/1787477714043?e=2147483647&v=beta&t=arM8sjfQZJrDJ2Psa6JIXAU8bB_eDmYJYTBi9Lzi0EE",
      "reactions": 34,
      "comments": 3,
      "repost": null
    }
  ],
  "recent_updates_count": 6,
  "inputUrl": "https://www.linkedin.com/company/mawsool-%D9%85%D9%88%D8%B5%D9%88%D9%84",
  "success": true,
  "checkedAt": "2026-09-28T16:40:00.000Z"
}
```

## Does this include every employee?

No. `employees` is the people shown on the company page, with the name in `title`, an optional `subtitle`, a profile link, and a photo. It is not a full employee directory and it does not include email addresses or phone numbers.

`recent_updates` is the set of posts returned for that page, including text, images, reactions, comments, hashtags, and reposts. It is not a complete historical archive.

## How much does 1,000 company URLs cost?

FREE is **$2.00 per 1,000** company URLs. Paid Apify plans receive a lower unit price on the same event:

| Plan | Price per 1,000 |
|---|---|
| Free | $2.00 |
| Bronze | $1.80 |
| Silver | $1.60 |
| Gold, Platinum, and Diamond | $1.30 |

`cost = company URLs processed × your plan price per URL`.

## What should I run first?

- Need the current employer of a person, cheaply? Use **LinkedIn Current Company Checker**.
- Need a person's profile details? Use **LinkedIn Profile Details from URL**.
- Have an email, not a company URL? Use **Email to LinkedIn Finder**.
- Have a person's name and employer? Use **LinkedIn Profile Finder by Name & Company**.

## Operational controls

- 1–100 concurrent requests.
- `maxUrls` cost cap.
- `resumeId` stores one completion marker per company URL.
- The run stops when the spending limit is reached.

## FAQ

### When do I use the mass company Actor?

Use it for lists up to 1,000,000 company URLs. The price per company is the same as Company Details, $2 per 1,000. A stopped run continues finished companies on the next start.

## Where to run it

Run the published Actor on Apify, or start from [mawsool.tech](https://mawsool.tech). This repository does not include the lookup address.
