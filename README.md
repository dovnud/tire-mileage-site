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

Retailer links: all built by `buildRetailerUrl(retailer, brand, line)` in `src/lib/retailers.ts`. Amazon links carry the Amazon Associates tag `tag=tiremileage-20` (override with env `AMAZON_TAG` at build time; empty disables). All other retailers stay plain; CJ is not approved. `rel="sponsored nofollow noopener"` and the disclosure "As an Amazon Associate I earn from qualifying purchases." (footer, disclosure strip, Where-to-buy, About, Methodology) must stay: `npm run check` asserts both.

Operational note (unverified for this account): Amazon's Associates Program Operating Agreement, section 5, requires that exact statement to be clearly and prominently displayed (https://affiliate-program.amazon.com/help/operating/agreement, read 2026-10-25). The agreement page does not state the account-approval or qualifying-sales requirements, so those are not documented here; confirm account status in Associates Central.

```
npm run check        # broken links, duplicate titles, JSON-LD, noindex, rel attrs (needs a build)
npm run screenshots  # desktop/mobile PNGs into screenshots/
npm run deploy       # build + wrangler pages deploy (needs CLOUDFLARE_API_TOKEN); project: tiremileage
```


## Launch (tranche 1)
```
npm run build:launch   # PREVIEW=0 TRANCHE=1 SITE_URL=https://tiremileage.com, writes dist/_headers + IndexNow key file
PREVIEW=0 npm run check
npx wrangler pages deploy dist --project-name tiremileage --branch main
PREVIEW=0 SITE_URL=https://tiremileage.com node scripts/indexnow.mjs --submit
```
IndexNow key lives in `indexnow-key.txt` (public by design; served at `/<key>.txt`). See `gsc-bing-handoff.md`.
