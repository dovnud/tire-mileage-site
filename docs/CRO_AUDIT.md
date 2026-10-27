# CRO audit — TireMileage

Live review of https://tiremileage.com on 27 Oct 2026 at 390×844 and 1280×900 (homepage, 225/65R17, Michelin Defender 2, two guides, tire and guide hubs, Where to buy, contact, affiliate disclosure), plus the Astro source. Expert estimates, not measured data. No traffic or revenue figures.

## 1. Conversion score

**4/10.** Size and line pages show a real Amazon button with `tag=tiremileage-20`, but the live homepage has no `amazon.com` link, the phone header pushes the size field below the first screen, and every shop control shares the tap with a Discount Tire link that the disclosure says earns nothing.

**Typical visitor’s chance of an affiliate click: low.** The click sits on size and line pages only, opens search results, and one of the two equal buttons is non-paying.

## 2. Scorecard (1–5)

| Item | Score | Note |
| --- | --- | --- |
| First impression | 4 | Headline and NHTSA line are clear in five seconds. |
| CTA visibility | 3 | Strong on line pages (desktop buttons, mobile sticky bar). Size shop is below the answer on mobile. Home and live guides have no shop button in the first screen. |
| CTA wording | 4 | “Check price on Amazon” is specific. Cards say “View & shop”. |
| Disclosure | 5 | Strip, button, footer, and `/affiliate-disclosure/` use the Associates sentence and `rel="sponsored nofollow noopener"`. |
| Mobile | 3 | 44px targets. Seven nav links wrap to three rows and push the lookup down. |
| Navigation | 4 | Search, crumbs, chips, and guide links work. Methodology and Data are in the header. |
| Trust | 5 | NHTSA, dates, methodology, legal pages, byline TireMileage, contact@tiremileage.com. |
| Design | 4 | Readable; gold vs blue. Phone disclosure is three lines. |
| Speed feel | 5 | ~25KB CSS, system fonts, 20–82KB HTML. Felt immediate. |
| Accessibility | 4 | Skip link, labels, focus rings. Sticky-bar type is small. |

## 3. Top 10 fixes

1. **Shorter mobile header** — `Base.astro`, `global.css`. Under 860px show Tire lines, Sizes, Where to buy, Guides. **S / high.** Puts the size field on the first phone screen.
2. **Amazon button on homepage cards** — `TireCard.astro`. “Check price on Amazon” via `buildRetailerUrl`, above “View & shop”. **S / high.** Live homepage has zero affiliate links; cards already feature Defender 2 and similar.
3. **One filled button** — `ShopCta.astro`, `ShopBar.astro`, `ShopSize.astro`, `ShopMini.astro`. Gold “Check price on Amazon”; Discount Tire as “Search at Discount Tire (plain link)”. Keep the Associates sentence. **S / high.**
4. **Sticky Amazon bar on size pages** — `sizes/[size].astro`, `buildSizeRetailerUrl`. **S / high.** Mobile shop block is below the answer.
5. **Guide button above the answer** — `guides/[slug].astro`. Source already inserts `ShopSize` after the answer; move it above the answer and add `ShopCta` for `lines[0]`. One text repeat before Sources. **S / high.** Live guide HTML had no retailer URL.
6. **Where to buy as a button** — `where-to-buy.astro`. Source has text links for four sizes; use one `sbtn-amz` under the form. **S / med.**
7. **Homepage field under the H1** — `index.astro`. Remove the extra “Find tires for your size” heading. **S / med.** At 1280×900 the field is at or just under the first screen.
8. **“Traction A or AA” block** — `sizes/[size].astro`. Three rows, one Amazon button each. **M / med.** The top 225/65R17 grade is a less familiar line.
9. **Ads after shop blocks only** — `AdSlot.astro`. Keep `ADS_ENABLED` false until privacy, affiliate disclosure, and `ads.txt` mention ads. Slots `home-mid`, `size-mid`, `line-sidebar`, labeled “Advertisement”. **M / med (AdSense).**
10. **Second program** — `retailers.ts`, only after that program approves this site; update the disclosure the same day. Amazon stays `tag=tiremileage-20`. **M / med.**

## 4. Primary CTA by page

**Home:** size field under the H1, then a gold Amazon button on each card. **Size:** that button under the H1 and on each card; mobile sticky bar is Amazon only. **Line:** under the H1, beside the dial on desktop; sticky bar on mobile, with Discount Tire as text. **Guide:** one Amazon button between the H1 and the answer, plus a text repeat before Sources. **Hubs:** “View & shop” to `#shop-this-tire`; guide cards stay editorial. **Where to buy:** gold button under the form. **Contact and legal:** no shop button; footer keeps the Associates sentence; mail is contact@tiremileage.com.

## 5. Quick wins

Same as fixes 1, 3, 5, and 6: four header links under 860px, one-line mobile disclosure that still contains the exact Associates sentence, `ShopSize` above the guide answer, one gold button on Where to buy, Amazon-only sticky bar.

## 6. Moneymaker scale

**Current moneymaker score: 3/10** (expert estimate).

- **Affiliate 4/10.** Tag, wording, and disclosures are solid on size and line pages. Homepage and live guides do not link out. Discount Tire is an equal button and pays nothing. Links open search, not a product.
- **AdSense 2/10.** Ads are off (no unit in live HTML, `/ads.txt` 404, privacy says no ads). Guides, methodology, and contact are the right base for a later application.
- **Leads: later.**

| After this | Score | Effort | Channel |
| --- | --- | --- | --- |
| Amazon button on homepage cards, above the guide answer, and on Where to buy | 3 → 4 | S | Affiliate |
| Amazon as the only filled button; size-page sticky bar; shorter mobile header | 4 → 5 | S | Affiliate |
| Three-row traction comparison, one Amazon button per row | 5 → 6 | M | Affiliate |
| Second approved program in `retailers.ts`, disclosure updated the same day | 6 → 7 | M | Affiliate |
| Privacy + disclosure + `ads.txt`; slots only below shop blocks on guides and the line sidebar | 7 → 8 | M | AdSense |
| Size and category guides that end in the ranking plus one Amazon button, linked from those pages | 8 → 9 | L | Affiliate, AdSense |
| Later: “email this size ranking” at contact@tiremileage.com, and product links only from a licensed catalog (no invented prices) | 9 → 10 | L | Leads, affiliate |

**Would lower the score:** a sticky ad plus the shop bar, or any ad above the H1; extra equal buttons, timers, stock claims, or reviews; dropping the Associates sentence or using any tag other than `tiremileage-20`; ads while privacy still says there are none; thin doorway pages; scraped prices. Fix 1–6 above are the wording and the files.
