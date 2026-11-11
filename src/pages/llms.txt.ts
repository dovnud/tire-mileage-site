import { LEGAL_LINKS } from '../lib/site';
import { COST_PATH, COMPARE_PATH, REPLACE_PATH, HOLIDAY_PATH, REBATE_PATH, AFTER_REBATE_PATH, LOOKUP_PATH, LOAD_INDEX_PATH, SPEED_RATING_PATH, blackFridayPath, cyberMondayPath, loadIndexPath, sizeMeaningPath, speedRatingPath } from '../lib/paths';
import { GUIDES, guideUrl } from '../lib/all-guides';
import { BANDS, TYPES, RIMS, bandUrl, typeUrl, rimUrl } from '../lib/taxonomy';
import { siteLines, siteSizes, siteBrands, S, UPDATED, lineUrl, sizeUrl, SOURCE_URL } from '../lib/data';
import { querySizes } from '../lib/size-facts';
import { EXACT_DATE, EXACT_PAGES, exactPath } from '../lib/exact-match';
import { LOAD_PAGES, SPEED_PAGES } from '../lib/service-ratings';
export const GET = ({ site }: { site: URL }) => {
  const u = (p: string) => new URL(p, site).href;
  const body = `# TireMileage

> Tire treadwear (UTQG) grades from NHTSA data, organized by tire line and by tire size, with a cost-per-mile formula. Source: ${SOURCE_URL} (pulled ${UPDATED}; ${S.raw_records} records, ${S.normalized_lines} lines, ${S.normalized_brands} brands). No prices are included. Maker warranty mileage appears only on a few lines, with the maker's source URL. Amazon retailer links are affiliate links (As an Amazon Associate I earn from qualifying purchases); other retailer links are plain search links. Ads are not live. Pages are being published in stages.

## Key pages
- [Full text corpus](${u('/llms-full.txt')}): markdown body of the guides and key pages
- [Methodology](${u('/methodology/')}): data source, cleaning, definitions, known gaps
${LEGAL_LINKS.map((l) => `- [${l.name}](${u(l.href)}): ${l.desc}`).join('\n')}
- [Dataset downloads](${u('/data/')}): CSV/JSON of normalized NHTSA records
- [Tire lines by brand](${u('/tires/')})
- [Guides](${u('/guides/')}) ([Atom feed](${u('/guides/feed.xml')})); [HTML site map](${u('/sitemap/')})
- [Where to buy](${u('/where-to-buy/')}): TireMileage does not sell tires; it links to Amazon and Discount Tire search results (affiliate disclosure, fitment and DOT-date checks)
- [Tire cost per mile calculator](${u(COST_PATH)}): one quote, user-entered price and miles; takes the size as an input (?size=225-65r17).
- [Compare two tires: cost per mile](${u(COMPARE_PATH)}): user-entered prices only; cost per 1,000 miles and break-even miles. A size page can open it with that size selected (?size=225-65r17).
- [Cost per mile after a rebate](${u(AFTER_REBATE_PATH)}): user-entered price, rebate, and miles; NHTSA treadwear when a line is picked; rebate amounts are not filled in
- [Tire rebate lookup, November and December 2026](${u(REBATE_PATH)}): manufacturer purchase windows only where the maker’s own page states them; sources and dates linked
- [When to replace your tires](${u(REPLACE_PATH)}): 2/32 inch, 4/32 inch wet and snow notes, and age guidance, each with a source
- [Holiday 2026 gift guide](${u(HOLIDAY_PATH)}): winter tires and tire gear; Amazon searches; rebate dates only where a maker page publishes them for 2026
- [Exact tire lookups](${u(LOOKUP_PATH)}): common sizes with fewer than ten NHTSA lines, tire lines filed mostly as “All sizes,” Michelin load and speed charts, the November 27 and November 30, 2026 date pages, and ${EXACT_PAGES.length} query pages. The first set was read ${EXACT_DATE}. Later mileage, treadwear, comparison, and longest-warranty pages use the date on each URL.

## Exact-match queries
Each page opens with the answer, a table, and the primary source. Warranty miles and rebate amounts are the maker’s words. “Best mileage” means the highest UTQG treadwear grade NHTSA filed for that size, not a road test and not a warranty.
${EXACT_PAGES.map((p) => `- [${p.h1}](${u(exactPath(p.slug))}): ${p.answer.split('. ').slice(0, 2).join('. ')}.`).join('\n')}
- [Black Friday 2026 tire rebate dates](${u(blackFridayPath)}): Friday, November 27, 2026. Maker windows only. No sale price.
- [Cyber Monday 2026 tire rebate dates](${u(cyberMondayPath)}): Monday, November 30, 2026. Last day of several maker purchase windows. General Tire’s November 30 date is a submission deadline. No sale price.
- [Load index chart](${u(LOAD_INDEX_PATH)}): Michelin kilograms for indexes 70–120. Pound cells only where Michelin USA’s chart was checked.
${LOAD_PAGES.map((p) => `- [Load index ${p.code}](${u(loadIndexPath(p.code))}): ${p.kg} kg per tire on Michelin’s chart${p.usKgAgrees ? `; Michelin USA prints ${p.lb.toLocaleString('en-US')} lb and ${p.usKg} kg` : `; Michelin USA prints ${p.lb.toLocaleString('en-US')} lb. The USA kilogram cell does not match and is not used`}.`).join('\n')}
- [Speed rating chart](${u(SPEED_RATING_PATH)}): letters L through Y where both Michelin charts agree
${SPEED_PAGES.map((r) => `- [Speed rating ${r.letter}](${u(speedRatingPath(r.letter))}): ${r.mph} mph (${r.kmh} km/h)`).join('\n')}
- [Sizes ranked by treadwear](${u('/sizes/')})

## Guides (each cites its sources and shows a last-updated date)
${GUIDES.map((g) => `- [${g.h1}](${u(guideUrl(g))}): ${g.answer.split('. ')[0]}.`).join('\n')}

## Browse by treadwear band, category and rim diameter
${BANDS.map((b) => `- [Treadwear ${b.label}](${u(bandUrl(b))})`).join('\n')}
${TYPES.map((x) => `- [${x.label} (name markers only)](${u(typeUrl(x))})`).join('\n')}
${RIMS.map((r) => `- [${r}-inch rim](${u(rimUrl(r))})`).join('\n')}

## Tire sizes
Each size below has a treadwear ranking, a page that decodes the size code (overall diameter is calculated from the code and labeled as a calculation, not a measurement), and a cost-per-mile page that uses a price and miles you type. No prices are stored. Load index, speed rating and vehicle fitment are not stated. Some published sizes have fewer than ten graded lines; the count is only the lines NHTSA names for that size.
${siteSizes.map((s) => {
  const extra = querySizes.some((q) => q.key === s.key) ? ` [What ${s.label} means](${u(sizeMeaningPath(s.key))}).` : '';
  return `- [${s.label}](${u(sizeUrl(s.key))}): ${s.lines} lines ranked by NHTSA treadwear.${extra}`;
}).join('\n')}

## Brands
${siteBrands.map((b) => `- [${b.name}](${u(`/tires/${b.slug}/`)}): ${b.lines.length} line page(s)`).join('\n')}

## Optional
${siteLines.map((l) => `- [${l.brand} ${l.line}](${u(lineUrl(l))})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
