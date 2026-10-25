import lines from '../../data/normalized/lines.json';
import sizes from '../../data/normalized/sizes.json';
import records from '../../data/normalized/records.json';
import summary from '../../data/normalized/summary.json';

export type Line = (typeof lines)[number] & { brand_rank?: number; brand_lines_rated?: number };
export type Rec = (typeof records)[number];
export const S = summary;
export const FULL = process.env.FULL === '1';
export const PREVIEW = process.env.PREVIEW !== '0'; // pre-launch: noindex until a real domain is chosen
export const UPDATED = S.pulled_at.slice(0, 10);
export const SOURCE_URL = 'https://api.nhtsa.gov/tires?dataSet=ratings';
export const NHTSA_GUIDE = 'https://www.nhtsa.gov/vehicle-safety/tires';
export const CFR_URL = 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-575/subpart-B/section-575.104';

export const allLines = lines as Line[];
export const allSizes = sizes;

const recsByLine = new Map<string, Rec[]>();
for (const r of records) {
  const k = `${r.brand_slug}/${r.line_slug}`;
  (recsByLine.get(k) ?? recsByLine.set(k, []).get(k)!).push(r);
}
export const recordsFor = (l: { brand_slug: string; line_slug: string }) => recsByLine.get(`${l.brand_slug}/${l.line_slug}`) ?? [];

// ---- Prototype selection (full build = every line + every size with >=5 lines) ----
const MAJOR = ['continental', 'michelin', 'yokohama', 'goodyear', 'bridgestone', 'toyo', 'falken', 'hankook', 'nexen', 'pirelli'];
function pickPrototypeLines(): Line[] {
  const per: Record<string, number> = {};
  const out: Line[] = [];
  const cand = [...allLines].filter((l) => MAJOR.includes(l.brand_slug) && l.wear_median != null)
    .sort((a, b) => b.records_with_explicit_size - a.records_with_explicit_size);
  for (const l of cand) {
    if ((per[l.brand_slug] ?? 0) >= 3) continue;
    per[l.brand_slug] = (per[l.brand_slug] ?? 0) + 1;
    out.push(l);
    if (out.length >= 28) break;
  }
  return out;
}
export const MIN_SIZE_LINES = 5;
export const siteLines: Line[] = FULL ? allLines.filter((l) => l.wear_median != null) : pickPrototypeLines();
export const siteSizes = FULL ? allSizes.filter((s) => s.lines >= MIN_SIZE_LINES) : allSizes.slice(0, 12);
export const lineSet = new Set(siteLines.map((l) => `${l.brand_slug}/${l.line_slug}`));
export const sizeSet = new Set(siteSizes.map((s) => s.key));
export const siteBrands = (() => {
  const m = new Map<string, { slug: string; name: string; lines: Line[] }>();
  for (const l of siteLines) (m.get(l.brand_slug) ?? m.set(l.brand_slug, { slug: l.brand_slug, name: l.brand, lines: [] }).get(l.brand_slug)!).lines.push(l);
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name));
})();
export const hasLine = (l: { brand_slug: string; line_slug: string }) => lineSet.has(`${l.brand_slug}/${l.line_slug}`);
export const lineUrl = (l: { brand_slug: string; line_slug: string }) => `/tires/${l.brand_slug}/${l.line_slug}/`;
export const sizeUrl = (k: string) => `/sizes/${k}/`;

// ---- helpers ----
export function median(a: number[]) { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
export const fmt = (n: number | null | undefined) => (n == null ? '—' : Number.isInteger(n) ? String(n) : n.toFixed(1));
export const range = (a: number | null, b: number | null) => (a == null ? '—' : a === b ? String(a) : `${a}–${b}`);
export const pct = (p: number | null | undefined) => (p == null ? '—' : `${Math.round(p)}`);
export const ordinal = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

export function wearBand(w: number) {
  if (w < 200) return { band: 'under 200', text: 'a short-wear, performance-oriented grade. Tires in this range typically trade tread life for grip, and wear fastest in the UTQG scale.' };
  if (w < 300) return { band: '200–299', text: 'a lower-than-typical treadwear grade, common on sport and high-performance tires.' };
  if (w < 400) return { band: '300–399', text: 'a moderate treadwear grade, near the middle of NHTSA-rated tires.' };
  if (w < 500) return { band: '400–499', text: 'an above-average treadwear grade, typical of many touring and all-season tires.' };
  if (w < 600) return { band: '500–599', text: 'a high treadwear grade; the manufacturer rates this tire to wear slowly relative to the government control tire.' };
  return { band: '600 and up', text: 'a very high treadwear grade, the top end of the UTQG scale.' };
}
export const TRACTION: Record<string, string> = {
  AA: 'AA (highest): best wet-pavement straight-line braking grade on the government test surfaces.',
  A: 'A: second-highest wet-braking grade.',
  B: 'B: middle wet-braking grade.',
  C: 'C (lowest): may have poor wet-braking performance relative to other graded tires.',
};
export const TEMPERATURE: Record<string, string> = {
  A: 'A (highest): resisted heat build-up through the higher 575 rpm test stage.',
  B: 'B: passed the 500 rpm stage but not the 575 rpm stage.',
  C: 'C (lowest): the minimum level that every passenger tire must meet under federal safety standards.',
};
export function mostCommon(o: Record<string, number>) { const e = Object.entries(o).sort((a, b) => b[1] - a[1]); return e.length ? e[0][0] : null; }
export const trendLabel = (o: Record<string, number>) => Object.entries(o).sort().map(([k, v]) => `${k} ×${v}`).join(', ') || '—';
export const jsonLd = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');
