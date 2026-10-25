import { siteLines, siteSizes, siteBrands, S, UPDATED, lineUrl, sizeUrl, SOURCE_URL } from '../lib/data';
export const GET = ({ site }: { site: URL }) => {
  const u = (p: string) => new URL(p, site).href;
  const body = `# TireMileage

> Tire treadwear (UTQG) grades from NHTSA data, organized by tire line and by tire size, with a cost-per-mile formula. Source: ${SOURCE_URL} (pulled ${UPDATED}; ${S.raw_records} records, ${S.normalized_lines} lines, ${S.normalized_brands} brands). No prices are included. Maker warranty mileage appears only on a few lines, with the maker's source URL. Retailer links are plain (non-affiliate) search links. Prototype build; ads are not live.

## Key pages
- [Methodology](${u('/methodology/')}): data source, cleaning, definitions, known gaps
- [Dataset downloads](${u('/data/')}): CSV/JSON of normalized NHTSA records
- [Tire lines by brand](${u('/tires/')})
- [Sizes ranked by treadwear](${u('/sizes/')})

## Tire sizes
${siteSizes.map((s) => `- [${s.label}](${u(sizeUrl(s.key))}): ${s.lines} lines ranked by NHTSA treadwear`).join('\n')}

## Brands
${siteBrands.map((b) => `- [${b.name}](${u(`/tires/${b.slug}/`)}): ${b.lines.length} line page(s)`).join('\n')}

## Optional
${siteLines.map((l) => `- [${l.brand} ${l.line}](${u(lineUrl(l))})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
