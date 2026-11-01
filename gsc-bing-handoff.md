# Google Search Console + Bing Webmaster handoff (written 2026-10-25, America/Los_Angeles)

Site is LIVE at https://tiremileage.com (tranche 1 only: 580 URLs). www 301-redirects to the apex. TLS: Google Trust Services cert, active on apex and www.

## Sitemap to submit
**https://tiremileage.com/sitemap-index.xml** (also listed in robots.txt)

| Sitemap | URLs |
|---|---|
| sitemap-pages.xml | 7 |
| sitemap-guides.xml | 11 |
| sitemap-tags.xml (treadwear/type/rim hubs) | 28 |
| sitemap-brands.xml | 79 |
| sitemap-tires.xml (tire lines) | 300 |
| sitemap-sizes.xml | 155 |
| **Total** | **580** |

## What is already done
- Custom domains attached to Pages project `tiremileage`; proxied CNAMEs for apex + www in the Cloudflare zone (zone id a9582114ce9d1754f7992c6f1a6bc282, active).
- Redirect rule www -> https://tiremileage.com (301, path + query kept).
- No noindex meta or X-Robots-Tag on tiremileage.com. `*.pages.dev` hosts send `X-Robots-Tag: noindex, nofollow` (via `_headers` host rule) and canonicalize to the apex.
- IndexNow: key `132af5ae30527fe60ecbefc2202789c1`, file at https://tiremileage.com/132af5ae30527fe60ecbefc2202789c1.txt. All 580 URLs submitted to api.indexnow.org and www.bing.com/indexnow on 2026-10-25 (HTTP 200 on both).

## Still needed from the site owner (ownership verification; cannot be done by the bot without a login or token)
### Google Search Console (Domain property, DNS TXT)
1. https://search.google.com/search-console -> Add property -> **Domain** -> `tiremileage.com`.
2. Google shows a TXT record like `google-site-verification=XXXXXXXX`. Give that exact string to the bot (or add it yourself).
3. Cloudflare DNS editing through the API/MCP works (the CNAMEs were created that way), so the bot can add: type TXT, name `@` (tiremileage.com), content = the token string, TTL auto. Then click Verify in GSC.
4. Sitemaps -> add `sitemap-index.xml`.
5. Optionally URL Inspection -> Request indexing on the home page and a few key pages.

### Bing Webmaster Tools
1. https://www.bing.com/webmasters -> sign in -> Add site `https://tiremileage.com`. Easiest path: **Import from Google Search Console** once GSC is verified (no extra DNS step).
2. Alternative: choose the **CNAME** method (Bing gives `name` + `…verify.bing.com` target) or the XML file / meta tag; the bot can add the CNAME in Cloudflare DNS, or the file can be added to `public/` and redeployed.
3. Submit `https://tiremileage.com/sitemap-index.xml`. IndexNow pings already sent; Bing shows them under Site Explorer / IndexNow.

## Monitoring (from PLAN.md)
Tranche 1 = 300 lines + 155 sizes + hubs + guides. Watch "Crawled - currently not indexed" daily. Kill/hold rule: if < 30% of the 580 URLs are indexed by day 21 (2026-11-15), stop expanding. If > 60% indexed by about day 8-14, consider tranche 2 (sizes with 5-9 lines, next ~600 lines).

## Redeploy / resubmit
Production publishes when `main` is pushed. Pages project `tiremileage` builds with `PREVIEW=0 node scripts/copy-downloads.mjs && npm run build:launch` and publishes `dist/` plus `functions/`. Do not direct-upload with wrangler; that replaces the Git deployment.
```
npm run build:launch && PREVIEW=0 npm run check
PREVIEW=0 SITE_URL=https://tiremileage.com node scripts/indexnow.mjs --submit
```
