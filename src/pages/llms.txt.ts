import { LEGAL_LINKS } from '../lib/site';
import { COMPARE_PATH, REPLACE_PATH, HOLIDAY_PATH } from '../lib/paths';
import { GUIDES, guideUrl } from '../lib/all-guides';
import { BANDS, TYPES, RIMS, bandUrl, typeUrl, rimUrl } from '../lib/taxonomy';
import { siteLines, siteSizes, siteBrands, S, UPDATED, lineUrl, sizeUrl, SOURCE_URL } from '../lib/data';
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
- [Compare two tires: cost per mile](${u(COMPARE_PATH)}): user-entered prices only; cost per 1,000 miles and break-even miles
- [When to replace your tires](${u(REPLACE_PATH)}): 2/32 inch, 4/32 inch wet and snow notes, and age guidance, each with a source
- [Holiday 2026 gift guide](${u(HOLIDAY_PATH)}): winter tires and tire gear; Amazon searches; rebate dates only where a maker page publishes them for 2026
- [Sizes ranked by treadwear](${u('/sizes/')})

## Guides (each cites its sources and shows a last-updated date)
${GUIDES.map((g) => `- [${g.h1}](${u(guideUrl(g))}): ${g.answer.split('. ')[0]}.`).join('\n')}

## Browse by treadwear band, category and rim diameter
${BANDS.map((b) => `- [Treadwear ${b.label}](${u(bandUrl(b))})`).join('\n')}
${TYPES.map((x) => `- [${x.label} (name markers only)](${u(typeUrl(x))})`).join('\n')}
${RIMS.map((r) => `- [${r}-inch rim](${u(rimUrl(r))})`).join('\n')}

## Tire sizes
${siteSizes.map((s) => `- [${s.label}](${u(sizeUrl(s.key))}): ${s.lines} lines ranked by NHTSA treadwear`).join('\n')}

## Brands
${siteBrands.map((b) => `- [${b.name}](${u(`/tires/${b.slug}/`)}): ${b.lines.length} line page(s)`).join('\n')}

## Optional
${siteLines.map((l) => `- [${l.brand} ${l.line}](${u(lineUrl(l))})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
