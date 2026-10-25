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
Data: NHTSA tire ratings API (US government work). No prices/warranties included; no affiliate links or ads.
