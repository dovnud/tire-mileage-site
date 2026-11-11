// Exact-query pages (2026-11-09).
// Warranty miles and rebate dates are copied from the maker page named in SOURCES.
// Treadwear grades are read from the NHTSA file in data/normalized. Nothing here is a price.
import { allLines, allSizes, fmt, hasLine, lineUrl, sizeSet, sizeUrl, trendLabel, type Line } from './data';
import { EXACT_DATE, exactPath, LOOKUP_PATH, REBATE_PATH, blackFridayPath, cyberMondayPath } from './paths';
import { rankSize, type RankedRow } from './size-facts';

export { EXACT_DATE, exactPath };

export interface SourceRef {
  id: string;
  label: string;
  url: string;
  publisher: string;
}

export const SOURCES: Record<string, SourceRef> = {
  nhtsa: {
    id: 'nhtsa',
    label: 'NHTSA tire ratings API (dataset=ratings)',
    url: 'https://api.nhtsa.gov/tires?dataSet=ratings',
    publisher: 'NHTSA',
  },
  cfr104: {
    id: 'cfr104',
    label: '49 CFR § 575.104 Uniform tire quality grading standards',
    url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-575/subpart-B/section-575.104',
    publisher: 'U.S. Code of Federal Regulations (eCFR)',
  },
  michelinFlyer: {
    id: 'michelinFlyer',
    label: 'Michelin 2025 quick guide to mileage warranties (PDF)',
    url: 'https://dgaddcosprod.blob.core.windows.net/cxf-multisite/clsq28vx9001a11mh1x0t9t5w/attachments/s02te3s8qdc8t86vxq13xt10-michelin-2025-quick-guide-warranty-flyer-0525-final.pdf',
    publisher: 'Michelin North America',
  },
  michelinDefender2: {
    id: 'michelinDefender2',
    label: 'Michelin Defender2',
    url: 'https://www.michelinman.com/auto/tires/michelin-defender2',
    publisher: 'Michelin USA',
  },
  contiWarranty: {
    id: 'contiWarranty',
    label: 'Mileage Warranty (support article, updated June 12, 2026)',
    url: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty',
    publisher: 'Continental Tire',
  },
  goodyearWr: {
    id: 'goodyearWr',
    label: 'Assurance WeatherReady 2 product page',
    url: 'https://www.goodyear.com/en-us/tires/assurance-weatherready-2_24987',
    publisher: 'Goodyear',
  },
  goodyearMl: {
    id: 'goodyearMl',
    label: 'Assurance MaxLife 2 product page',
    url: 'https://www.goodyear.com/en-us/tires/assurance-maxlife-2_25310',
    publisher: 'Goodyear',
  },
  goodyearRebate: {
    id: 'goodyearRebate',
    label: 'Current Tire Rebates and Tire Promotions',
    url: 'https://www.goodyear.com/en-us/offers/tire-rebate',
    publisher: 'Goodyear',
  },
  michelinNorth: {
    id: 'michelinNorth',
    label: '2026 Michelin Fall-North Promotion',
    url: 'https://www.michelinman.com/deals-promotions-and-rebates/michelin-auto-winter-2026',
    publisher: 'Michelin USA',
  },
  michelinSouth: {
    id: 'michelinSouth',
    label: '2026 Michelin Fall-South Promotion',
    url: 'https://www.michelinman.com/deals-promotions-and-rebates/michelin-auto-fall-2026',
    publisher: 'Michelin USA',
  },
  bfgFall: {
    id: 'bfgFall',
    label: '2026 BFGoodrich Fall Promotion',
    url: 'https://www.bfgoodrichtires.com/tire-deals-and-promotions/bfg-fall-2026',
    publisher: 'BFGoodrich',
  },
  pirelliNov: {
    id: 'pirelliNov',
    label: 'Pirelli 2026 November Rebate',
    url: 'https://promo.pirelli.com/tyres/en-US/car/november-2026/overview',
    publisher: 'Pirelli',
  },
  pirelliPdf: {
    id: 'pirelliPdf',
    label: '2026 November Consumer Rebate Promotion terms (PDF)',
    url: 'https://corp-assets.pirelli.com/promo/UATPC-0688/November_Rebate_Terms_and_Conditions_2026_V2.pdf',
    publisher: 'Pirelli',
  },
};

const MICHELIN_LIMITS = [
  'The 2025 quick guide says original-equipment tires are not covered for mileage.',
  'On a split fitment (different sizes front and rear), the guide says each tire is covered for half the listed miles, because those tires cannot be rotated the way Michelin recommends.',
  'Zero Pressure tires keep the line’s mileage warranty only up to 30,000 miles.',
  'The guide excludes DOT-approved competition tires. Its example is the Pilot Sport Cup 2.',
  'The guide says conditions and limitations apply and points to the Michelin owner’s manual for the full text. This page does not add terms that are not on the guide.',
];

const CONTINENTAL_LIMITS = [
  'The article says this warranty does not apply to original-equipment tires installed on new vehicles.',
  'Wearout means the tread has worn evenly down to the tread-wear indicators (2/32 inch or 1.6 mm).',
  'Tires must be rotated every 6,000 to 8,000 miles, or sooner if uneven wear appears.',
  'On a staggered or split fitment, rear-axle tires receive half of the standard mileage warranty.',
  'Tires in service longer than 72 months are not covered.',
  'The article includes a pro-rata dollar example. This page does not repeat that price.',
];

/** Michelin’s own 2022 treadwear test, quoted from the Defender2 page on EXACT_DATE. Not an NHTSA grade. */
const MICHELIN_TEST: { lineKey: string; miles: number }[] = [
  { lineKey: 'michelin/defender-2', miles: 94400 },
  { lineKey: 'continental/truecontact-tour', miles: 59400 },
  { lineKey: 'goodyear/assurance-maxlife', miles: 51900 },
  { lineKey: 'bridgestone/alenza-as-ultra', miles: 47700 },
];

const NOTABLE = [
  'michelin/defender-2',
  'michelin/crossclimate2',
  'continental/truecontact-tour',
  'goodyear/assurance-weatherready-2',
  'goodyear/assurance-maxlife-2',
];

export interface Seg { text: string; href?: string }
export interface Cell { text: string; href?: string }
export interface Block {
  kind: 'p' | 'ul' | 'table';
  segs?: Seg[];
  items?: Seg[][];
  head?: string[];
  rows?: Cell[][];
  note?: string;
}
export interface ExactPage {
  slug: string;
  kind: 'warranty' | 'mileage' | 'compare' | 'rebate';
  title: string;
  h1: string;
  description: string;
  kicker: string;
  answer: string;
  blocks: Block[];
  faqs: { q: string; a: string }[];
  sources: SourceRef[];
  lineKeys: string[];
  sizeKey?: string;
  shopLine?: { brand: string; line: string; brandSlug: string; lineSlug: string };
  shopSize?: string;
  /** Rebate pages: last purchase date printed by the maker (YYYY-MM-DD) and the date that end date was last read. */
  endsOn?: string;
  endsReadOn?: string;
  related: { href: string; label: string }[];
}

const lineByKey = new Map(allLines.map((l) => [`${l.brand_slug}/${l.line_slug}`, l]));
const sizeByKey = new Map(allSizes.map((s) => [s.key, s]));

function mustLine(key: string): Line {
  const l = lineByKey.get(key);
  if (!l || l.wear_median == null) throw new Error(`exact-match line missing or unrated: ${key}`);
  return l;
}

function wearText(l: Line): string {
  const span = l.wear_min === l.wear_max ? String(l.wear_min) : `${l.wear_min}–${l.wear_max}`;
  return `${span} (median ${fmt(l.wear_median)})`;
}

function lineLabel(l: Line): string {
  return `${l.brand} ${l.line}`;
}

function lineHref(l: Line): string | undefined {
  return hasLine(l) ? lineUrl(l) : undefined;
}

function srcs(ids: string[]): SourceRef[] {
  return ids.map((id) => {
    const s = SOURCES[id];
    if (!s) throw new Error(`missing source ${id}`);
    return s;
  });
}

function p(text: string): Block {
  return { kind: 'p', segs: [{ text }] };
}

function segs(parts: Seg[]): Block {
  return { kind: 'p', segs: parts };
}

function ul(items: string[]): Block {
  return { kind: 'ul', items: items.map((text) => [{ text }]) };
}

function table(head: string[], rows: Cell[][], note?: string): Block {
  return { kind: 'table', head, rows, note };
}

function clipDesc(d: string): string {
  let s = d.replace(/\s+/g, ' ').trim();
  if (s.length > 155) {
    const cut = s.slice(0, 152);
    const sp = cut.lastIndexOf(' ');
    s = `${cut.slice(0, sp > 80 ? sp : 152).replace(/[,:;–.\s]+$/g, '')}.`;
  }
  if (s.length < 110) s = `${s} NHTSA UTQG grades are not miles.`.replace(/\s+/g, ' ');
  if (s.length > 155) s = s.slice(0, 155).replace(/\s+\S*$/, '').trim();
  if (s.length < 70 || s.length > 160) throw new Error(`description length ${s.length}: ${s}`);
  return s;
}

function clipTitle(t: string): string {
  const s = t.replace(/\s+/g, ' ').trim();
  if (s.length < 15 || s.length > 60) throw new Error(`title length ${s.length}: ${s}`);
  return s;
}

interface WarrantyDef {
  slug: string;
  lineKey: string;
  makerName: string;
  summary: string;
  rows: [string, string][];
  conditions: string[];
  sourceIds: string[];
  extra?: string;
}

const WARRANTIES: WarrantyDef[] = [
  {
    slug: 'michelin-defender-2-mileage-warranty',
    lineKey: 'michelin/defender-2',
    makerName: 'Defender2',
    summary: 'Michelin’s Defender2 page lists an 80,000-mile limited treadwear warranty and says it applies on most sizes. The 2025 quick guide lists 80,000 miles for the H and V speed ratings.',
    rows: [
      ['Product page', '80,000 miles, and the FAQ says “on most sizes”'],
      ['2025 quick guide, H and V, all-season', '80,000 miles'],
    ],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinDefender2', 'michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'Michelin writes Defender2. NHTSA files the same line as Defender 2. The product page also says Defender2 is not a dedicated winter tire and points drivers in severe snow to a winter tire.',
  },
  {
    slug: 'michelin-crossclimate-2-mileage-warranty',
    lineKey: 'michelin/crossclimate2',
    makerName: 'CrossClimate2',
    summary: 'Michelin’s 2025 mileage-warranty quick guide lists 60,000 miles for CrossClimate2 at the H, V, and W speed ratings. The guide classifies that row as all-season.',
    rows: [['2025 quick guide, H, V, and W, all-season', '60,000 miles']],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as CrossClimate2. This page does not add a product-page claim, because the quick guide is the warranty document read for this line.',
  },
  {
    slug: 'michelin-defender-ltx-m-s2-mileage-warranty',
    lineKey: 'michelin/defender-ltx-m-s-2',
    makerName: 'Defender LTX M/S2',
    summary: 'Michelin’s 2025 quick guide lists 75,000 miles for Defender LTX M/S2 at T and H, and 50,000 miles at S. Both rows are all-season.',
    rows: [
      ['2025 quick guide, T and H, all-season', '75,000 miles'],
      ['2025 quick guide, S, all-season', '50,000 miles'],
    ],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'Michelin writes Defender LTX M/S2. NHTSA files Defender LTX M/S 2. The guide also lists a separate Defender LTX M/S row (70,000 miles at T and H, 50,000 at R). That is a different line.',
  },
  {
    slug: 'michelin-primacy-a-s-mileage-warranty',
    lineKey: 'michelin/primacy-a-s',
    makerName: 'Primacy A/S',
    summary: 'Michelin’s 2025 quick guide lists 55,000 miles for Primacy A/S at T, H, and V, and 45,000 miles at W and Y. Both rows are all-season.',
    rows: [
      ['2025 quick guide, T, H, and V, all-season', '55,000 miles'],
      ['2025 quick guide, W and Y, all-season', '45,000 miles'],
    ],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'michelin-pilot-sport-4-s-mileage-warranty',
    lineKey: 'michelin/pilot-sport-4-s',
    makerName: 'Pilot Sport 4 S',
    summary: 'Michelin’s 2025 quick guide lists 30,000 miles for Pilot Sport 4 S at Y and (Y). The guide classifies that row as a summer tire.',
    rows: [['2025 quick guide, Y and (Y), summer', '30,000 miles']],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'The same guide lists Pilot Sport 4, without the S, at 20,000 miles for V, W, Y, and (Y). NHTSA files Pilot Sport 4 S and Pilot Sport 4 as different lines.',
  },
  {
    slug: 'continental-procontact-tx-mileage-warranty',
    lineKey: 'continental/procontact-tx',
    makerName: 'ProContact TX',
    summary: 'Continental’s mileage-warranty article lists ProContact TX at 65,000 miles for S and T, 55,000 for H, 45,000 for V, and 40,000 for W.',
    rows: [
      ['S and T', '65,000 miles'],
      ['H', '55,000 miles'],
      ['V', '45,000 miles'],
      ['W', '40,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-truecontact-tour-mileage-warranty',
    lineKey: 'continental/truecontact-tour',
    makerName: 'TrueContact Tour',
    summary: 'Continental’s article groups TrueContact Tour and TrueContact Tour 54 on one row: 80,000 miles for T and H, and 70,000 miles for V.',
    rows: [
      ['T and H, Tour and Tour 54', '80,000 miles'],
      ['V, Tour and Tour 54', '70,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files TrueContact Tour and TrueContact Tour 54 as separate lines. The warranty article does not split the miles between those two names.',
  },
  {
    slug: 'continental-truecontact-tour-54-mileage-warranty',
    lineKey: 'continental/truecontact-tour-54',
    makerName: 'TrueContact Tour 54',
    summary: 'Continental’s article groups TrueContact Tour and TrueContact Tour 54 on one row: 80,000 miles for T and H, and 70,000 miles for V. NHTSA’s treadwear grade for Tour 54 is separate.',
    rows: [
      ['T and H, Tour and Tour 54', '80,000 miles'],
      ['V, Tour and Tour 54', '70,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-purecontact-ls-mileage-warranty',
    lineKey: 'continental/purecontact-ls',
    makerName: 'PureContact LS',
    summary: 'Continental’s mileage-warranty article lists 70,000 miles for PureContact LS at every speed rating in that row.',
    rows: [['All speed ratings on that row', '70,000 miles']],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-extremecontact-dws06-plus-mileage-warranty',
    lineKey: 'continental/extremecontact-dws06-plus',
    makerName: 'ExtremeContact DWS06 Plus',
    summary: 'Continental’s mileage-warranty article lists 50,000 miles for ExtremeContact DWS06 Plus at every speed rating in that row.',
    rows: [['All speed ratings on that row', '50,000 miles']],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-crosscontact-lx25-mileage-warranty',
    lineKey: 'continental/crosscontact-lx25',
    makerName: 'CrossContact LX25',
    summary: 'Continental’s mileage-warranty article lists 70,000 miles for CrossContact LX25 at T and H, and 65,000 miles at V.',
    rows: [
      ['T and H', '70,000 miles'],
      ['V', '65,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
    extra: 'NHTSA’s records for this line do not name a specific tire size. The grade below is the line grade, not a size grade.',
  },
  {
    slug: 'continental-terraincontact-a-t-mileage-warranty',
    lineKey: 'continental/terraincontact-a-t',
    makerName: 'TerrainContact A/T',
    summary: 'Continental’s mileage-warranty article lists 60,000 miles for TerrainContact A/T at every speed rating in that row.',
    rows: [['All speed ratings on that row', '60,000 miles']],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-terraincontact-h-t-mileage-warranty',
    lineKey: 'continental/terraincontact-h-t',
    makerName: 'TerrainContact H/T',
    summary: 'Continental’s mileage-warranty article lists 70,000 miles for TerrainContact H/T at T and H, and 60,000 miles at R and S.',
    rows: [
      ['T and H', '70,000 miles'],
      ['R and S', '60,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as TERRAINCONTACT H/T.',
  },
  {
    slug: 'goodyear-assurance-weatherready-2-mileage-warranty',
    lineKey: 'goodyear/assurance-weatherready-2',
    makerName: 'Assurance WeatherReady 2',
    summary: 'Goodyear’s Assurance WeatherReady 2 page lists a 60,000-mile and 95,000-kilometer tread life limited warranty. The visible tag on that page reads “60k mi Warranty.”',
    rows: [
      ['Product-page tag', '60k mi Warranty'],
      ['Feature text on the same page', '60,000 mile / 95,000 kilometer tread life limited warranty'],
      ['schema.org Warranty value on the same page', '60,000 miles'],
    ],
    conditions: [
      'This page quotes the product page read on the date below. It does not copy a separate warranty booklet.',
      'NHTSA files the name as ASSURANCE WEATHERREADY 2. The record does not name a specific size.',
    ],
    sourceIds: ['goodyearWr', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'goodyear-assurance-maxlife-2-mileage-warranty',
    lineKey: 'goodyear/assurance-maxlife-2',
    makerName: 'Assurance MaxLife 2',
    summary: 'Goodyear’s Assurance MaxLife 2 page tags the tire “85k mi Warranty.” The page’s schema.org Warranty value is 85,000 miles, and the product data on that page lists 85,000 miles and 140,000 kilometers.',
    rows: [
      ['Product-page tag', '85k mi Warranty'],
      ['schema.org Warranty value on the same page', '85,000 miles'],
      ['Product data on the same page', '85,000 miles and 140,000 kilometers'],
    ],
    conditions: [
      'This page quotes the product page read on the date below. It does not copy a separate warranty booklet, and it does not turn the figure into a guaranteed mile count for every size.',
      'NHTSA files Assurance MaxLife 2 separately from Assurance MaxLife. Michelin’s 2022 treadwear test measured Assurance MaxLife, not MaxLife 2.',
    ],
    sourceIds: ['goodyearMl', 'nhtsa', 'cfr104'],
  },
];

const MILEAGE_SIZES = [
  '225-65r17',
  '265-70r17',
  '265-65r18',
  '215-60r16',
  '235-60r18',
  '205-55r16',
  '215-55r17',
  '255-70r17',
  '255-60r19',
  '285-45r20',
  '305-40r22',
  '275-70r16',
];

interface CompareDef {
  slug: string;
  a: string;
  b: string;
  title: string;
  h1: string;
  note?: string;
}

const COMPARES: CompareDef[] = [
  {
    slug: 'michelin-defender-2-vs-continental-truecontact-tour-treadwear',
    a: 'michelin/defender-2',
    b: 'continental/truecontact-tour',
    title: 'Defender2 vs TrueContact Tour Treadwear',
    h1: 'Michelin Defender2 vs Continental TrueContact Tour treadwear',
  },
  {
    slug: 'michelin-defender-2-vs-goodyear-assurance-maxlife-2-treadwear',
    a: 'michelin/defender-2',
    b: 'goodyear/assurance-maxlife-2',
    title: 'Defender2 vs MaxLife 2 Treadwear',
    h1: 'Michelin Defender2 vs Goodyear Assurance MaxLife 2 treadwear',
    note: 'Michelin’s 2022 test estimated 51,900 miles for Goodyear Assurance MaxLife. NHTSA files that name separately from Assurance MaxLife 2. The 51,900-mile figure is not a MaxLife 2 result.',
  },
  {
    slug: 'michelin-crossclimate-2-vs-goodyear-assurance-weatherready-2-treadwear',
    a: 'michelin/crossclimate2',
    b: 'goodyear/assurance-weatherready-2',
    title: 'CrossClimate2 vs WeatherReady 2 Treadwear',
    h1: 'Michelin CrossClimate2 vs Goodyear WeatherReady 2 treadwear',
  },
  {
    slug: 'michelin-defender-2-vs-michelin-crossclimate-2-treadwear',
    a: 'michelin/defender-2',
    b: 'michelin/crossclimate2',
    title: 'Defender2 vs CrossClimate2 Treadwear',
    h1: 'Michelin Defender2 vs CrossClimate2 treadwear',
  },
  {
    slug: 'continental-purecontact-ls-vs-michelin-defender-2-treadwear',
    a: 'continental/purecontact-ls',
    b: 'michelin/defender-2',
    title: 'PureContact LS vs Defender2 Treadwear',
    h1: 'Continental PureContact LS vs Michelin Defender2 treadwear',
  },
  {
    slug: 'continental-extremecontact-dws06-plus-vs-crossclimate-2-treadwear',
    a: 'continental/extremecontact-dws06-plus',
    b: 'michelin/crossclimate2',
    title: 'DWS06 Plus vs CrossClimate2 Treadwear',
    h1: 'Continental DWS06 Plus vs Michelin CrossClimate2 treadwear',
  },
  {
    slug: 'continental-procontact-tx-vs-michelin-defender-2-treadwear',
    a: 'continental/procontact-tx',
    b: 'michelin/defender-2',
    title: 'ProContact TX vs Defender2 Treadwear',
    h1: 'Continental ProContact TX vs Michelin Defender2 treadwear',
  },
  {
    slug: 'bridgestone-alenza-as-ultra-vs-michelin-defender-2-treadwear',
    a: 'bridgestone/alenza-as-ultra',
    b: 'michelin/defender-2',
    title: 'Alenza AS Ultra vs Defender2 Treadwear',
    h1: 'Bridgestone Alenza AS Ultra vs Michelin Defender2 treadwear',
  },
  {
    slug: 'continental-truecontact-tour-vs-weatherready-2-treadwear',
    a: 'continental/truecontact-tour',
    b: 'goodyear/assurance-weatherready-2',
    title: 'TrueContact Tour vs WeatherReady 2 Treadwear',
    h1: 'TrueContact Tour vs Assurance WeatherReady 2 treadwear',
  },
  {
    slug: 'goodyear-maxlife-2-vs-continental-truecontact-tour-treadwear',
    a: 'goodyear/assurance-maxlife-2',
    b: 'continental/truecontact-tour',
    title: 'MaxLife 2 vs TrueContact Tour Treadwear',
    h1: 'Goodyear MaxLife 2 vs Continental TrueContact Tour treadwear',
    note: 'Michelin’s 2022 test estimated 51,900 miles for Assurance MaxLife and 59,400 miles for TrueContact Tour. Assurance MaxLife is not Assurance MaxLife 2.',
  },
  {
    slug: 'hankook-kinergy-4s2-vs-michelin-crossclimate-2-treadwear',
    a: 'hankook/kinergy-4s-2',
    b: 'michelin/crossclimate2',
    title: 'Kinergy 4S2 vs CrossClimate2 Treadwear',
    h1: 'Hankook Kinergy 4S2 vs Michelin CrossClimate2 treadwear',
    note: 'NHTSA files this Hankook line as KInERGy 4s 2. A separate NHTSA line is KInERGy 4s 2 X. This page uses only the 4s 2 line.',
  },
  {
    slug: 'continental-terraincontact-a-t-vs-falken-wildpeak-at3w-treadwear',
    a: 'continental/terraincontact-a-t',
    b: 'falken/wildpeak-a-t-at3w-t-rating',
    title: 'TerrainContact A/T vs Wildpeak AT3W Treadwear',
    h1: 'TerrainContact A/T vs Falken Wildpeak AT3W treadwear',
    note: 'NHTSA splits Wildpeak A/T AT3W by speed rating. The row here is WILDPEAK A/T AT3W (T rating) only. Other AT3W rows are different records.',
  },
];

interface RebateBrand {
  id: string;
  maker: string;
  slug: string;
  window: string;
  submission: string;
  reward: string;
  tires: string;
  notes: string[];
  sourceIds: string[];
  lineKeys: string[];
  /** Last purchase day of the window, as printed in `window` (YYYY-MM-DD). After it, the page shows “This rebate has ended”. */
  endsOn: string;
  /** Date the end date was last read on the source, when later than EXACT_DATE. */
  endsReadOn?: string;
}

const REBATES: RebateBrand[] = [
  {
    id: 'michelin',
    maker: 'Michelin',
    slug: 'michelin',
    window: 'Purchase must be completed between September 3, 2026 and November 30, 2026.',
    endsOn: '2026-11-30',
    submission: 'All requests must be received by December 31, 2026.',
    reward: 'One 80-dollar Visa reward card or Visa virtual account per purchase of four new Michelin passenger or light truck tires, including the Agilis family.',
    tires: 'New Michelin passenger or light truck tires, including the Agilis family. The legal text does not limit the offer to one model.',
    notes: [
      'Fall-North and Fall-South are two pages with the same dates, the same 80-dollar reward, and the same exclusions. Each page tells the caller which promotion name to use.',
      'Buyers must be U.S. residents, at least 18, buying from a participating dealer in the 50 states, the District of Columbia, Puerto Rico, Guam, or the U.S. Virgin Islands.',
      'Warehouse clubs (Sam’s Club, BJ’s, Costco), mass merchandisers, and national retailers including Discount Tire and Big O are excluded. The page says those stores may have their own offer.',
      'The offer is not stackable with another Michelin manufacturer offer. Buy-three-get-one style deals are excluded. Limit of three redemptions per household.',
      'Four to six weeks for the reward card by mail, and three to five weeks for the virtual account by email. That timing is for the card, not a tire shipping cutoff.',
      'Neither page uses the words Black Friday or Cyber Monday. The Fall-North phone line on the page is 1-866-212-9619.',
    ],
    sourceIds: ['michelinNorth', 'michelinSouth'],
    lineKeys: ['michelin/defender-2', 'michelin/crossclimate2'],
  },
  {
    id: 'bfgoodrich',
    maker: 'BFGoodrich',
    slug: 'bfgoodrich',
    window: 'Purchase must be completed between September 3, 2026 and November 30, 2026.',
    endsOn: '2026-11-30',
    submission: 'All requests must be received by December 31, 2026.',
    reward: 'One 80-dollar Visa reward card or Visa virtual account per purchase of four new BFGoodrich passenger or light truck tires, including the HD Pro and Route Control families.',
    tires: 'New BFGoodrich passenger or light truck tires, including the HD Pro and Route Control families.',
    notes: [
      'Buyers must be U.S. residents, at least 18, buying from a participating dealer in the 50 states, the District of Columbia, Puerto Rico, Guam, or the U.S. Virgin Islands.',
      'Warehouse clubs (Sam’s Club, BJ’s, Costco), mass merchandisers, and national retailers including Discount Tire and Big O are excluded. The page says those stores may have their own offer.',
      'Not stackable with another BFGoodrich manufacturer offer. Buy-three-get-one style deals are excluded. Limit of three redemptions per household.',
      'The legal text says Michelin fleet customers, including North American Fleet Accounts and Advantage Accounts, are not eligible. That sentence is on the BFGoodrich page.',
      'Four to six weeks for the reward card by mail, and three to five weeks for the virtual account by email. The page’s phone line is 1-800-233-5961.',
      'The page does not use the words Black Friday or Cyber Monday.',
    ],
    sourceIds: ['bfgFall'],
    lineKeys: [],
  },
  {
    id: 'goodyear',
    maker: 'Goodyear',
    slug: 'goodyear',
    window: 'Offer valid on purchases made September 1, 2026 through November 30, 2026.',
    endsOn: '2026-11-30',
    submission: 'The FAQ says consumers have one month from the promotion end date to submit. Its example is a promotion ending March 31 that must be postmarked or submitted online no later than April 30. The page does not print a December 2026 submission date.',
    reward: 'Headings on the page: up to 200 dollars back with the Goodyear Credit Card (Eagle F1 All Season; Wrangler DuraTrac RT); up to 150 dollars back with the Goodyear Credit Card (Assurance WeatherReady 2); 100 dollars back with any payment type (Wrangler Outbound AT); 80 dollars back with any payment type (Wrangler Steadfast HT; Vector 4Seasons Gen-3; Assurance MaxLife 2); 60 dollars back with any payment type (Assurance ComfortDrive). The savings line says online or mail-in rebate, paid by prepaid card.',
    tires: 'The models named under those headings. “Up to” is the page’s wording on the credit-card headings.',
    notes: [
      'The FAQ says a rebate requires a minimum of four eligible tires.',
      'Vector 4Seasons Gen-3 is printed with an asterisk. A note on the page says “Subject to availability.”',
      'The page does not use the words Black Friday or Cyber Monday, and it does not state a tire shipping cutoff.',
    ],
    sourceIds: ['goodyearRebate'],
    lineKeys: ['goodyear/assurance-weatherready-2', 'goodyear/assurance-maxlife-2'],
  },
  {
    id: 'cooper',
    maker: 'Cooper',
    slug: 'cooper',
    window: 'The Cooper block on Goodyear’s offers page says the offer is valid on purchases made September 1, 2026 through November 30, 2026.',
    endsOn: '2026-11-30',
    // Re-read 2026-11-10 on https://www.goodyear.com/en-us/offers/tire-rebate: “Cooper Tire Rebates … Offer valid on purchases made 9/1/26 through 11/30/26.”
    // Cooper’s own offers page did not return the offer text (script-rendered). After 2026-11-30, redirect or unpublish the three cooper-* rebate pages.
    endsReadOn: '2026-11-10',
    submission: 'The FAQ on that Goodyear page is the one-month-from-the-end rule, with the March 31 to April 30 example. It does not print a December 2026 submission date.',
    reward: 'Headings on the Cooper block: up to 140 dollars back with the Goodyear Credit Card (TractionCommand); up to 120 dollars back with the Goodyear Credit Card (ProControl; Discoverer Stronghold AT; Discoverer Road+Trail AT); 70 dollars back with any payment type (Discoverer Rugged Trek; Discoverer HT; Cobra Instinct). The Cooper savings line says online or mail-in rebate, paid by prepaid card.',
    tires: 'The models named under those headings. Discoverer HT is printed with an asterisk. A note on the page says “Subject to availability.”',
    notes: [
      'These amounts and dates are printed on Goodyear’s offers page, which publishes the Cooper block. Cooper’s own offers URL did not return the offer text when this site requested it on the same day.',
      'The same FAQ requires a minimum of four eligible tires.',
      'The page does not say Black Friday, Cyber Monday, or a tire shipping cutoff.',
    ],
    sourceIds: ['goodyearRebate'],
    lineKeys: [],
  },
  {
    id: 'pirelli',
    maker: 'Pirelli',
    slug: 'pirelli',
    window: 'A new set of four qualifying tires from participating dealers between November 1, 2026 and November 30, 2026.',
    endsOn: '2026-11-30',
    submission: 'The overview page, and page 1 of the terms PDF, say requests must be postmarked if mailed, or submitted online, by December 30, 2026, at 11:59 p.m. EST. The terms section of the same PDF says October 30, 2026, at 11:59 EST. Both dates are printed. This page does not choose between them.',
    reward: 'A 100-dollar Pirelli Visa prepaid card. The card is issued as a digital card unless the buyer opts for a physical card. The PDF says the digital card is issued within four weeks, and a physical card takes six to eight weeks. A physical card expires six months after issuance.',
    tires: 'Scorpion Weatheractive or Cinturato Weatheractive, a set of four. The qualifying-tire list in the PDF names those two and no others.',
    notes: [
      'The PDF says the offer is not combinable with any other offer and is not valid on Sam’s Club purchases. It is for legal residents of the 50 states, the District of Columbia, and Puerto Rico who are 18 or older and are individual consumers.',
      'The overview page lists support at 1-866-351-3488. The terms PDF marks an email address as TBD. This page does not repeat that address.',
      'The pages do not say Black Friday or Cyber Monday. The four-week and six-to-eight-week figures are for the prepaid card, not a tire shipping cutoff.',
    ],
    sourceIds: ['pirelliNov', 'pirelliPdf'],
    lineKeys: [],
  },
];

function warrantySummary(key: string): string | undefined {
  return WARRANTIES.find((w) => w.lineKey === key)?.summary;
}

function warrantySlug(key: string): string | undefined {
  return WARRANTIES.find((w) => w.lineKey === key)?.slug;
}

function buildWarranty(def: WarrantyDef): ExactPage {
  const l = mustLine(def.lineKey);
  const name = lineLabel(l);
  const answer = `${def.summary} NHTSA files ${name} at treadwear ${wearText(l)} across ${l.records} record${l.records === 1 ? '' : 's'}. That grade is a wear index, not the warranty miles.`;
  const blocks: Block[] = [
    table(
      ['Where the miles are printed', 'Mileage warranty'],
      def.rows.map(([a, b]) => [{ text: a }, { text: b }]),
      `Read ${EXACT_DATE}. Miles are the maker’s limited treadwear warranty, not a promise of how far a tire will last on your car.`,
    ),
    p(def.extra ?? 'The speed-rating row is the one to use. A headline mile count can hide a lower number for a higher speed rating.'),
    ul(def.conditions),
    table(
      ['NHTSA field', 'Value'],
      [
        [{ text: 'Line as filed' }, { text: name, href: lineHref(l) }],
        [{ text: 'Treadwear' }, { text: wearText(l) }],
        [{ text: 'Traction' }, { text: trendLabel(l.traction) }],
        [{ text: 'Temperature' }, { text: trendLabel(l.temperature) }],
        [{ text: 'Records' }, { text: String(l.records) }],
        [{ text: 'Records that name a size' }, { text: String(l.records_with_explicit_size) }],
      ],
      'Source: NHTSA ratings file pulled 2026-10-25. Traction and temperature are the letters on those records. 49 CFR § 575.104 defines the grades. A higher treadwear number is a slower wear rate versus the government course tire, not a mile count.',
    ),
  ];
  return {
    slug: def.slug,
    kind: 'warranty',
    title: clipTitle(`${def.makerName} Mileage Warranty`),
    h1: `${def.makerName} mileage warranty`,
    description: clipDesc(def.summary),
    kicker: 'Mileage warranty',
    answer,
    blocks,
    faqs: [
      { q: `What is the ${def.makerName} mileage warranty?`, a: def.summary },
      { q: `Is the NHTSA treadwear grade the same as the ${def.makerName} warranty?`, a: `No. NHTSA lists treadwear ${wearText(l)} for ${name}. The warranty miles above are the maker’s limited treadwear warranty. 49 CFR § 575.104 does not convert a treadwear grade into miles.` },
      { q: `Does this page list a price for the ${def.makerName}?`, a: 'No. Price is not in the NHTSA file and is not copied from a store. A quote you already have can be typed into the cost-per-mile tools. The warranty miles are not filled in for you.' },
    ],
    sources: srcs(def.sourceIds),
    lineKeys: [def.lineKey],
    shopLine: { brand: l.brand, line: l.line, brandSlug: l.brand_slug, lineSlug: l.line_slug },
    related: [],
  };
}

function topPhrase(ties: RankedRow[]): string {
  if (ties.length === 1) return `${ties[0].brand} ${ties[0].line} at ${ties[0].key}`;
  const names = ties.slice(0, 3).map((r) => `${r.brand} ${r.line}`).join('; ');
  const more = ties.length > 3 ? `, plus ${ties.length - 3} more` : '';
  return `${ties.length} lines tied at ${ties[0].key}: ${names}${more}`;
}

function buildMileage(sizeKey: string): ExactPage {
  const s = sizeByKey.get(sizeKey);
  if (!s) throw new Error(`exact-match size missing: ${sizeKey}`);
  const rankedSize = rankSize(s);
  if (!rankedSize.top || rankedSize.med == null) throw new Error(`no grades for ${sizeKey}`);
  const { ranked, n, topTies } = rankedSize;
  const med = rankedSize.med;
  const label = s.label;
  const present = new Set(s.rows.map((r) => `${r.brand_slug}/${r.line_slug}`));
  const absent = NOTABLE.filter((k) => !present.has(k)).map(mustLine);
  const winner = topPhrase(topTies);
  const answer = `The highest UTQG treadwear grade NHTSA filed on a record that names ${label} is ${topTies[0].key}, for ${winner}. ${n} graded lines name this size. The median of those grades is ${fmt(med)}. That grade is not a mileage warranty and not a road-test result.`;
  const preview = ranked.slice(0, 8);
  const blocks: Block[] = [
    table(
      ['Rank', 'Line', 'Treadwear', 'Traction', 'Temp.'],
      preview.map((r) => {
        const line = lineByKey.get(`${r.brand_slug}/${r.line_slug}`);
        const href = line ? lineHref(line) : undefined;
        return [
          { text: String(r.rank) },
          { text: `${r.brand} ${r.line}`, href },
          { text: r.wear_min === r.wear_max || r.wear_max == null ? String(r.key) : `${r.wear_min}–${r.wear_max}` },
          { text: r.traction ?? '—' },
          { text: r.temperature ?? '—' },
        ];
      }),
      `Showing ${preview.length} of ${n} lines with a treadwear grade for ${label}. Rank uses the lowest grade when a line has more than one record for this size. Pulled 2026-10-25.`,
    ),
  ];
  if (absent.length) {
    blocks.push(p(`These lines have an NHTSA treadwear grade, and the file does not name ${label} on their records, so they are not in the table: ${absent.map((l) => `${lineLabel(l)} at ${wearText(l)}`).join('; ')}. A missing size row is not a grade of zero, and it is not proof the tire is sold in ${label}.`));
  }
  blocks.push(p('49 CFR § 575.104 makes treadwear a comparison with a government course tire graded 100. It does not state miles. A mileage warranty, when this site has one, is a separate maker document.'));
  const warrantyLinks = [...topTies.map((r) => `${r.brand_slug}/${r.line_slug}`), ...absent.map((l) => `${l.brand_slug}/${l.line_slug}`)]
    .map(warrantySlug)
    .filter((x): x is string => !!x);
  const published = sizeSet.has(sizeKey);
  return {
    slug: `${sizeKey}-best-mileage-tire`,
    kind: 'mileage',
    title: clipTitle(`${label} Best Mileage Tire`),
    h1: `${label} best mileage tire`,
    description: clipDesc(`Highest NHTSA treadwear grade filed for ${label} is ${topTies[0].key} (${winner}). ${n} lines name this size. Median ${fmt(med)}. The grade is not miles.`),
    kicker: 'Best mileage by UTQG grade',
    answer,
    blocks,
    faqs: [
      { q: `What is the highest-mileage ${label} tire in the NHTSA file?`, a: `The highest treadwear grade that names ${label} is ${topTies[0].key}, for ${winner}. Treadwear is not a mile forecast. Lines filed only as “All sizes” are not in the count.` },
      { q: `How many ${label} tires does NHTSA grade?`, a: `${n} lines have a treadwear grade filed for this exact size. The median is ${fmt(med)} and the lowest in that list is ${ranked[n - 1].key}.` },
      { q: `Does this page pick a ${label} tire to buy?`, a: 'No. It reports the highest UTQG treadwear grade in the public file for this size. It has no price, no vehicle list, and no wet-braking test of its own. Match the placard before you buy.' },
    ],
    sources: srcs(['nhtsa', 'cfr104']),
    lineKeys: [...new Set([...preview.map((r) => `${r.brand_slug}/${r.line_slug}`), ...absent.map((l) => `${l.brand_slug}/${l.line_slug}`)])],
    sizeKey,
    shopSize: label,
    related: [
      ...(published ? [{ href: sizeUrl(sizeKey), label: `${label} treadwear ranking` }] : []),
      ...warrantyLinks.slice(0, 4).map((slug) => ({ href: exactPath(slug), label: WARRANTIES.find((w) => w.slug === slug)!.makerName + ' mileage warranty' })),
    ],
  };
}

function buildCompare(def: CompareDef): ExactPage {
  const a = mustLine(def.a);
  const b = mustLine(def.b);
  const higher = (a.wear_median as number) === (b.wear_median as number)
    ? 'The two medians are equal'
    : `${lineLabel((a.wear_median as number) > (b.wear_median as number) ? a : b)} has the higher median treadwear grade`;
  const answer = `${higher}: ${lineLabel(a)} is ${wearText(a)}, and ${lineLabel(b)} is ${wearText(b)}. A higher UTQG treadwear grade is a slower wear rate on the government course. It is not a mileage warranty and not a test of your car.`;
  const rowFor = (l: Line): Cell[] => {
    const w = warrantySummary(`${l.brand_slug}/${l.line_slug}`);
    const slug = warrantySlug(`${l.brand_slug}/${l.line_slug}`);
    return [
      { text: lineLabel(l), href: lineHref(l) },
      { text: wearText(l) },
      { text: trendLabel(l.traction) },
      { text: trendLabel(l.temperature) },
      { text: String(l.records) },
      { text: w ? 'Maker warranty cited' : 'No warranty cited here', href: slug ? exactPath(slug) : undefined },
    ];
  };
  const blocks: Block[] = [
    table(
      ['Line', 'Treadwear', 'Traction', 'Temperature', 'NHTSA records', 'Mileage warranty'],
      [rowFor(a), rowFor(b)],
      'Treadwear, traction, and temperature are NHTSA UTQG grades pulled 2026-10-25. The warranty cell is a link only when this site quotes the maker’s own page.',
    ),
    p('49 CFR § 575.104 defines treadwear as a grade against a course tire assigned 100. Grades are assigned by the tire maker. Two lines can share a similar grade and still carry different warranty miles.'),
  ];
  const testRows = MICHELIN_TEST.filter((r) => r.lineKey === def.a || r.lineKey === def.b);
  if (testRows.length === 2) {
    blocks.push(p('Michelin’s Defender2 page describes Michelin’s own treadwear test: size 225/65R17 on 2021 Toyota RAV4s, estimated life from the most-worn groove of a rotated set. Michelin says actual on-road results may vary. These miles are the maker’s test, not NHTSA grades.'));
    blocks.push(table(
      ['Line in that test', 'Michelin’s estimated miles'],
      MICHELIN_TEST.filter((r) => testRows.some((t) => t.lineKey === r.lineKey) || r.lineKey === 'michelin/defender-2' || r.lineKey === 'continental/truecontact-tour' || r.lineKey === 'bridgestone/alenza-as-ultra' || r.lineKey === 'goodyear/assurance-maxlife')
        .filter((r) => r.lineKey === def.a || r.lineKey === def.b)
        .map((r) => {
          const l = mustLine(r.lineKey);
          return [{ text: lineLabel(l), href: lineHref(l) }, { text: r.miles.toLocaleString('en-US') }];
        }),
      'Only the two lines on this page are shown. The test also included other tires. Source: Michelin’s Defender2 page, read ' + EXACT_DATE + '.',
    ));
  }
  if (def.note) blocks.push(p(def.note));
  const wa = warrantySummary(def.a);
  const wb = warrantySummary(def.b);
  if (wa || wb) {
    blocks.push(p([wa && `${mustLine(def.a).brand}: ${wa}`, wb && `${mustLine(def.b).brand}: ${wb}`].filter(Boolean).join(' ')));
  }
  return {
    slug: def.slug,
    kind: 'compare',
    title: clipTitle(def.title),
    h1: def.h1,
    description: clipDesc(`${lineLabel(a)} treadwear ${wearText(a)}. ${lineLabel(b)} treadwear ${wearText(b)}. UTQG grades from NHTSA, not a mileage test.`),
    kicker: 'Head-to-head treadwear',
    answer,
    blocks,
    faqs: [
      { q: `Which has the higher treadwear grade, ${lineLabel(a)} or ${lineLabel(b)}?`, a: `${higher}. ${lineLabel(a)} is ${wearText(a)}. ${lineLabel(b)} is ${wearText(b)}. The numbers are NHTSA UTQG grades.` },
      { q: 'Does the higher treadwear grade mean more miles?', a: 'No. The grade compares wear rate with a government course tire. Warranty miles, when a maker publishes them, are a separate document and can depend on speed rating.' },
      { q: 'Does this comparison include a price?', a: 'No. Both prices stay at the retailer. You can type two quotes into the cost-per-mile comparison. This page does not fill those boxes.' },
    ],
    sources: srcs(['nhtsa', 'cfr104', ...(testRows.length === 2 ? ['michelinDefender2'] : []), ...(warrantySlug(def.a) || warrantySlug(def.b) ? ['michelinFlyer', 'contiWarranty', 'goodyearWr', 'goodyearMl'].filter((id) => {
      const used = [warrantySlug(def.a), warrantySlug(def.b)].filter(Boolean);
      return WARRANTIES.some((w) => used.includes(w.slug) && w.sourceIds.includes(id));
    }) : [])]),
    lineKeys: [def.a, def.b],
    related: [def.a, def.b].flatMap((k) => {
      const slug = warrantySlug(k);
      return slug ? [{ href: exactPath(slug), label: `${mustLine(k).brand} mileage warranty` }] : [];
    }),
  };
}

function buildRebate(brand: RebateBrand, day: 'november' | 'black-friday' | 'cyber-monday'): ExactPage {
  const slug = day === 'november'
    ? `${brand.slug}-tire-rebate-november-2026`
    : day === 'black-friday'
      ? `${brand.slug}-black-friday-2026-tire-rebate`
      : `${brand.slug}-cyber-monday-2026-tire-rebate`;
  const title = day === 'november'
    ? `${brand.maker} Tire Rebate November 2026`
    : day === 'black-friday'
      ? `${brand.maker} Black Friday 2026 Tire Rebate`
      : `${brand.maker} Cyber Monday 2026 Tire Rebate`;
  const h1 = day === 'november'
    ? `${brand.maker} tire rebate, November 2026`
    : day === 'black-friday'
      ? `${brand.maker} Black Friday 2026 tire rebate`
      : `${brand.maker} Cyber Monday 2026 tire rebate`;
  const inside = 'November 27, 2026 and November 30, 2026 both fall inside that purchase window.';
  const description = day === 'november'
    ? `${brand.maker} publishes a November 2026 tire rebate. The purchase window includes November 27 and November 30. The reward is quoted from the maker page. No sale price.`
    : day === 'black-friday'
      ? `Black Friday 2026 is November 27. ${brand.maker}’s purchase window includes that Friday. The maker page does not call it Black Friday and lists no sale price.`
      : `Cyber Monday 2026 is November 30. ${brand.maker}’s purchase window includes that Monday. The maker page does not call it Cyber Monday and lists no sale price.`;
  const answer = day === 'november'
    ? `${brand.maker}’s page, read ${EXACT_DATE}, states this purchase window: ${brand.window} ${inside} The page does not call the window Black Friday or Cyber Monday, and it does not print a sale price.`
    : day === 'black-friday'
      ? `Black Friday 2026 is Friday, November 27. ${brand.window} November 27 falls inside that window. ${brand.maker}’s page does not use the words Black Friday and does not print a sale price.`
      : `Cyber Monday 2026 is Monday, November 30. ${brand.window} November 30 is inside that window. ${brand.maker}’s page does not use the words Cyber Monday and does not print a sale price.`;
  const blocks: Block[] = [
    table(
      ['Fact', 'What the maker’s page says'],
      [
        [{ text: 'Purchase window' }, { text: brand.window }],
        [{ text: 'Submission' }, { text: brand.submission }],
        [{ text: 'Reward' }, { text: brand.reward }],
        [{ text: 'Tires named' }, { text: brand.tires }],
        [{ text: 'November 27, 2026' }, { text: 'Inside the purchase window. The page does not call that day Black Friday.' }],
        [{ text: 'November 30, 2026' }, { text: 'Inside the purchase window. The page does not call that day Cyber Monday.' }],
      ],
      `Read ${EXACT_DATE}. Amounts stay in the maker’s words. This site does not store a tire price.`,
    ),
    ul(brand.notes),
    p('A quote you already have can be typed into the cost-per-mile tools. Those tools do not fill in this rebate.'),
  ];
  const siblings = (['november', 'black-friday', 'cyber-monday'] as const)
    .filter((d) => d !== day)
    .map((d) => buildRebateMeta(brand, d));
  return {
    slug,
    kind: 'rebate',
    title: clipTitle(title),
    h1,
    description: clipDesc(description),
    kicker: day === 'november' ? 'November 2026 rebate' : day === 'black-friday' ? 'Black Friday 2026' : 'Cyber Monday 2026',
    answer,
    blocks,
    faqs: [
      { q: `What is the ${brand.maker} tire rebate in November 2026?`, a: `${brand.window} ${brand.reward}` },
      { q: `Does ${brand.maker} call this a Black Friday or Cyber Monday sale?`, a: `No. The page read ${EXACT_DATE} does not use those words. November 27 and November 30, 2026 fall inside the purchase window. That is not a sale price.` },
      { q: 'Does this page list a tire price?', a: 'No. The reward is the maker’s rebate wording. Store prices are not copied here.' },
    ],
    sources: srcs(brand.sourceIds),
    lineKeys: brand.lineKeys,
    endsOn: brand.endsOn,
    endsReadOn: brand.endsReadOn ?? EXACT_DATE,
    related: [
      ...siblings,
      { href: REBATE_PATH, label: 'November and December 2026 rebate lookup' },
      { href: blackFridayPath, label: 'Black Friday 2026 dates, all makers' },
      { href: cyberMondayPath, label: 'Cyber Monday 2026 dates, all makers' },
    ],
  };
}

function buildRebateMeta(brand: RebateBrand, day: 'november' | 'black-friday' | 'cyber-monday'): { href: string; label: string } {
  const slug = day === 'november'
    ? `${brand.slug}-tire-rebate-november-2026`
    : day === 'black-friday'
      ? `${brand.slug}-black-friday-2026-tire-rebate`
      : `${brand.slug}-cyber-monday-2026-tire-rebate`;
  const label = day === 'november'
    ? `${brand.maker} November 2026 rebate`
    : day === 'black-friday'
      ? `${brand.maker} Black Friday 2026`
      : `${brand.maker} Cyber Monday 2026`;
  return { href: exactPath(slug), label };
}

function withRelated(pages: ExactPage[]): ExactPage[] {
  const byLine = new Map<string, ExactPage[]>();
  for (const page of pages) {
    for (const k of page.lineKeys) {
      const list = byLine.get(k) ?? [];
      list.push(page);
      byLine.set(k, list);
    }
  }
  return pages.map((page) => {
    const siblings = page.lineKeys.flatMap((k) => byLine.get(k) ?? []).filter((p) => p.slug !== page.slug);
    const seen = new Set(page.related.map((r) => r.href));
    const extra = siblings
      .filter((p) => !seen.has(exactPath(p.slug)))
      .slice(0, 6)
      .map((p) => ({ href: exactPath(p.slug), label: p.h1 }));
    const lineLinks = page.lineKeys.map(mustLine).filter(hasLine).map((l) => ({ href: lineUrl(l), label: lineLabel(l) }));
    const hubs = [
      { href: LOOKUP_PATH, label: 'All exact lookups' },
      { href: '/tires/', label: 'Tire lines' },
      { href: '/sizes/', label: 'Sizes' },
      { href: '/guides/treadwear-vs-warranty-mileage/', label: 'Treadwear vs. mileage warranty' },
      { href: '/methodology/', label: 'Methodology' },
    ];
    const related = [...page.related, ...lineLinks, ...extra, ...hubs].filter((r, i, arr) => arr.findIndex((x) => x.href === r.href) === i);
    return { ...page, related };
  });
}

function dedupeSources(list: SourceRef[]): SourceRef[] {
  const seen = new Set<string>();
  return list.filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)));
}

const built = withRelated([
  ...WARRANTIES.map(buildWarranty),
  ...MILEAGE_SIZES.map(buildMileage),
  ...COMPARES.map(buildCompare),
  ...REBATES.flatMap((b) => (['november', 'black-friday', 'cyber-monday'] as const).map((d) => buildRebate(b, d))),
]).map((p) => ({ ...p, sources: dedupeSources(p.sources) }));

const slugs = new Set<string>();
const titles = new Set<string>();
for (const page of built) {
  if (slugs.has(page.slug)) throw new Error(`duplicate exact slug ${page.slug}`);
  slugs.add(page.slug);
  if (titles.has(page.title)) throw new Error(`duplicate exact title ${page.title}`);
  titles.add(page.title);
  if (page.sources.length < 1) throw new Error(`no sources ${page.slug}`);
  if (page.faqs.length < 3) throw new Error(`faqs ${page.slug}`);
}
if (built.length < 40 || built.length > 60) throw new Error(`exact page count ${built.length}`);

export const EXACT_PAGES: ExactPage[] = built;
export const exactBySlug = (slug: string) => EXACT_PAGES.find((p) => p.slug === slug);
export const exactPagesForLine = (key: string) => EXACT_PAGES.filter((p) => p.lineKeys.includes(key));
export const exactMileageForSize = (key: string) => EXACT_PAGES.find((p) => p.kind === 'mileage' && p.sizeKey === key);
