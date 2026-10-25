// Guides: every factual claim is attributed to a page we actually fetched (see SRC), or computed from the NHTSA dataset at build time.
// Illustrative numbers are labelled "made-up" in the text. No prices, no invented statistics.
import { allLines, allSizes, hasLine, lineUrl, sizeSet, sizeUrl, S, UPDATED, fmt, median } from './data';
import records from '../../data/normalized/records.json';
import { BANDS, TYPES, ratedLines, bandUrl, typeUrl, rimUrl, share } from './taxonomy';

export interface Source { id: string; label: string; url: string; publisher: string }
const R = UPDATED;
export const SRC: Record<string, Source> = {
  cfr104: { id: 'cfr104', label: '49 CFR § 575.104 Uniform tire quality grading standards', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-575/subpart-B/section-575.104', publisher: 'U.S. Code of Federal Regulations (eCFR)' },
  cfr574: { id: 'cfr574', label: '49 CFR § 574.5 Tire identification requirements', url: 'https://www.law.cornell.edu/cfr/text/49/574.5', publisher: 'Cornell Legal Information Institute (text of the CFR)' },
  nhtsa: { id: 'nhtsa', label: 'TireWise: Tire Safety Ratings and Awareness', url: 'https://www.nhtsa.gov/vehicle-safety/tires', publisher: 'NHTSA' },
  tiaReplace: { id: 'tiaReplace', label: 'Tire Replacement', url: 'https://www.tireindustry.org/resources/consumer-education/consumer-safety-overview/tire-replacement/', publisher: 'Tire Industry Association' },
  tiaRotation: { id: 'tiaRotation', label: 'Tire Rotation', url: 'https://www.tireindustry.org/resources/consumer-education/consumer-safety-overview/tire-rotation/', publisher: 'Tire Industry Association' },
  tiaPressure: { id: 'tiaPressure', label: 'Tire Inflation Pressure', url: 'https://www.tireindustry.org/resources/consumer-education/consumer-safety-overview/tire-inflation-pressure/', publisher: 'Tire Industry Association' },
  tiaSidewall: { id: 'tiaSidewall', label: 'Reading a Tire Sidewall', url: 'https://www.tireindustry.org/resources/consumer-education/consumer-safety-overview/reading-a-tire-sidewall/', publisher: 'Tire Industry Association' },
  ustma: { id: 'ustma', label: 'Tire Care Essentials', url: 'https://www.ustires.org/tire-care-safety/tire-care-essentials', publisher: 'U.S. Tire Manufacturers Association' },
  michelinSeasons: { id: 'michelinSeasons', label: 'Summer vs. Winter vs. All-Season Tires', url: 'https://www.michelinman.com/auto/auto-tips-and-advice/tire-buying-guide/summer-winter-all-season-tires', publisher: 'Michelin USA' },
  michelinRatings: { id: 'michelinRatings', label: 'Tire Load Rating & Speed Rating Explained', url: 'https://www.michelinman.com/auto/auto-tips-and-advice/tires-101/tire-load-rating-speed-rating', publisher: 'Michelin USA' },
  michelinTest: { id: 'michelinTest', label: 'Michelin launches Defender 2 tire (press release, Sept. 14, 2022)', url: 'https://michelinmedia.com/defender2/', publisher: 'Michelin North America' },
  coopers: { id: 'coopers', label: 'All-Season vs. All-Weather Tires', url: 'https://www.coopertire.com/en_US/tire-education/tire-safety/all-season-vs-all-weather.html', publisher: 'Cooper Tire' },
  contiWarranty: { id: 'contiWarranty', label: 'Mileage Warranty (support article, updated June 12, 2026)', url: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty', publisher: 'Continental Tire' },
};
export interface Faq { q: string; a: string }
export interface Guide { slug: string; title: string; h1: string; description: string; kicker: string; updated: string; answer: string; body: string; faqs: Faq[]; sources: string[]; sizes: string[]; lines: string[]; related: string[] }

// ---------- helpers ----------
export const A = (href: string, t: string) => `<a href="${href}">${t}</a>`;
export const X = (id: string, t?: string) => `<a href="${SRC[id].url}" rel="noopener">${t ?? SRC[id].publisher}</a>`;
export const Z = (k: string) => { const s = allSizes.find((x) => x.key === k); return s ? (sizeSet.has(k) ? A(sizeUrl(k), s.label) : s.label) : k; };
export const lineOf = (k: string) => allLines.find((l) => `${l.brand_slug}/${l.line_slug}` === k);
export const Ln = (k: string, label?: string) => { const l = lineOf(k); if (!l) return label ?? k; const t = label ?? `${l.brand} ${l.line}`; return hasLine(l) ? A(lineUrl(l), t) : t; };
const isNum = (c: unknown) => /^[~$]?[\d,.]+(%| mph| miles)?$/.test(String(c));
export const table = (head: string[], rows: (string | number)[][], note = '') => `<div class="tw"><table><thead><tr>${head.map((h, i) => `<th${i && rows.length && isNum(rows[0][i]) ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i && isNum(c) ? ' class="n"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${note ? `<p class="tbl-note">${note}</p>` : ''}`;
export const nf = (n: number) => n.toLocaleString('en-US');

// ---------- computed facts ----------
const recT = records.filter((r) => r.treadwear != null) as { treadwear: number; traction: string | null; temperature: string | null }[];
export const nRec = recT.length;
export const notMult20 = recT.filter((r) => r.treadwear % 20 !== 0).length;
const rb = (lo: number, hi: number) => recT.filter((r) => r.treadwear >= lo && r.treadwear <= hi).length;
export const myDist = [['200 or below', rb(0, 200)], ['201–300', rb(201, 300)], ['301–400', rb(301, 400)], ['401–500', rb(401, 500)], ['501–600', rb(501, 600)], ['Above 600', rb(601, 9999)]] as [string, number][];
export const nhtsaDist = ['15%', '25%', '32%', '20%', '6%', '2%'];
export const gradeShare = (f: 'traction' | 'temperature', g: string) => share(records.filter((r) => r[f] === g).length, records.filter((r) => r[f]).length);
export const nRatedLines = ratedLines.length;
export const lines600 = ratedLines.filter((l) => l.wear_median >= 600).length;
export const lineRange = (k: string) => { const l = lineOf(k)!; return { min: l.wear_min as number, max: l.wear_max as number, med: l.wear_median as number, name: `${l.brand} ${l.line}` }; };
export const rg = (a: number, b: number, f = (n: number) => nf(n)) => (a === b ? f(a) : `${f(a)}–${f(b)}`);

// Michelin's own test (press release): estimated life in miles, 225/65R17 on 2021 Toyota RAV4
const MT: [string, string, number][] = [['michelin/defender-2', 'Michelin Defender2', 94400], ['continental/truecontact-tour', 'Continental TrueContact Tour', 59400], ['goodyear/assurance-maxlife', 'Goodyear Assurance MaxLife', 51900], ['bridgestone/alenza-as-ultra', 'Bridgestone Alenza AS Ultra', 47700]];
export const mtRows = MT.map(([k, nm, mi]) => { const r = lineRange(k); return { k, nm, mi, ...r, perPt: mi / r.med }; });
export const mtLo = Math.min(...mtRows.map((r) => r.perPt)), mtHi = Math.max(...mtRows.map((r) => r.perPt));

// Continental warranty table (support article, by speed rating) matched by hand to NHTSA line names
const CW: [string, string, number, number][] = [
  ['continental/procontact-tx', 'ProContact TX', 40000, 65000], ['continental/procontact-gx', 'ProContact GX', 40000, 65000], ['continental/procontact-rx', 'ProContact RX', 40000, 55000],
  ['continental/contiprocontact', 'ContiProContact', 40000, 80000], ['continental/extremecontact-dws06-plus', 'ExtremeContact DWS06 Plus', 50000, 50000], ['continental/extremecontact-sport-02', 'ExtremeContact Sport 02', 30000, 30000],
  ['continental/controlcontact-sport-a-s', 'ControlContact Sport A/S', 50000, 50000], ['continental/crosscontact-lx25', 'CrossContact LX25', 65000, 70000], ['continental/purecontact-ls', 'PureContact LS', 70000, 70000],
  ['continental/terraincontact-a-t', 'TerrainContact A/T', 60000, 60000], ['continental/terraincontact-h-t', 'TerrainContact H/T', 60000, 70000], ['continental/truecontact-tour', 'TrueContact Tour', 70000, 80000],
];
export const cwRows = CW.filter(([k]) => lineOf(k)).map(([k, nm, lo, hi]) => { const r = lineRange(k); return { k, nm, lo, hi, ...r }; });

// cost-per-mile worked example (MADE-UP inputs)
export const ex = { aSet: 800, aMi: 60000, bSet: 650, bMi: 45000, annual: 12000 };
export const per1k = (set: number, mi: number) => (set / (mi / 1000)).toFixed(2);

export const SIZE_EX = '225-65r17';
const sizeEx = allSizes.find((s) => s.key === SIZE_EX)!;
export const exRows = sizeEx.rows.filter((r) => r.wear_min != null);
export const exTop = [...exRows].sort((a, b) => (b.wear_min as number) - (a.wear_min as number));
export const exMed = median(exRows.map((r) => r.wear_min as number))!;
export const rgn = (a: number, b: number) => (a === b ? String(a) : `${a}–${b}`);
export { allLines, allSizes, S, UPDATED, fmt, R, BANDS, TYPES, ratedLines, bandUrl, typeUrl, rimUrl, share, records };
