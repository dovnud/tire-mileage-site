# Tire Mileage: build plan (prototype 2026-10-25)

Working name/domain: **tiremileage.com is NOT purchased and NOT attached.** Preview only on `*.pages.dev`. No affiliate sign-ups, no live affiliate links, no ads, no spend.

## 1. Architecture
- Static **Astro 7** site, output `dist/`, deployed to **Cloudflare Pages** (direct upload via wrangler now; Git-connected builds later). Build needs Node >= 22.23.4 (`.nvmrc`).
- Data lives in the repo as JSON (`data/normalized/`); pages are generated at build time with `getStaticPaths`. Full build (all lines + all sizes with 5+ lines) measured at **3,465 pages in ~4 s, 74 MB**, so scale is not a build problem (Pages limit is 20k files); indexing tranches are the real throttle.
- Client JS only for the cost-per-mile calculator (inline, no framework).
- `PREVIEW=1` (default) adds `noindex` meta + `X-Robots-Tag` header. Launch build: `PREVIEW=0 SITE_URL=https://<domain> FULL=1 npm run build`.

## 2. URL scheme and templates
| URL | Template | Unique computed content |
|---|---|---|
| `/` | home | dataset-wide counts, top lines |
| `/tires/` , `/tires/<brand>/` | brand hub | all brand lines ranked by median treadwear, percentile |
| `/tires/<brand>/<line>/` | tire line | treadwear range/median, percentile vs all lines, brand rank, neighbor lines, plain-English grade reading, all NHTSA records, calculator, FAQ |
| `/sizes/`, `/sizes/<w-aspect-rim>/` e.g. `/sizes/225-65r17/` | size ranking | rank of every line with a record for that size by treadwear, percentile in size, band distribution, best per brand, per-row cost-per-1,000-mi inputs, FAQ |
| `/methodology/`, `/about/`, `/data/` | trust pages | `/data/` has CSV/JSON downloads + Dataset JSON-LD |
| Later: `/vehicles/<make>/<model>/<year>/`, explainers (`/learn/what-does-treadwear-600-mean/`) | tbd | need a fitment feed |

## 3. Data pipeline
1. `scripts/pull_nhtsa.py`: `GET https://api.nhtsa.gov/tires?dataSet=ratings&max=100&offset=N&sort=productName&order=asc`. Findings: max page size is 100 (larger `max` silently returns 100); `sort` must be one of productName,size,trac,temp,wear,*Count (not `id`); no auth key. Dedupes on `id`. Result: **7,628 / 7,628 unique records**.
2. `scripts/normalize.py`: case-merge brands (228 raw -> 214) and lines (3,162 -> 3,023), validate grades (treadwear 0/missing, traction `W`, temperature `AA`/`500`/`W` set to null and flagged), parse sizes (`P235/75R15`, `255/40R20 101Y` -> `235-75r15`), compute line median, percentile, brand rank, size tables.
3. `scripts/copy-downloads.mjs`: publishes CSV/JSON to `/data/`.
4. Refresh monthly (NHTSA data changes slowly); diff counts in CI before deploy.

### Honest data limits (found, not assumed)
- Only **4,665 of 7,628 records (61%)** name a specific tire size (469 distinct sizes, 244 with 5+ lines, 155 with 10+). The rest read "All sizes", rim ranges, speed ratings or series. Only 740 of 3,023 lines have any explicit size. NHTSA is **not** a size catalog; size pages are a lower bound. A size/fitment feed is needed for complete size and vehicle pages.
- NHTSA `active` is false on all records, and complaint/recall counts are zero on all records, so neither is used. No "currently sold" flag.
- NHTSA has **no prices and no warranty mileage**. Cost per mile is formula/user-input only: `cost per 1,000 mi = price per set / (expected miles / 1000)`. Anything unsourced shows "price data pending feed" / "unverified".
- ~20 size strings are not parsed (e.g. `HL295/30R21`, `ZRF` forms); backlog.

## 4. Price/size feeds (to evaluate; terms NOT verified, none applied for)
| Feed | Would supply | Verify before use |
|---|---|---|
| SimpleTire via CJ Affiliate | sizes, prices, links, maybe images | CJ program terms, commission rate, cookie window, whether product feed/API is offered to new publishers, whether warranty mileage field exists, rules on displaying prices (staleness/disclaimers) |
| Tire Rack via CJ | prices, links | same; confirm Tire Rack participates and allows price display and programmatic content sites |
| Priority Tire via Awin | sizes, prices | Awin program terms, feed fields, approval criteria |
| Amazon Associates / PA-API | price on demand, links | requires qualifying sales; PA-API access and price-display/caching limits; no scraping; 24h price rule |
| Warranty mileage | manufacturer pages | no feed; copy only with permission or from retailer feed fields. Do not scrape |

## 5. SEO checklist
Unique title (<~70 chars) + meta description per page; self-referencing canonical on absolute URL; one h1; answer-first block; extractable HTML tables; last-updated date; cited source with link; breadcrumb nav + BreadcrumbList; ItemList (size, brand pages); FAQPage (visible Q/A only); Dataset on `/data/`; WebPage with dateModified; sitemaps split by type (`sitemap-pages/brands/tires/sizes.xml` + index); internal links (line <-> size <-> brand); no thin pages (publish a line page only if it has a rated record; hold back size pages with <5 lines); 404 noindex; Core Web Vitals (no JS frameworks, no images). *Implemented in prototype.*

## 6. GEO checklist
`/llms.txt` listing key pages; `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot etc.; self-contained answer sentences with numbers at top of each page; tables with explicit column headers; stable definitions in `/methodology/`; downloadable dataset to invite citation; explicit source/date on every page. To add post-launch: Bing Webmaster Tools + IndexNow, monitor AI-referral traffic.

## 7. 30-day launch plan (after Dov decisions: domain, affiliate applications)
- **Days 1-3:** buy/attach domain (Dov decision), set `SITE_URL`, `PREVIEW=0`, verify in Google Search Console + Bing; submit `sitemap-index.xml`; real contact page, privacy policy, final disclosure text.
- **Days 3-7, tranche 1 (~500 pages):** 155 sizes with 10+ lines, top ~300 lines by explicit-size record count (major brands first), all brand hubs for those. Watch Index Coverage and "Crawled - not indexed" daily.
- **Days 8-14:** if >60% indexed, tranche 2 (+~800: sizes with 5-9 lines, next 600 lines). Apply to affiliate programs (Dov-approved) and test feed fields.
- **Days 15-21:** tranche 3 (remaining lines with rated records, up to ~3,400 total) only if tranche 2 is indexing; otherwise prune/merge thin pages. Add 5-8 explainers (what treadwear 600 means, UTQG vs mileage warranty, cost-per-mile guide).
- **Days 22-30:** integrate price feed if approved (price + warranty fields only from the licensed feed), turn on affiliate links with disclosure, evaluate ad network (needs traffic thresholds). Review GSC queries/impressions, CTR, indexation ratio, AI referral logs; decide go/no-go on vehicle pages.
- Kill criteria: <30% indexed by day 21 or no impressions growth by day 30 -> stop expanding, keep what is indexed.

## 8. Risks
Programmatic-content quality (treadgrade.com ~4,500 pages launched days ago, plus Tire Rack, Discount Tire, Consumer Reports); thin size pages given partial NHTSA sizes; UTQG is manufacturer-assigned and weakly predicts real mileage; price feed approval not guaranteed; AI-search click-through.
