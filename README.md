# tire-mileage-site
Static Astro prototype: NHTSA UTQG tire treadwear lookup + cost-per-mile calculator. See `PLAN.md`.

```
nvm use          # Node 22.23.4+
npm install
python3 scripts/pull_nhtsa.py && python3 scripts/normalize.py   # optional: refresh data
npm run build              # ~57-page prototype (noindex preview)
npm run build:full         # all lines + sizes with 5+ lines (~3.4k pages)
```
Env: `SITE_URL` (canonical origin), `PREVIEW=0` (drop noindex), `FULL=1`.
Data: NHTSA tire ratings API (US government work). No prices are shown. Maker warranties only where cited (`src/lib/makers.ts`). Ads are hidden (`ADS_ENABLED=false` in `src/lib/site.ts`).

Retailer links: all built by `buildRetailerUrl(retailer, brand, line)` in `src/lib/retailers.ts`. Plain links today; the affiliate wrapper is a TODO stub, off by default (`AFFILIATE_ENABLED=false`) — CJ is not approved.

```
npm run check        # broken links, duplicate titles, JSON-LD, noindex, rel attrs (needs a build)
npm run screenshots  # desktop/mobile PNGs into screenshots/
npm run deploy       # build + wrangler pages deploy (needs CLOUDFLARE_API_TOKEN); project: tiremileage
```

