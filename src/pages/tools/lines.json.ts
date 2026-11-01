import { siteLines, recordsFor, sizeSet, lineUrl } from '../../lib/data';
import { MAKER_FACTS } from '../../lib/makers';
import { buildRetailerUrl } from '../../lib/retailers';

/** Lines the compare tool can pick. No prices. Warranty text only when a maker page is cited in makers.ts. */
export function GET() {
  const lines = siteLines.map((l) => {
    const key = `${l.brand_slug}/${l.line_slug}`;
    const fact = MAKER_FACTS[key];
    const sizes = [...new Set(recordsFor(l).map((r) => r.size_key).filter((k): k is string => !!k && sizeSet.has(k)))];
    return {
      name: `${l.brand} ${l.line}`,
      url: lineUrl(l),
      wear: l.wear_median,
      warranty: fact?.warranty?.text ?? null,
      warrantyUrl: fact?.warranty?.sourceUrl ?? null,
      warrantyLabel: fact?.warranty?.sourceLabel ?? null,
      sizes,
      amazon: buildRetailerUrl('amazon', l.brand, l.line, key),
      discount: buildRetailerUrl('discount-tire', l.brand, l.line, key),
    };
  });
  return new Response(JSON.stringify({ lines }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
