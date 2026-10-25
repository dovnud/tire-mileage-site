# TireMileage growth plan: traffic, citations, credibility

Written 2026-10-25 (America/Los_Angeles). Preview only (https://tiremileage.pages.dev, **noindex ON**). No domain bought, nothing sent, no accounts opened, no money spent.

**Honesty labels used below:** ✅ verified in the built `dist/` this session · 🔍 observed in a live WebSearch this session (snapshot, not a ranking study) · ❓ unverified assumption/need to measure · 🧑 needs Dov.
**No search volumes, traffic or ranking numbers appear anywhere here because we have none.** Volumes must come from Search Console after launch or from a keyword tool Dov chooses to pay for.

---

## 0. Top 5 actions (in order)

1. 🧑 **Pick and attach the domain, then set the launch build** (`PREVIEW=0 SITE_URL=https://<domain> FULL=1 npm run build`). Nothing below (Search Console, Bing, IndexNow, citations) can start while the site is `noindex` on `*.pages.dev`.
2. 🧑 **Decide the accountable identity** (name, short bio, contact for corrections) for About and the guide bylines. Guides are currently bylined “TireMileage” (Organization). Credibility and citations depend on a real, reachable owner; we will not invent one.
3. 🧑 **Verify the site in Google Search Console and Bing Webmaster Tools and submit `sitemap-index.xml`** (steps in §3). Then release pages in tranches (PLAN.md) and watch indexing.
4. **Publish the data assets that other sites can cite**: yearly “longest-lasting tires by size” report with a stable URL, downloadable dataset, embeddable charts (§2). The dataset and methodology exist; the report and embeds do not yet.
5. **Manual, honest participation** by Dov in forums/Reddit/owner groups with the guides and size pages as answers (never drop links without answering). Plus a small, targeted outreach list built from our own data findings (§2.4), with Dov sending.

---

## 1. Traffic

### 1.1 Reality check (❓ assumptions, state them out loud)
- A brand-new domain with ~3,500 programmatic pages will not rank quickly. How long it takes is ❓ unknown; we measure instead of guessing. The kill rule in §4 exists because of this.
- Our differentiator is not the pages themselves (a size-ranking page already exists at competitors) but **being the best-sourced, plain-English reference, with open data**. Tone: “here is what the government data does and does not tell you.”

### 1.2 Competitive snapshot 🔍 (WebSearch, 2026-10-25)
| Query | What appeared to rank / be present | Implication |
|---|---|---|
| `longest lasting tires 225/65r17` | TireShot has a size-based treadwear ranking page for 225/65R17; retailer and review pages | Size pages are contested but exist as a format; we need depth (percentiles, bands, caveats, sources) not just a list |
| `what does treadwear 600 mean` | NHTSA, Tire Industry Association and the DOT consumer guide dominate | Don't try to out-rank the regulators on the definition; answer the *follow-up* (“does 600 mean 60,000 miles?” “treadwear vs warranty”) with our own data and cite them |
| `best tires for rav4 mileage` | Vehicle-specific blogs (RAV Buddy, TireAdvise, Tirefolio) | Vehicle pages are a real demand cluster, but need a fitment feed (PLAN.md §2). Not built; do not fake it |
| cost per mile / warranty vs treadwear | Crowded with calculators and explainers (FastCalc, TireGrades, Tirefolio, TireSize.app, Tire Rack) | A generic calculator won't win; our angle is “warranty miles are a ceiling, here is the maker-test spread” |
| maker test claims | Michelin's own press release is the top hit | Cite it as a maker claim and add context |
Competitors named in PLAN.md: treadgrade.com (~4,500 pages), Tire Rack, Discount Tire, Consumer Reports. Not analyzed beyond that.

### 1.3 Keyword clusters (no volumes; ❓ demand unverified until Search Console)
| Cluster | Example intent | Page type (built?) |
|---|---|---|
| A. Size + “longest lasting / treadwear” | “longest lasting 225/65r17 tires” | `/sizes/<size>/` ✅ (18 in preview, ~244 with 5+ lines possible at full build) |
| B. Line/brand + “treadwear rating” | “michelin defender2 treadwear” | `/tires/<brand>/<line>/` ✅ (40 in preview, ~3,000 full) |
| C. Treadwear explainers | “what does treadwear 600 mean”, “treadwear vs mileage” | `/guides/` ✅ (10 guides) |
| D. Cost per mile / warranty | “tire cost per mile”, “mileage warranty meaning” | guides + calculator ✅ |
| E. Maintenance / replace | “when to replace tires”, “how often rotate” | guides ✅ |
| F. Browse by band/category/rim | “600 treadwear tires”, “17 inch all season tires” | `/treadwear/`, `/type/`, `/rim/` ✅ (25 hubs) |
| G. Vehicle-specific | “best tires for rav4” | ❌ needs fitment feed (not available) |
| H. Tire-code decoding / DOT date | “how to read dot code on tire” | covered by sidewall and when-to-replace guides ✅ |

### 1.4 Channel sequence
1. **Google + Bing organic (core).** After launch: tranche releases, watch indexing. Bing matters because ChatGPT-style and other answer tools may draw on Bing-index results ❓ (not verified here; low-cost to do anyway).
2. **AI answers / GEO.** Done on our side: `llms.txt`, AI-bot allow-list in `robots.txt`, answer-first boxes, extractable tables, dated and cited facts (all ✅). Whether any assistant cites us is ❓ and must be tested by hand with real prompts after indexing.
3. **Reddit/forums, by Dov manually, ≥2 weeks after launch.** Answer specific questions (“what's a long-lasting tire for X”) with substance first, link second, disclose ownership, follow each community's self-promotion rules. We will not automate or post.
4. **Newsletters / auto & personal-finance writers:** pitch with data (§2.4), no mass mail.
5. **YouTube/shorts (optional, later):** 60-second explainers (“treadwear isn't miles”) driving to guides. Only if Dov wants to be on camera or we use a voiceover; not started.

---

## 2. Citations and credibility

### 2.1 Original data assets (what others can legitimately cite)
| Asset | Status |
|---|---|
| NHTSA UTQG dataset, normalized, downloadable CSV/JSON + Dataset JSON-LD at `/data/` | ✅ (JSON-LD now has version, keywords, variables, citation, publisher) |
| Percentile rankings by size (every size page shows rank + percentile) | ✅ |
| Treadwear bands, category (name-marker) and rim hubs with computed mixes | ✅ new |
| “Treadwear vs warranty” analysis (Continental warranty table joined to NHTSA grades; Michelin maker-test joined to NHTSA grades; the spread of 47,700–94,400 miles among four lines graded 700–840) | ✅ in guides; a standalone report page is ❌ |
| Data-quality findings (e.g. 77 of 7,625 treadwear records are not multiples of 20; dataset vs NHTSA's “current tires” distributions differ) | ✅ stated in guides; worth a short methods note ❌ |
| **Yearly “Longest-lasting tires by size” report**, e.g. `/reports/2027/` as permanent URL, frozen dataset snapshot per year | ❌ not built. Plan: build after launch; each year's snapshot is immutable |
| **DOI-like stable identifier** | ❌ A real DOI needs a registry account (e.g. a Zenodo dataset deposit) 🧑 Dov decision; until then use permanent `/reports/<year>/` + `/data/` file names with the pull date |
| **Embeddable charts with attribution** (SVG/iframe, “Source: TireMileage / NHTSA, <date>” + link) | ❌ not built; next build item |

### 2.2 Credibility signals
| Signal | Status |
|---|---|
| Methodology page (source, cleaning, definitions, known gaps; now covers bands/categories/rim/guides) | ✅ |
| Every guide: answer-first box, cited sources list with retrieval date, “last updated”, FAQ | ✅ (10/10, enforced by `npm run check`) |
| Primary sources: 49 CFR 575.104, 49 CFR 574.5, NHTSA TireWise, TIA, USTMA, maker pages | ✅ only pages actually read are cited |
| Maker claims labeled as the maker's own; worked examples labeled “made-up”; no prices shown | ✅ |
| Corrections policy + review cadence | ✅ text on About; ❌ contact method (🧑) |
| **Real author/owner identity** | ❌ 🧑 **Decision needed.** Article JSON-LD uses author = Organization “TireMileage” as a placeholder |
| Contact + privacy policy pages | ❌ needed before launch and before any affiliate/ad application 🧑 |
| Last-reviewed dates | ✅ on guides/data pages (all 2026-10-25 = pull date); needs a real review process after launch |

### 2.3 Rules for outreach/PR (no sending in this task)
- Everything that goes out is sent by Dov (or approved by him message by message). Nothing is drafted into a mailbox here.
- Pitches lead with a verifiable finding and link to the dataset, never with “link to us.”
- Wikipedia/Wikidata: only add a citation where our dataset is legitimately a reliable, notable source for the claim, disclose the conflict of interest, use talk pages. Don't expect this early (❓ notability not established). No self-promotion edits.

### 2.4 Digital-PR ideas (from our own computed findings)
1. “**Treadwear isn't miles**”: four tires graded 700–840 had maker-estimated lives of 47,700–94,400 miles in Michelin's own test (maker-run, labeled as such).
2. “**Warranty miles vs treadwear grade**”: Continental's published warranty table vs NHTSA grades for 12 matched lines (partial, hand-matched; disclose).
3. “**How many tire grades are rounded?**” (data-quality angle: 77 of 7,625 records not multiples of 20).
4. “**The UTQG scale in practice**”: share of lines per band (data from `/treadwear/`), “what share of tires get AA?”
5. Yearly report (after build): “Longest-lasting tire lines by size, <year>”.

**Outreach target *types* (a list to build; none contacted):** auto-data and consumer-finance reporters; car-maintenance/DIY bloggers and YouTubers; automotive newsletters; consumer-education pages at libraries/universities/extension services; tire-shop blogs willing to cite a neutral reference; data-sharing venues for the dataset (e.g. data portals/Kaggle-style hosts, which need an account 🧑); source-request services for journalists (names, current status and pricing unverified, check before joining 🧑). Build the actual contact list from reading each target's recent coverage, not from a scraped database.

---

## 3. Technical SEO / GEO checklist (✅ = confirmed in current `dist/` and by `npm run check`; ❌ = not done)

| Item | Status |
|---|---|
| Unique `<title>` and meta description (50–200 chars) on every page; one H1; self-canonical | ✅ (116 pages preview; 3,524 full build: 0 problems) |
| Open Graph + Twitter `summary_large_image` on every page, with generated 1200×630 PNG OG images (109 in preview: default, guides, hubs, brands, sizes, lines) | ✅ |
| JSON-LD: BreadcrumbList (114 pages), FAQPage (93), Article (10 guides), CollectionPage/ItemList (25 hubs + indexes), Dataset (`/data/`), WebSite (home), WebPage (line/size) | ✅ |
| Sitemaps: `sitemap-index.xml` → pages, guides, tags, brands, tires, sizes; every page is in a sitemap; no orphan pages | ✅ |
| HTML sitemap `/sitemap/`; Atom feed `/guides/feed.xml` (autodiscovery on all pages) | ✅ |
| `robots.txt` with Sitemap line + explicit allow for AI crawlers; `llms.txt` (guides, bands, categories, rims, sizes, brands) | ✅ |
| Internal-link hubs: guides ↔ sizes/lines ↔ bands/categories/rims ↔ brands; chips on line/size/brand pages; similar-lines, related-guides blocks; breadcrumbs follow the taxonomy | ✅ |
| Noindex on preview (meta + `X-Robots-Tag` header) | ✅ must flip at launch |
| IndexNow mechanism: key file only written when `PREVIEW=0` and `INDEXNOW_KEY` set; `npm run indexnow` is a dry run unless `--submit` + real domain | ✅ built, **off**, nothing submitted |
| Core Web Vitals / Lighthouse (local static server, default mobile emulation, 5 pages: home, guide, band hub, size, line) | ✅ Performance 100, Best-practices 100, LCP 1.0–1.1 s, CLS 0, TBT 0–10 ms. Accessibility 95–98 → fixed contrast/heading order → re-measured 100 on home + size page. **SEO 69 on every page solely because of the intentional noindex** (`is-crawlable`). Lab data on localhost, *not* field data (❓ real CWV only after traffic) |
| hreflang | n/a (single language) |
| Search Console + Bing Webmaster verification and sitemap submission | ❌ 🧑 domain + accounts. Steps below |
| Real domain, `SITE_URL`, `PREVIEW=0`, contact + privacy pages | ❌ 🧑 |
| Vehicle pages; embeddable charts; yearly report | ❌ |
| Image alt text / video | n/a (no content images yet) |

**Search Console + Bing steps (for Dov, after the domain is attached):**
1. Search Console → add *Domain* property → add the DNS TXT record at the registrar/Cloudflare → verify.
2. Submit `https://<domain>/sitemap-index.xml`. Use URL Inspection on `/`, one guide, one size page, one line page → “Request indexing” (limited quota).
3. Bing Webmaster Tools → import from Search Console (fastest) or verify by DNS → submit the same sitemap.
4. Set `INDEXNOW_KEY` (any 8–128 char alphanumeric/dash string), build with `PREVIEW=0`, deploy, confirm `https://<domain>/<key>.txt` returns the key, then `npm run indexnow -- --submit` (Dov's call; sends URLs to the IndexNow endpoint).
5. Watch Pages/Indexing report weekly; record “Crawled, currently not indexed” and “Discovered, not indexed” counts, since those drive the kill rule.

---

## 4. 30 / 60 / 90 days (day 0 = launch on a real domain)

Targets below are **thresholds we set to make decisions, not forecasts**.

| Window | Do | Measure (from Search Console unless noted) |
|---|---|---|
| **Days 0–30** | Domain + verification + sitemap; tranche 1 (~500 pages: 10+ line sizes, top lines, brand hubs, all guides/hubs); contact/privacy/author pages; first 5 manual forum answers by Dov | % of submitted URLs indexed; impressions/week (trend); queries by cluster (A–F); crawl errors; guide pages indexed |
| **Days 31–60** | Tranche 2 only if indexing is healthy; publish data report v1 + embeddable charts; pitch 10–20 hand-picked outreach targets (Dov sends); check AI assistants manually with 10 fixed prompts (record whether we are cited) | Indexed %; clicks and impressions trend; first referring domains (Search Console Links / Bing); branded queries; pages with impressions but position >20 → improve content |
| **Days 61–90** | Tranche 3 or prune/merge thin pages; refresh the dataset (re-pull NHTSA) and the “last updated” dates; decide on affiliates/ads only after traffic and feed terms are verified | Same metrics; click-through rate on top 20 pages; indexed vs not; which cluster is working → double down there |

**Kill rule (from PLAN.md):** if <30% of submitted URLs are indexed by day 21, or impressions show no growth by day 30, **stop expanding**: no more tranches, prune/merge thin pages, keep what is indexed, and reassess before spending anything. Added guardrail (our addition): do not apply for ads/affiliates until indexed pages and impressions are growing.

---

## 5. Decisions and accounts needed from Dov 🧑
1. **Domain** (name, registrar; `tiremileage.com` is *not* bought). Also whether “TireMileage” stays as the name.
2. **Author/owner identity**: public name or business name, short bio, a corrections contact email. Used on About, guide bylines and Article JSON-LD (replace the Organization placeholder if you want a person).
3. **Google Search Console** and **Bing Webmaster Tools** access (DNS control to add TXT records).
4. **Cloudflare Pages custom domain** attach; production `SITE_URL`.
5. **Affiliate approvals** (CJ/SimpleTire, Tire Rack, Awin/Priority Tire, Amazon Associates): terms unverified, none applied for; wait until traffic exists.
6. **Data-asset accounts** if wanted: Zenodo (or similar) for a DOI-backed dataset deposit; Kaggle/data-portal hosting.
7. **Privacy policy / contact page** text and any analytics choice (none installed).
8. **Outreach/forum posting**: Dov decides who gets contacted and sends/posts personally.
9. Whether to fund a keyword tool or Search Console-only data for volumes (we have none).
