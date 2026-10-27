// Figures computed from the normalized NHTSA file. Guides interpolate these; they are not typed in by hand.
import records from '../../data/normalized/records.json';
import { ratedLines, TYPES, inType, medianOf } from './taxonomy';

export const nRated = ratedLines.length;
export const spreadLines = ratedLines.filter((l) => l.wear_min !== l.wear_max);
export const nSpread = spreadLines.length;
export const nSingleGrade = nRated - nSpread;
const spreadGaps = spreadLines.map((l) => (l.wear_max as number) - (l.wear_min as number)).sort((a, b) => a - b);
export const spreadGapMedian = spreadGaps[spreadGaps.length >> 1];
export const spreadGapMax = spreadGaps[spreadGaps.length - 1];

const isCatchAll = (sizeRaw: string, sizeKey: string) => !sizeKey || /all size/i.test(sizeRaw);

export interface SpreadLine {
  key: string;
  brand: string;
  line: string;
  min: number;
  max: number;
  explicit: number;
  catchAll: boolean;
  rows: { size: string; tw: number; traction: string | null; temperature: string | null }[];
}

const byLine = new Map<string, SpreadLine>();
for (const r of records) {
  if (r.treadwear == null) continue;
  const key = `${r.brand_slug}/${r.line_slug}`;
  const e = byLine.get(key) ?? { key, brand: r.brand, line: r.line, min: Infinity, max: -Infinity, explicit: 0, catchAll: false, rows: [] };
  e.min = Math.min(e.min, r.treadwear);
  e.max = Math.max(e.max, r.treadwear);
  const catchAll = isCatchAll(r.size_raw, r.size_key);
  if (catchAll) e.catchAll = true;
  else e.explicit += 1;
  e.rows.push({ size: r.size_raw, tw: r.treadwear, traction: r.traction, temperature: r.temperature });
  byLine.set(key, e);
}

export const lineFiling = (key: string) => byLine.get(key);

/** Lines whose range comes only from named sizes (no “All sizes” record), at least three sizes, gap of 80 or more. */
export const explicitSpreads = [...byLine.values()]
  .filter((e) => e.explicit >= 3 && !e.catchAll && e.max - e.min >= 80)
  .sort((a, b) => (b.max - b.min) - (a.max - a.min) || a.brand.localeCompare(b.brand) || a.line.localeCompare(b.line));

export const nCatchAllAndRange = [...byLine.values()].filter((e) => e.catchAll && e.max > e.min).length;

export const typeStats = TYPES.map((t) => {
  const ls = inType(t);
  return {
    slug: t.slug,
    label: t.label,
    n: ls.length,
    med: medianOf(ls),
    ge600: ls.filter((l) => (l.wear_median as number) >= 600).length,
    lt300: ls.filter((l) => (l.wear_median as number) < 300).length,
  };
});

export const nOeNamed = ratedLines.filter((l) => /\(OE\)/i.test(l.line)).length;

const rimOfKey = (key: string) => Number(key.match(/r(\d+)$/)?.[1] ?? NaN);
export const nRim12OrLess = records.filter((r) => r.size_key && rimOfKey(r.size_key) <= 12).length;
