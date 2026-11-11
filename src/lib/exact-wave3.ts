// Exact-query wave read 2026-11-11.
// Mileage figures are copied from the maker page named on each page.
// Treadwear grades are the NHTSA file in data/normalized (pulled 2026-10-25). No prices.
import type { Block, ExactPage, SourceRef } from './exact-match';
import { allLines, allSizes, fmt, hasLine, lineUrl, trendLabel, type Line } from './data';
import { COST_PATH, WAVE3_DATE, blackFridayPath, exactPath } from './paths';

const FLYER = 'https://dgaddcosprod.blob.core.windows.net/cxf-multisite/clsq28vx9001a11mh1x0t9t5w/attachments/s02te3s8qdc8t86vxq13xt10-michelin-2025-quick-guide-warranty-flyer-0525-final.pdf';
const CONTI = 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty';
const BS_PDF = 'https://www.firestonetire.com/content/dam/consumer/bst/na/warranties/bridgestone_warranty%20_manual_costco_US_EN_2025.pdf';
const COOPER_PDF = 'https://www.coopertire.com/on/demandware.static/-/Sites-CooperTire-Library/default/dw89190143/pdfs/AB1E-WREG-BKT-2-2023-WarrantyRegBook-US-Eng-v5.pdf';
const PULLED = '2026-10-25';

const SOURCES: Record<string, SourceRef> = {
  nhtsa: { id: 'nhtsa', label: 'NHTSA tire ratings API (dataset=ratings)', url: 'https://api.nhtsa.gov/tires?dataSet=ratings', publisher: 'NHTSA' },
  cfr104: { id: 'cfr104', label: '49 CFR § 575.104 Uniform tire quality grading standards', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-575/subpart-B/section-575.104', publisher: 'U.S. Code of Federal Regulations (eCFR)' },
  michelinFlyer: { id: 'michelinFlyer', label: 'Michelin 2025 quick guide to mileage warranties (PDF)', url: FLYER, publisher: 'Michelin North America' },
  psas4: { id: 'psas4', label: 'Michelin Pilot Sport All Season 4', url: 'https://www.michelinman.com/auto/tires/michelin-pilot-sport-all-season-4', publisher: 'Michelin USA' },
  xIce: { id: 'xIce', label: 'Michelin X-Ice Snow', url: 'https://www.michelinman.com/auto/tires/michelin-x-ice-snow', publisher: 'Michelin USA' },
  contiWarranty: { id: 'contiWarranty', label: 'Mileage Warranty (support article, updated June 12, 2026)', url: CONTI, publisher: 'Continental Tire' },
  bsManual: { id: 'bsManual', label: 'Bridgestone Firestone warranty manual, Costco U.S. English 2025 (PDF)', url: BS_PDF, publisher: 'Bridgestone Americas (firestonetire.com)' },
  alenzaPage: { id: 'alenzaPage', label: 'Alenza AS Ultra product page', url: 'https://www.bridgestonetire.com/tire/alenza-as-ultra/', publisher: 'Bridgestone Tires' },
  comfort: { id: 'comfort', label: 'Assurance ComfortDrive product page', url: 'https://www.goodyear.com/en-us/tires/assurance-comfortdrive_24385', publisher: 'Goodyear' },
  workhorse: { id: 'workhorse', label: 'Wrangler Workhorse AT 2 product page', url: 'https://www.goodyear.com/en-us/tires/wrangler-workhorse-at-2_25329', publisher: 'Goodyear' },
  bfgControl: { id: 'bfgControl', label: 'BFGoodrich Advantage Control', url: 'https://www.bfgoodrichtires.com/auto/tires/bfgoodrich-advantage-control', publisher: 'BFGoodrich' },
  bfgTrail: { id: 'bfgTrail', label: 'BFGoodrich Trail-Terrain T/A', url: 'https://www.bfgoodrichtires.com/auto/tires/bfgoodrich-trail-terrain-t-a', publisher: 'BFGoodrich' },
  hankookPt: { id: 'hankookPt', label: 'Hankook Kinergy PT', url: 'https://www.hankooktire.com/us/en/tire/kinergy/pt-h737.html', publisher: 'Hankook Tire US' },
  cooperBook: { id: 'cooperBook', label: 'Cooper 2023 limited warranty and registration booklet (PDF)', url: COOPER_PDF, publisher: 'Cooper Tire' },
  michelinDefender2: { id: 'michelinDefender2', label: 'Michelin Defender2', url: 'https://www.michelinman.com/auto/tires/michelin-defender2', publisher: 'Michelin USA' },
  goodyearMl: { id: 'goodyearMl', label: 'Assurance MaxLife 2 product page', url: 'https://www.goodyear.com/en-us/tires/assurance-maxlife-2_25310', publisher: 'Goodyear' },
};

const MICHELIN_LIMITS = [
  'The 2025 quick guide says original-equipment tires are not covered for mileage.',
  'On a split fitment, the guide says each tire is covered for half the listed miles.',
  'Zero Pressure tires keep the line’s mileage warranty only up to 30,000 miles.',
  'The guide excludes DOT-approved competition tires. Its example is the Pilot Sport Cup 2.',
  'The guide points to the Michelin owner’s manual for the full text. This page does not add terms that are not on the guide.',
];

const WINTER_LIMIT = 'For winter tires, the guide says treadwear coverage needs documentation of when the tires were installed and removed each winter. It defines winter as beginning no earlier than September 1 and ending no later than April 30 of the next year.';

const CONTINENTAL_LIMITS = [
  'The article says this warranty does not apply to original-equipment tires installed on new vehicles.',
  'Wearout means the tread has worn evenly down to the tread-wear indicators (2/32 inch or 1.6 mm).',
  'Tires must be rotated every 6,000 to 8,000 miles, or sooner if uneven wear appears.',
  'On a staggered or split fitment, rear-axle tires receive half of the standard mileage warranty.',
  'Tires in service longer than 72 months are not covered.',
  'The article includes a pro-rata dollar example. This page does not repeat that price.',
];

const BRIDGESTONE_LIMITS = [
  'This manual is the Costco U.S. English 2025 edition on firestonetire.com. It says adjustments for tires bought at a Costco Warehouse or Costco.com are made at a Costco Warehouse.',
  'Only the passenger and light truck tires listed in the limited-mileage section are covered, for the miles shown.',
  'Original-equipment tires on new vehicles have no mileage warranty. The table under this line is headed as exceptions and exact original-equipment replacements. That table says None.',
  'Coverage extends up to 5 years from the purchase date when a proof of purchase is shown, or 6 years from the manufacture date without one.',
  'The tire must wear evenly to the tread-wear indicators (2/32 inch). Even wear means no more than a 2/32-inch difference between major grooves.',
  'On a staggered fitment, the manual gives the non-drive tires the full mileage figure and the drive tires half of it.',
  'Commercial service is excluded. The manual’s pro-rata example uses a dollar amount. This page does not repeat it.',
];

const COOPER_LIMITS = [
  'The booklet is the 2023 U.S. English edition still linked from coopertire.com on the read date. It applies to the original purchaser of a replacement Cooper tire and is not transferable.',
  'Tread-wear protection is prorated. The booklet says there is no free-replacement period for that part of the warranty.',
  'The owner must rotate the tires at least every 8,000 miles and record the rotation.',
  'Wearout is tread worn to 2/32 inch. The booklet multiplies a mileage ratio by the current selling price. This page does not copy a price.',
];

const lineByKey = new Map(allLines.map((l) => [`${l.brand_slug}/${l.line_slug}`, l]));
const sizeByKey = new Map(allSizes.map((s) => [s.key, s]));

function must(key: string): Line {
  const l = lineByKey.get(key);
  if (!l || l.wear_median == null) throw new Error(`wave3 line missing or unrated: ${key}`);
  return l;
}

function wearText(l: Line): string {
  const span = l.wear_min === l.wear_max ? String(l.wear_min) : `${l.wear_min}–${l.wear_max}`;
  return `${span} (median ${fmt(l.wear_median)})`;
}

function label(l: Line): string {
  return `${l.brand} ${l.line}`;
}

function hrefOf(l: Line): string | undefined {
  return hasLine(l) ? lineUrl(l) : undefined;
}

function srcs(ids: string[]): SourceRef[] {
  return ids.map((id) => {
    const s = SOURCES[id];
    if (!s) throw new Error(`wave3 missing source ${id}`);
    return s;
  });
}

function p(text: string): Block {
  return { kind: 'p', segs: [{ text }] };
}

function ul(items: string[]): Block {
  return { kind: 'ul', items: items.map((text) => [{ text }]) };
}

function table(head: string[], rows: { text: string; href?: string }[][], note?: string): Block {
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

const calc = { href: COST_PATH, label: 'Cost per mile calculator' };
const lookup = { href: '/lookup/', label: 'All exact lookups' };

function nhtsaTable(keys: string[]): Block {
  return table(
    ['Line as filed', 'Treadwear', 'Traction', 'Temperature', 'Records'],
    keys.map((k) => {
      const l = must(k);
      return [
        { text: label(l), href: hrefOf(l) },
        { text: wearText(l) },
        { text: trendLabel(l.traction) },
        { text: trendLabel(l.temperature) },
        { text: String(l.records) },
      ];
    }),
    `Source: NHTSA ratings file pulled ${PULLED}. 49 CFR § 575.104 defines the grades. A higher treadwear number is a slower wear rate versus the government course tire, not a mile count.`,
  );
}

interface WarrantyDef {
  slug: string;
  title: string;
  h1: string;
  name: string;
  lineKeys: string[];
  summary: string;
  rows: [string, string][];
  conditions: string[];
  sourceIds: string[];
  extra?: string;
  shop?: { brand: string; line: string; brandSlug: string; lineSlug: string };
  related?: { href: string; label: string }[];
}

function buildWarranty(def: WarrantyDef): ExactPage {
  const lines = def.lineKeys.map(must);
  const gradeBit = lines.length
    ? ` NHTSA files ${lines.map((l) => `${label(l)} at treadwear ${wearText(l)}`).join('; ')}. That grade is a wear index, not the warranty miles.`
    : ` The NHTSA ratings file pulled ${PULLED} has no row under this name. A missing row is not a treadwear grade of zero.`;
  const blocks: Block[] = [
    table(
      ['Where the miles are printed', 'Mileage warranty'],
      def.rows.map(([a, b]) => [{ text: a }, { text: b }]),
      `Read ${WAVE3_DATE}. Miles are the maker’s limited treadwear warranty, not a promise of how far a tire will last on your car.`,
    ),
  ];
  if (def.extra) blocks.push(p(def.extra));
  blocks.push(ul(def.conditions));
  if (lines.length) blocks.push(nhtsaTable(def.lineKeys));
  else blocks.push(p(`49 CFR § 575.104 does not require a UTQG treadwear grade for every tire. Deep-tread winter-type snow tires are one exclusion. This site does not fill a grade in when the NHTSA file has no row.`));
  const shop = def.shop ?? (lines[0] ? { brand: lines[0].brand, line: lines[0].line, brandSlug: lines[0].brand_slug, lineSlug: lines[0].line_slug } : undefined);
  return {
    slug: def.slug,
    kind: 'warranty',
    title: clipTitle(def.title),
    h1: def.h1,
    description: clipDesc(def.summary),
    kicker: 'Mileage warranty',
    answer: `${def.summary}${gradeBit}`,
    blocks,
    faqs: [
      { q: `What is the ${def.name} mileage warranty?`, a: def.summary },
      { q: `Is the NHTSA treadwear grade the same as the ${def.name} warranty?`, a: lines.length ? `No. NHTSA lists treadwear ${lines.map((l) => wearText(l)).join('; ')}. The warranty miles above are the maker’s limited treadwear warranty. 49 CFR § 575.104 does not convert a treadwear grade into miles.` : `No grade is on file. The NHTSA pull of ${PULLED} has no row for this name, so this page does not print a UTQG number. The miles above are the maker’s warranty.` },
      { q: `Does this page list a price for the ${def.name}?`, a: 'No. A quote you already have can be typed into the cost-per-mile calculator. The warranty miles are not filled in for you.' },
    ],
    sources: srcs(def.sourceIds),
    lineKeys: def.lineKeys,
    shopLine: shop,
    retrieved: WAVE3_DATE,
    related: [...(def.related ?? []), calc, lookup],
  };
}

const WARRANTIES: WarrantyDef[] = [
  {
    slug: 'michelin-primacy-tour-a-s-mileage-warranty',
    title: 'Primacy Tour A/S Mileage Warranty',
    h1: 'Primacy Tour A/S mileage warranty',
    name: 'Primacy Tour A/S',
    lineKeys: ['michelin/primacy-tour-a-s'],
    summary: 'Michelin’s 2025 quick guide lists 55,000 miles for Primacy Tour A/S at H and V, and 45,000 miles at W. The Zero Pressure row at V is 30,000 miles. The guide classifies the line as all-season.',
    rows: [
      ['2025 quick guide, H and V, all-season', '55,000 miles'],
      ['2025 quick guide, W, all-season', '45,000 miles'],
      ['2025 quick guide, Zero Pressure, V', '30,000 miles'],
    ],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as Primacy Tour A/S. The guide uses the same words.',
  },
  {
    slug: 'michelin-pilot-sport-all-season-4-mileage-warranty',
    title: 'Pilot Sport All Season 4 Mileage Warranty',
    h1: 'Pilot Sport All Season 4 mileage warranty',
    name: 'Pilot Sport All Season 4',
    lineKeys: ['michelin/pilot-sport-all-season-4'],
    summary: 'Michelin’s 2025 quick guide lists Pilot Sport A/S 4 at 45,000 miles for Y and 30,000 miles for (Y), typed as all-season. The product page, titled Pilot Sport All Season 4, says a mileage warranty up to 45,000 miles.',
    rows: [
      ['2025 quick guide, Pilot Sport A/S 4, Y, all-season', '45,000 miles'],
      ['2025 quick guide, Pilot Sport A/S 4, (Y), all-season', '30,000 miles'],
      ['Product page headline', 'Mileage warranty up to 45,000 miles'],
      ['Product-page warranty card', '45,000 miles if the speed index is V, W, or Y'],
      ['Product-page warranty card', '30,000 miles if the speed index is V or (Y)'],
    ],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'psas4', 'nhtsa', 'cfr104'],
    extra: 'The guide’s name is Pilot Sport A/S 4. The product page’s name is Pilot Sport All Season 4. NHTSA files Pilot Sport All Season 4. The two warranty cards both include the speed index V, one at 45,000 miles and one at 30,000. This page does not choose between the guide and the cards.',
  },
  {
    slug: 'michelin-defender-t-h-mileage-warranty',
    title: 'Defender T+H Mileage Warranty',
    h1: 'Defender T+H mileage warranty',
    name: 'Defender T+H',
    lineKeys: ['michelin/defender-t-h'],
    summary: 'Michelin’s 2025 quick guide lists 80,000 miles for Defender T + H at the H speed rating. The guide classifies that row as all-season. It does not print a second speed rating for this line.',
    rows: [['2025 quick guide, H, all-season', '80,000 miles']],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'The guide writes Defender T + H. NHTSA files Defender T + H. This is not Defender2. Defender2 is a different row on the same guide, also 80,000 miles at H and V.',
  },
  {
    slug: 'michelin-ltx-a-t2-mileage-warranty',
    title: 'LTX A/T2 Mileage Warranty',
    h1: 'Michelin LTX A/T2 mileage warranty',
    name: 'LTX A/T2',
    lineKeys: ['michelin/ltx-a-t2'],
    summary: 'Michelin’s 2025 quick guide lists 60,000 miles for LTX A/T2 at R, S, and T. The guide’s type column for that row says all-season. The line name is the all-terrain LTX A/T2.',
    rows: [['2025 quick guide, R, S, and T, all-season', '60,000 miles']],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as LTX A/T2. The guide does not print a separate mile count for LT sizes.',
  },
  {
    slug: 'michelin-x-ice-snow-mileage-warranty',
    title: 'X-Ice Snow Mileage Warranty',
    h1: 'Michelin X-Ice Snow mileage warranty',
    name: 'X-Ice Snow',
    lineKeys: [],
    summary: 'Michelin’s 2025 quick guide lists 40,000 miles for X-Ice Snow at T and H, and 40,000 miles for X-Ice Snow SUV at T and H. Both rows are typed Winter. The X-Ice Snow product page prints a 40,000-mile treadwear warranty.',
    rows: [
      ['2025 quick guide, X-Ice Snow, T and H, winter', '40,000 miles'],
      ['2025 quick guide, X-Ice Snow SUV, T and H, winter', '40,000 miles'],
      ['X-Ice Snow product page, warranties module', '40,000 miles'],
    ],
    conditions: [...MICHELIN_LIMITS, WINTER_LIMIT],
    sourceIds: ['michelinFlyer', 'xIce', 'nhtsa', 'cfr104'],
    extra: 'NHTSA’s file pulled on 2026-10-25 has no line named X-Ice Snow or X-Ice Snow SUV. 49 CFR § 575.104 does not apply to deep-tread winter-type snow tires, so a missing row is not a grade of zero. Michelin’s Fall 2026 purchase window, quoted on this site’s Michelin rebate page, covers new Michelin passenger or light truck tires and does not limit the offer to one model. That page does not call the window Black Friday and does not print a sale price. November 27, 2026 falls inside the window.',
    shop: { brand: 'Michelin', line: 'X-Ice Snow', brandSlug: 'michelin', lineSlug: 'x-ice-snow' },
    related: [
      { href: exactPath('michelin-tire-rebate-november-2026'), label: 'Michelin November 2026 rebate' },
      { href: blackFridayPath, label: 'Black Friday 2026 tire rebate dates' },
      { href: exactPath('winter-tire-mileage-warranty'), label: 'Winter tire mileage warranty' },
    ],
  },
  {
    slug: 'michelin-premier-ltx-mileage-warranty',
    title: 'Premier LTX Mileage Warranty',
    h1: 'Michelin Premier LTX mileage warranty',
    name: 'Premier LTX',
    lineKeys: ['michelin/premier-ltx'],
    summary: 'Michelin’s 2025 quick guide lists 60,000 miles for Premier LTX at T, H, and V. The guide classifies that row as all-season, in the light-truck, SUV, and crossover section.',
    rows: [['2025 quick guide, T, H, and V, all-season', '60,000 miles']],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'michelin-latitude-tour-mileage-warranty',
    title: 'Latitude Tour Mileage Warranty',
    h1: 'Michelin Latitude Tour mileage warranty',
    name: 'Latitude Tour',
    lineKeys: ['michelin/latitude-tour'],
    summary: 'Michelin’s 2025 quick guide lists 65,000 miles for Latitude Tour at S and T. The guide classifies that row as all-season. It does not print an H, V, or W row for Latitude Tour.',
    rows: [['2025 quick guide, S and T, all-season', '65,000 miles']],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
    extra: 'Latitude Tour HP is a different row: 55,000 miles at H and V, and 45,000 at W. This page is only Latitude Tour.',
  },
  {
    slug: 'michelin-primacy-mxm4-mileage-warranty',
    title: 'Primacy MXM4 Mileage Warranty',
    h1: 'Michelin Primacy MXM4 mileage warranty',
    name: 'Primacy MXM4',
    lineKeys: ['michelin/primacy-mxm4'],
    summary: 'Michelin’s 2025 quick guide lists 55,000 miles for Primacy MXM4 at H and V, 45,000 miles at W, and 30,000 miles for the Zero Pressure row at H and V. The guide classifies the line as all-season.',
    rows: [
      ['2025 quick guide, H and V, all-season', '55,000 miles'],
      ['2025 quick guide, W, all-season', '45,000 miles'],
      ['2025 quick guide, Zero Pressure, H and V', '30,000 miles'],
    ],
    conditions: MICHELIN_LIMITS,
    sourceIds: ['michelinFlyer', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-procontact-gx-mileage-warranty',
    title: 'ProContact GX Mileage Warranty',
    h1: 'Continental ProContact GX mileage warranty',
    name: 'ProContact GX',
    lineKeys: ['continental/procontact-gx'],
    summary: 'Continental’s mileage-warranty article lists ProContact GX at 65,000 miles for S and T, 55,000 for H, 45,000 for V, and 40,000 for W. The article was updated June 12, 2026.',
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
    slug: 'continental-procontact-rx-mileage-warranty',
    title: 'ProContact RX Mileage Warranty',
    h1: 'Continental ProContact RX mileage warranty',
    name: 'ProContact RX',
    lineKeys: ['continental/procontact-rx'],
    summary: 'Continental’s mileage-warranty article lists ProContact RX at 55,000 miles for H, 45,000 for V, and 40,000 for W. The article does not print an S or T row for ProContact RX.',
    rows: [
      ['H', '55,000 miles'],
      ['V', '45,000 miles'],
      ['W', '40,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'continental-contiprocontact-mileage-warranty',
    title: 'ContiProContact Mileage Warranty',
    h1: 'Continental ContiProContact mileage warranty',
    name: 'ContiProContact',
    lineKeys: ['continental/contiprocontact'],
    summary: 'Continental’s mileage-warranty article lists ContiProContact at 80,000 miles for S and T, 60,000 for H, and 40,000 for V and W. The article was updated June 12, 2026.',
    rows: [
      ['S and T', '80,000 miles'],
      ['H', '60,000 miles'],
      ['V and W', '40,000 miles'],
    ],
    conditions: CONTINENTAL_LIMITS,
    sourceIds: ['contiWarranty', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as ContiProContact. The warranty article uses the same name. ProContact TX is a different row, with a lower S and T figure.',
  },
  {
    slug: 'bridgestone-weatherpeak-mileage-warranty',
    title: 'WeatherPeak Mileage Warranty',
    h1: 'Bridgestone WeatherPeak mileage warranty',
    name: 'WeatherPeak',
    lineKeys: ['bridgestone/weatherpeak'],
    summary: 'The Bridgestone Firestone 2025 warranty manual lists WeatherPeak at 70,000 miles. The exceptions and exact original-equipment table under that line says None.',
    rows: [
      ['Limited mileage table', '70,000 miles'],
      ['Exceptions and exact original-equipment replacements', 'None'],
    ],
    conditions: BRIDGESTONE_LIMITS,
    sourceIds: ['bsManual', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as WEATHERPeak. The manual prints WeatherPeak. This page uses that manual, which is the Costco-channel edition, because that is the 2025 Bridgestone document read for this line.',
  },
  {
    slug: 'bridgestone-alenza-as-ultra-mileage-warranty',
    title: 'Alenza AS Ultra Mileage Warranty',
    h1: 'Bridgestone Alenza AS Ultra mileage warranty',
    name: 'Alenza AS Ultra',
    lineKeys: ['bridgestone/alenza-as-ultra'],
    summary: 'The Bridgestone Firestone 2025 warranty manual lists Alenza A/S Ultra at 80,000 miles, and the exceptions table says None. The Alenza AS Ultra product page also prints an 80,000-mile limited mileage warranty.',
    rows: [
      ['2025 manual, limited mileage table', '80,000 miles'],
      ['Exceptions and exact original-equipment replacements', 'None'],
      ['Product page', '80,000-mile limited mileage warranty'],
    ],
    conditions: BRIDGESTONE_LIMITS,
    sourceIds: ['bsManual', 'alenzaPage', 'nhtsa', 'cfr104'],
    extra: 'The manual writes Alenza A/S Ultra. The product page and NHTSA write Alenza AS Ultra. The product page says conditions apply and points to BridgestoneTire.com/warranty. This page does not copy the product page’s braking-distance claim.',
  },
  {
    slug: 'bridgestone-dueler-a-t-ascent-mileage-warranty',
    title: 'Dueler A/T Ascent Mileage Warranty',
    h1: 'Bridgestone Dueler A/T Ascent mileage warranty',
    name: 'Dueler A/T Ascent',
    lineKeys: ['bridgestone/dueler-a-t-ascent'],
    summary: 'The Bridgestone Firestone 2025 warranty manual lists Dueler A/T Ascent at 60,000 miles. The exceptions and exact original-equipment table under that line says None.',
    rows: [
      ['Limited mileage table', '60,000 miles'],
      ['Exceptions and exact original-equipment replacements', 'None'],
    ],
    conditions: BRIDGESTONE_LIMITS,
    sourceIds: ['bsManual', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as Dueler A/T Ascent. The manual uses the same name. The manual does not print a separate LT-size mile count under this line.',
  },
  {
    slug: 'firestone-destination-le3-mileage-warranty',
    title: 'Destination LE3 Mileage Warranty',
    h1: 'Firestone Destination LE3 mileage warranty',
    name: 'Destination LE3',
    lineKeys: ['firestone/destination-le3'],
    summary: 'The Bridgestone Firestone 2025 warranty manual lists Destination LE3, in the Firestone section, at 70,000 miles. The exceptions and exact original-equipment table under that line says None.',
    rows: [
      ['Firestone limited mileage table', '70,000 miles'],
      ['Exceptions and exact original-equipment replacements', 'None'],
    ],
    conditions: BRIDGESTONE_LIMITS,
    sourceIds: ['bsManual', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files the name as Destination LE3 under Firestone. Destination LE2 is a different table in the same manual.',
  },
  {
    slug: 'goodyear-assurance-comfortdrive-mileage-warranty',
    title: 'ComfortDrive Mileage Warranty',
    h1: 'Goodyear Assurance ComfortDrive mileage warranty',
    name: 'Assurance ComfortDrive',
    lineKeys: ['goodyear/assurance-comfortdrive'],
    summary: 'Goodyear’s Assurance ComfortDrive page tags the tire “65k mi Warranty.” The page’s schema.org Warranty value is 65,000 miles, and the product data lists 65,000 miles and 105,000 kilometers.',
    rows: [
      ['Product-page tag', '65k mi Warranty'],
      ['schema.org Warranty value on the same page', '65,000 miles'],
      ['Product data on the same page', '65,000 miles and 105,000 kilometers'],
    ],
    conditions: [
      'This page quotes the product page read on the date below. It does not copy a separate warranty booklet.',
      'NHTSA files the name as ASSURANCE COMFORTDRIVE. The record does not name a specific size.',
    ],
    sourceIds: ['comfort', 'nhtsa', 'cfr104'],
    extra: 'Goodyear’s November 2026 offers page names Assurance ComfortDrive. The dollar amount and the purchase window are on this site’s Goodyear rebate page. This page does not restate them, and it does not add a Black Friday price.',
    related: [
      { href: exactPath('goodyear-tire-rebate-november-2026'), label: 'Goodyear November 2026 rebate' },
      { href: blackFridayPath, label: 'Black Friday 2026 tire rebate dates' },
    ],
  },
  {
    slug: 'goodyear-wrangler-workhorse-at-2-mileage-warranty',
    title: 'Workhorse AT 2 Mileage Warranty',
    h1: 'Goodyear Wrangler Workhorse AT 2 mileage warranty',
    name: 'Wrangler Workhorse AT 2',
    lineKeys: ['goodyear/wrangler-workhorse-at-2'],
    summary: 'Goodyear’s Wrangler Workhorse AT 2 page tags the tire “55k mi Warranty.” The schema.org Warranty value is 55,000 miles, and the product data lists 55,000 miles and 90,000 kilometers. The same page tags the tire all-terrain and 3PMSF.',
    rows: [
      ['Product-page tag', '55k mi Warranty'],
      ['schema.org Warranty value on the same page', '55,000 miles'],
      ['Product data on the same page', '55,000 miles and 90,000 kilometers'],
      ['Other tags on the same page', 'All-terrain and 3PMSF'],
    ],
    conditions: [
      'This page quotes the product page read on the date below. It does not copy a separate warranty booklet, and it does not turn the 3PMSF tag into a snow-test result.',
      'NHTSA files WRANGLER WORKHORSE AT 2 separately from WRANGLER WORKHORSE AT. This page is only AT 2.',
    ],
    sourceIds: ['workhorse', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'bfgoodrich-advantage-control-mileage-warranty',
    title: 'Advantage Control Mileage Warranty',
    h1: 'BFGoodrich Advantage Control mileage warranty',
    name: 'Advantage Control',
    lineKeys: ['bf-goodrich/advantage-control'],
    summary: 'BFGoodrich’s Advantage Control page prints a footnote: a 75,000-mile limited treadlife warranty for H-rated tires, and a 65,000-mile limited treadlife warranty for V and W rated tires.',
    rows: [
      ['Footnote on the product page, H-rated', '75,000 miles'],
      ['Footnote on the product page, V and W rated', '65,000 miles'],
    ],
    conditions: [
      'This page quotes footnote 3 on the product page read on the date below. It does not copy a separate warranty booklet.',
      'The warranties module on the same page also prints the numbers 65,000 and 75,000 without repeating the speed-rating split. The footnote is the sentence that assigns the ratings.',
      'NHTSA files the name as Advantage Control. The records do not name a specific size.',
    ],
    sourceIds: ['bfgControl', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'bfgoodrich-trail-terrain-t-a-mileage-warranty',
    title: 'Trail-Terrain T/A Mileage Warranty',
    h1: 'BFGoodrich Trail-Terrain T/A mileage warranty',
    name: 'Trail-Terrain T/A',
    lineKeys: ['bf-goodrich/trail-terrain-t-a'],
    summary: 'BFGoodrich’s Trail-Terrain T/A page says “Mileage warranty: 60,000 miles.” The page’s question-and-answer text repeats a limited mileage warranty of 60,000 miles. It does not split that figure by speed rating.',
    rows: [
      ['Product-page benefit line', '60,000 miles'],
      ['Question and answer on the same page', 'Limited mileage warranty of 60,000 miles'],
    ],
    conditions: [
      'This page quotes the product page read on the date below. It does not copy a separate warranty booklet.',
      'The page also says the tire is severe-snow rated. This page does not turn that sentence into a snow-test result.',
      'NHTSA files the name as Trail-Terrain T/A.',
    ],
    sourceIds: ['bfgTrail', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'hankook-kinergy-pt-mileage-warranty',
    title: 'Kinergy PT Mileage Warranty',
    h1: 'Hankook Kinergy PT mileage warranty',
    name: 'Kinergy PT',
    lineKeys: ['hankook/kinergy-pt'],
    summary: 'Hankook’s Kinergy PT page prints “90K Mileage Warranty (H,T rated)” and “75K Mileage Warranty (V rated).” This page reads 90K as 90,000 miles and 75K as 75,000 miles. The page itself prints the K form.',
    rows: [
      ['Product page, H and T', '90K mileage warranty'],
      ['Product page, V', '75K mileage warranty'],
    ],
    conditions: [
      'This page quotes the product page read on the date below. It does not copy a separate warranty booklet, and it does not add a rotation interval the page did not print.',
      'NHTSA files the name as KInERGy PT. The records are not all one grade.',
    ],
    sourceIds: ['hankookPt', 'nhtsa', 'cfr104'],
  },
  {
    slug: 'cooper-endeavor-plus-mileage-warranty',
    title: 'Endeavor Plus Mileage Warranty',
    h1: 'Cooper Endeavor Plus mileage warranty',
    name: 'Endeavor Plus',
    lineKeys: ['cooper/endeavor-plus-t-rated', 'cooper/endeavor-plus-h-v-rated'],
    summary: 'Cooper’s 2023 warranty booklet lists Endeavor Plus at 65,000 miles (105,000 km). The booklet prints one row. It does not split Endeavor Plus by speed rating.',
    rows: [['2023 booklet, Endeavor Plus', '65,000 miles (105,000 km)']],
    conditions: COOPER_LIMITS,
    sourceIds: ['cooperBook', 'nhtsa', 'cfr104'],
    extra: 'NHTSA files two rows: ENDEAVOR PLUS (T-rated) and ENDEAVOR PLUS (H/V-rated). The booklet does not assign different miles to those rows. A separate booklet row, Endeavor without Plus, is also 65,000 miles. That is a different name.',
  },
  {
    slug: 'bridgestone-turanza-quiettrack-mileage-warranty',
    title: 'QuietTrack Mileage Warranty',
    h1: 'Bridgestone Turanza QuietTrack mileage warranty',
    name: 'Turanza QuietTrack',
    lineKeys: [],
    summary: 'The Bridgestone Firestone 2025 warranty manual lists Turanza QuietTrack at 80,000 miles. The exceptions and exact original-equipment table under that line says None.',
    rows: [
      ['Limited mileage table', '80,000 miles'],
      ['Exceptions and exact original-equipment replacements', 'None'],
    ],
    conditions: BRIDGESTONE_LIMITS,
    sourceIds: ['bsManual', 'nhtsa', 'cfr104'],
    extra: 'The NHTSA ratings file pulled on 2026-10-25 has no line named Turanza QuietTrack. This page does not invent a treadwear grade for it.',
    shop: { brand: 'Bridgestone', line: 'Turanza QuietTrack', brandSlug: 'bridgestone', lineSlug: 'turanza-quiettrack' },
  },
];

function buildTreadwear(def: { slug: string; title: string; h1: string; name: string; keys: string[]; note: string; summary: string; shopKey?: string }): ExactPage {
  const lines = def.keys.map(must);
  const answer = `${lines.map((l) => `${label(l)} is treadwear ${wearText(l)} across ${l.records} NHTSA record${l.records === 1 ? '' : 's'}`).join('. ')}. ${def.note}`;
  const shopLine = def.shopKey ? (() => { const l = must(def.shopKey!); return { brand: l.brand, line: l.line, brandSlug: l.brand_slug, lineSlug: l.line_slug }; })() : undefined;
  return {
    slug: def.slug,
    kind: 'treadwear',
    title: clipTitle(def.title),
    h1: def.h1,
    description: clipDesc(def.summary),
    kicker: 'UTQG treadwear rating',
    answer,
    blocks: [
      nhtsaTable(def.keys),
      p(def.note),
      p('49 CFR § 575.104 makes treadwear a comparison with a government course tire graded 100. It does not state miles. A mileage warranty, when this site has one, is a separate maker document.'),
    ],
    faqs: [
      { q: `What is the ${def.name} treadwear rating?`, a: answer },
      { q: 'Does a higher treadwear number mean more miles?', a: 'No. The grade compares wear rate with a government course tire. Warranty miles, when a maker publishes them, are a separate document.' },
      { q: 'Does this page list a price or a review score?', a: 'No. Both stay off this page. A quote you already have can be typed into the cost-per-mile calculator.' },
    ],
    sources: srcs(['nhtsa', 'cfr104']),
    lineKeys: def.keys,
    shopLine,
    retrieved: WAVE3_DATE,
    related: [calc, lookup],
  };
}

const TREADWEAR: ExactPage[] = [
  buildTreadwear({
    slug: 'falken-wildpeak-at3w-treadwear-rating',
    title: 'Wildpeak AT3W Treadwear Rating',
    h1: 'Falken Wildpeak AT3W treadwear rating',
    name: 'Wildpeak A/T AT3W',
    keys: ['falken/wildpeak-a-t-at3w-t-rating', 'falken/wildpeak-a-t-at3w-h-rating', 'falken/wildpeak-a-t-at3w-s-rating'],
    shopKey: 'falken/wildpeak-a-t-at3w-t-rating',
    summary: 'NHTSA files Wildpeak A/T AT3W as separate rows by speed rating. T-rating treadwear runs 500–660. H-rating runs 600–660. The S-rating row is 600. These are UTQG grades, not miles.',
    note: 'NHTSA splits Wildpeak A/T AT3W by speed rating. WILDPEAK A/T AT3WA is a different set of rows and is not in this table. This site does not cite a mileage warranty for AT3W, so no mile count is added.',
  }),
  buildTreadwear({
    slug: 'falken-wildpeak-at4w-treadwear-rating',
    title: 'Wildpeak AT4W Treadwear Rating',
    h1: 'Falken Wildpeak AT4W treadwear rating',
    name: 'Wildpeak A/T 4W',
    keys: ['falken/wildpeak-a-t-4w-h-rating', 'falken/wildpeak-a-t-4w-nominal-cross-section-235-mm', 'falken/wildpeak-a-t-4w-nominal-cross-section-225-mm'],
    shopKey: 'falken/wildpeak-a-t-4w-h-rating',
    summary: 'NHTSA files three Wildpeak A/T 4W rows, each with treadwear 660. One row is the H rating. The other two split on nominal cross section, at 225 mm and at 235 mm. The grade is not miles.',
    note: 'Each of these three NHTSA rows is treadwear 660. The file separates an H-rating row from two cross-section rows. This site does not cite a mileage warranty for AT4W, so no mile count is added.',
  }),
  buildTreadwear({
    slug: 'hankook-dynapro-at2-treadwear-rating',
    title: 'Dynapro AT2 Treadwear Rating',
    h1: 'Hankook Dynapro AT2 treadwear rating',
    name: 'Dynapro AT2',
    keys: ['hankook/dynapro-at2'],
    shopKey: 'hankook/dynapro-at2',
    summary: 'NHTSA files Hankook Dynapro AT2 at treadwear 440–660, median 580, across 6 records. The grade is a wear index, not a mileage warranty. This site does not cite a mile count for this line.',
    note: 'The spread is inside one NHTSA line. A single Dynapro AT2 grade does not exist in the file. This site does not cite a maker mileage warranty for Dynapro AT2.',
  }),
  buildTreadwear({
    slug: 'falken-aklimate-treadwear-rating',
    title: 'Aklimate Treadwear Rating',
    h1: 'Falken Aklimate treadwear rating',
    name: 'Aklimate',
    keys: ['falken/aklimate'],
    shopKey: 'falken/aklimate',
    summary: 'NHTSA files Falken Aklimate at treadwear 640 on both records. The records do not name a specific size. The grade is not a mileage warranty. This site does not cite a mile count for Aklimate.',
    note: 'Both NHTSA records are 640, and neither names a size. A missing size is not a grade of zero. This site does not cite a maker mileage warranty for Aklimate.',
  }),
];

function xIceTreadwear(): ExactPage {
  const summary = 'The NHTSA ratings file pulled 2026-10-25 has no row named X-Ice Snow. 49 CFR § 575.104 does not require a UTQG treadwear grade for deep-tread winter-type snow tires. A missing row is not a grade of zero.';
  return {
    slug: 'michelin-x-ice-snow-treadwear-rating',
    kind: 'treadwear',
    title: clipTitle('X-Ice Snow Treadwear Rating'),
    h1: 'Michelin X-Ice Snow treadwear rating',
    description: clipDesc(summary),
    kicker: 'UTQG treadwear rating',
    answer: summary,
    blocks: [
      p(summary),
      p('Michelin’s 2025 quick guide lists a 40,000-mile winter treadwear warranty for X-Ice Snow. That warranty is a separate document from UTQG. It is quoted on the mileage-warranty page linked below.'),
      ul([
        'The regulation’s exclusion is for deep-tread, winter-type snow tires. It is an exclusion from the grading requirement, not a ban on a maker filing a grade.',
        'If a later NHTSA pull adds a row, this page should be updated from that row. It should not keep a blank as a grade.',
      ]),
    ],
    faqs: [
      { q: 'What is the X-Ice Snow UTQG treadwear rating?', a: summary },
      { q: 'Does Michelin publish a mileage warranty for the X-Ice Snow?', a: 'Yes. The 2025 quick guide lists 40,000 miles at T and H for X-Ice Snow and for X-Ice Snow SUV, typed as winter. That figure is on the mileage-warranty page, not a UTQG grade.' },
      { q: 'Does this page list a price?', a: 'No. A quote you already have can be typed into the cost-per-mile calculator.' },
    ],
    sources: srcs(['nhtsa', 'cfr104', 'michelinFlyer']),
    lineKeys: [],
    shopLine: { brand: 'Michelin', line: 'X-Ice Snow', brandSlug: 'michelin', lineSlug: 'x-ice-snow' },
    retrieved: WAVE3_DATE,
    related: [
      { href: exactPath('michelin-x-ice-snow-mileage-warranty'), label: 'X-Ice Snow mileage warranty' },
      { href: exactPath('winter-tire-mileage-warranty'), label: 'Winter tire mileage warranty' },
      calc,
      lookup,
    ],
  };
}

interface Cmp {
  slug: string;
  title: string;
  h1: string;
  a: string;
  b: string;
  aMiles: string;
  bMiles: string;
  aSlug?: string;
  bSlug?: string;
  note: string;
  sourceIds: string[];
}

function buildCompare(def: Cmp): ExactPage {
  const a = must(def.a);
  const b = must(def.b);
  const higher = (a.wear_median as number) === (b.wear_median as number)
    ? 'The two median treadwear grades are equal'
    : `${label((a.wear_median as number) > (b.wear_median as number) ? a : b)} has the higher median treadwear grade`;
  const answer = `${higher}: ${label(a)} is ${wearText(a)}, and ${label(b)} is ${wearText(b)}. ${def.note}`;
  const cell = (l: Line, miles: string, slug?: string) => [
    { text: label(l), href: hrefOf(l) },
    { text: wearText(l) },
    { text: miles, href: slug ? exactPath(slug) : undefined },
  ];
  return {
    slug: def.slug,
    kind: 'compare',
    title: clipTitle(def.title),
    h1: def.h1,
    description: clipDesc(`${label(a)} treadwear ${wearText(a)}. ${label(b)} treadwear ${wearText(b)}. Mileage figures are the maker’s warranty, not a road test.`),
    kicker: 'Mileage and treadwear',
    answer,
    blocks: [
      table(
        ['Line', 'NHTSA treadwear', 'Mileage warranty cited'],
        [cell(a, def.aMiles, def.aSlug), cell(b, def.bMiles, def.bSlug)],
        `Treadwear is the NHTSA grade pulled ${PULLED}. The warranty cell is quoted from the maker page linked on this site. A higher grade is not a higher warranty.`,
      ),
      p(def.note),
      p('49 CFR § 575.104 defines treadwear as a grade against a course tire assigned 100. Two lines can share a warranty mile count and still carry different grades.'),
    ],
    faqs: [
      { q: `Which has the higher treadwear grade?`, a: `${higher}. ${label(a)} is ${wearText(a)}. ${label(b)} is ${wearText(b)}.` },
      { q: 'Which mileage warranty is higher?', a: def.note },
      { q: 'Does this comparison include a price?', a: 'No. You can type two quotes into the cost-per-mile comparison. This page does not fill those boxes.' },
    ],
    sources: srcs(def.sourceIds),
    lineKeys: [def.a, def.b],
    retrieved: WAVE3_DATE,
    related: [calc, lookup],
  };
}

const COMPARES: ExactPage[] = [
  buildCompare({
    slug: 'michelin-defender-2-vs-bridgestone-weatherpeak-mileage',
    title: 'Defender2 vs WeatherPeak Mileage',
    h1: 'Michelin Defender2 vs Bridgestone WeatherPeak mileage',
    a: 'michelin/defender-2',
    b: 'bridgestone/weatherpeak',
    aMiles: '80,000 miles at H and V; product page says most sizes',
    bMiles: '70,000 miles; exceptions table says None',
    aSlug: 'michelin-defender-2-mileage-warranty',
    bSlug: 'bridgestone-weatherpeak-mileage-warranty',
    note: 'The highest printed warranty figure is Defender2 at 80,000 miles for H and V. The Defender2 product page also says most sizes. WeatherPeak is 70,000 miles in the 2025 Bridgestone manual. The NHTSA medians are not those miles.',
    sourceIds: ['nhtsa', 'cfr104', 'michelinFlyer', 'michelinDefender2', 'bsManual'],
  }),
  buildCompare({
    slug: 'michelin-defender-2-vs-alenza-as-ultra-mileage',
    title: 'Defender2 vs Alenza AS Ultra Mileage',
    h1: 'Michelin Defender2 vs Bridgestone Alenza AS Ultra mileage',
    a: 'michelin/defender-2',
    b: 'bridgestone/alenza-as-ultra',
    aMiles: '80,000 miles at H and V; product page says most sizes',
    bMiles: '80,000 miles; exceptions table says None',
    aSlug: 'michelin-defender-2-mileage-warranty',
    bSlug: 'bridgestone-alenza-as-ultra-mileage-warranty',
    note: 'Both makers print 80,000 miles. Defender2’s guide row is H and V, and the product page says most sizes. Alenza AS Ultra’s manual lists 80,000 miles with an exceptions table that says None. Equal warranty miles are not equal treadwear grades.',
    sourceIds: ['nhtsa', 'cfr104', 'michelinFlyer', 'michelinDefender2', 'bsManual', 'alenzaPage'],
  }),
  buildCompare({
    slug: 'michelin-crossclimate2-vs-pilot-sport-all-season-4-mileage',
    title: 'CrossClimate2 vs Pilot Sport AS 4 Mileage',
    h1: 'Michelin CrossClimate2 vs Pilot Sport All Season 4 mileage',
    a: 'michelin/crossclimate2',
    b: 'michelin/pilot-sport-all-season-4',
    aMiles: '60,000 miles at H, V, and W',
    bMiles: 'Guide: 45,000 at Y and 30,000 at (Y). Product page also names other cards.',
    aSlug: 'michelin-crossclimate-2-mileage-warranty',
    bSlug: 'michelin-pilot-sport-all-season-4-mileage-warranty',
    note: 'On the 2025 quick guide, CrossClimate2 is 60,000 miles at H, V, and W. Pilot Sport A/S 4 is 45,000 miles at Y and 30,000 at (Y). The Pilot Sport All Season 4 product page also prints cards that include V on both 45,000 and 30,000. This page does not pick one Pilot Sport card.',
    sourceIds: ['nhtsa', 'cfr104', 'michelinFlyer', 'psas4'],
  }),
  buildCompare({
    slug: 'michelin-ltx-a-t2-vs-terraincontact-a-t-mileage',
    title: 'LTX A/T2 vs TerrainContact A/T Mileage',
    h1: 'Michelin LTX A/T2 vs Continental TerrainContact A/T mileage',
    a: 'michelin/ltx-a-t2',
    b: 'continental/terraincontact-a-t',
    aMiles: '60,000 miles at R, S, and T',
    bMiles: '60,000 miles at every speed rating on that row',
    aSlug: 'michelin-ltx-a-t2-mileage-warranty',
    bSlug: 'continental-terraincontact-a-t-mileage-warranty',
    note: 'Both makers print 60,000 miles. Michelin’s row is R, S, and T and is typed all-season. Continental’s article says every speed rating on the TerrainContact A/T row. The NHTSA medians are not the same.',
    sourceIds: ['nhtsa', 'cfr104', 'michelinFlyer', 'contiWarranty'],
  }),
  buildCompare({
    slug: 'hankook-kinergy-pt-vs-michelin-defender-2-mileage',
    title: 'Kinergy PT vs Defender2 Mileage',
    h1: 'Hankook Kinergy PT vs Michelin Defender2 mileage',
    a: 'hankook/kinergy-pt',
    b: 'michelin/defender-2',
    aMiles: '90K at H and T; 75K at V, as printed',
    bMiles: '80,000 miles at H and V; product page says most sizes',
    aSlug: 'hankook-kinergy-pt-mileage-warranty',
    bSlug: 'michelin-defender-2-mileage-warranty',
    note: 'The highest figure on the Kinergy PT page is 90K for H and T, which this site reads as 90,000 miles. Defender2 is 80,000 miles at H and V. Kinergy PT’s V figure is 75K, which is lower than Defender2. The comparison depends on the speed rating.',
    sourceIds: ['nhtsa', 'cfr104', 'hankookPt', 'michelinFlyer'],
  }),
];

function xIceCompare(): ExactPage {
  const cc = must('michelin/crossclimate2');
  const note = 'CrossClimate2’s guide row is 60,000 miles at H, V, and W, typed all-season. X-Ice Snow’s guide row is 40,000 miles at T and H, typed winter, and the NHTSA file has no X-Ice Snow grade. The higher warranty figure is not a winter-traction result. CrossClimate2 is not a dedicated winter tire.';
  return {
    slug: 'michelin-x-ice-snow-vs-crossclimate2-mileage',
    kind: 'compare',
    title: clipTitle('X-Ice Snow vs CrossClimate2 Mileage'),
    h1: 'Michelin X-Ice Snow vs CrossClimate2 mileage',
    description: clipDesc(`X-Ice Snow warranty is 40,000 miles at T and H, typed winter. CrossClimate2 is 60,000 miles at H, V, and W. NHTSA grades CrossClimate2 only.`),
    kicker: 'Mileage and treadwear',
    answer: `Michelin’s 2025 quick guide lists a higher mileage warranty for CrossClimate2 (60,000 miles) than for X-Ice Snow (40,000 miles). ${note}`,
    blocks: [
      table(
        ['Line', 'NHTSA treadwear', 'Mileage warranty cited'],
        [
          [
            { text: 'Michelin X-Ice Snow' },
            { text: `No row in the file pulled ${PULLED}` },
            { text: '40,000 miles at T and H, winter', href: exactPath('michelin-x-ice-snow-mileage-warranty') },
          ],
          [
            { text: label(cc), href: hrefOf(cc) },
            { text: wearText(cc) },
            { text: '60,000 miles at H, V, and W, all-season', href: exactPath('michelin-crossclimate-2-mileage-warranty') },
          ],
        ],
        `Read ${WAVE3_DATE}. The X-Ice Snow SUV row is also 40,000 miles at T and H. It is the same guide, not a second test.`,
      ),
      p(note),
      p('November 27, 2026 falls inside Michelin’s Fall 2026 purchase window. The rebate page quotes that window. It does not add a sale price for either tire.'),
    ],
    faqs: [
      { q: 'Which Michelin tire has the higher mileage warranty, X-Ice Snow or CrossClimate2?', a: 'On the 2025 quick guide, CrossClimate2 is 60,000 miles and X-Ice Snow is 40,000 miles. The rows are different season types.' },
      { q: 'What is the X-Ice Snow treadwear rating?', a: `The NHTSA file pulled ${PULLED} has no X-Ice Snow row. CrossClimate2 is ${wearText(cc)}.` },
      { q: 'Does this page list a Black Friday price?', a: 'No. The rebate page states the purchase window. This page does not add a price.' },
    ],
    sources: srcs(['michelinFlyer', 'xIce', 'nhtsa', 'cfr104']),
    lineKeys: ['michelin/crossclimate2'],
    retrieved: WAVE3_DATE,
    related: [
      { href: exactPath('michelin-x-ice-snow-mileage-warranty'), label: 'X-Ice Snow mileage warranty' },
      { href: exactPath('michelin-tire-rebate-november-2026'), label: 'Michelin November 2026 rebate' },
      { href: blackFridayPath, label: 'Black Friday 2026 tire rebate dates' },
      calc,
      lookup,
    ],
  };
}

interface MileFact {
  key: string;
  high: number;
  text: string;
  slug: string;
}

const MILES: MileFact[] = [
  { key: 'hankook/kinergy-pt', high: 90000, text: '90K at H and T; 75K at V, as printed', slug: 'hankook-kinergy-pt-mileage-warranty' },
  { key: 'goodyear/assurance-maxlife-2', high: 85000, text: '85,000 miles on the product page', slug: 'goodyear-assurance-maxlife-2-mileage-warranty' },
  { key: 'michelin/defender-2', high: 80000, text: '80,000 miles at H and V; product page says most sizes', slug: 'michelin-defender-2-mileage-warranty' },
  { key: 'michelin/defender-t-h', high: 80000, text: '80,000 miles at H', slug: 'michelin-defender-t-h-mileage-warranty' },
  { key: 'continental/contiprocontact', high: 80000, text: '80,000 at S and T; 60,000 at H; 40,000 at V and W', slug: 'continental-contiprocontact-mileage-warranty' },
  { key: 'continental/truecontact-tour', high: 80000, text: '80,000 at T and H; 70,000 at V, shared with Tour 54', slug: 'continental-truecontact-tour-mileage-warranty' },
  { key: 'bridgestone/alenza-as-ultra', high: 80000, text: '80,000 miles; exceptions table says None', slug: 'bridgestone-alenza-as-ultra-mileage-warranty' },
  { key: 'michelin/defender-ltx-m-s-2', high: 75000, text: '75,000 at T and H; 50,000 at S', slug: 'michelin-defender-ltx-m-s-2-mileage-warranty' },
  { key: 'bf-goodrich/advantage-control', high: 75000, text: '75,000 at H; 65,000 at V and W', slug: 'bfgoodrich-advantage-control-mileage-warranty' },
  { key: 'continental/purecontact-ls', high: 70000, text: '70,000 miles', slug: 'continental-purecontact-ls-mileage-warranty' },
  { key: 'continental/terraincontact-h-t', high: 70000, text: '70,000 at T and H; 60,000 at R and S', slug: 'continental-terraincontact-h-t-mileage-warranty' },
  { key: 'continental/crosscontact-lx25', high: 70000, text: '70,000 at T and H; 65,000 at V', slug: 'continental-crosscontact-lx25-mileage-warranty' },
  { key: 'bridgestone/weatherpeak', high: 70000, text: '70,000 miles; exceptions table says None', slug: 'bridgestone-weatherpeak-mileage-warranty' },
  { key: 'firestone/destination-le3', high: 70000, text: '70,000 miles; exceptions table says None', slug: 'firestone-destination-le3-mileage-warranty' },
  { key: 'michelin/latitude-tour', high: 65000, text: '65,000 miles at S and T', slug: 'michelin-latitude-tour-mileage-warranty' },
  { key: 'continental/procontact-tx', high: 65000, text: '65,000 at S and T; 55,000 at H; 45,000 at V; 40,000 at W', slug: 'continental-procontact-tx-mileage-warranty' },
  { key: 'continental/procontact-gx', high: 65000, text: '65,000 at S and T; 55,000 at H; 45,000 at V; 40,000 at W', slug: 'continental-procontact-gx-mileage-warranty' },
  { key: 'goodyear/assurance-comfortdrive', high: 65000, text: '65,000 miles on the product page', slug: 'goodyear-assurance-comfortdrive-mileage-warranty' },
  { key: 'cooper/endeavor-plus-t-rated', high: 65000, text: '65,000 miles; the booklet does not split speed ratings', slug: 'cooper-endeavor-plus-mileage-warranty' },
  { key: 'cooper/endeavor-plus-h-v-rated', high: 65000, text: '65,000 miles; the booklet does not split speed ratings', slug: 'cooper-endeavor-plus-mileage-warranty' },
  { key: 'michelin/crossclimate2', high: 60000, text: '60,000 miles at H, V, and W', slug: 'michelin-crossclimate-2-mileage-warranty' },
  { key: 'michelin/ltx-a-t2', high: 60000, text: '60,000 miles at R, S, and T', slug: 'michelin-ltx-a-t2-mileage-warranty' },
  { key: 'michelin/premier-ltx', high: 60000, text: '60,000 miles at T, H, and V', slug: 'michelin-premier-ltx-mileage-warranty' },
  { key: 'continental/terraincontact-a-t', high: 60000, text: '60,000 miles at every speed rating on that row', slug: 'continental-terraincontact-a-t-mileage-warranty' },
  { key: 'goodyear/assurance-weatherready-2', high: 60000, text: '60,000 miles on the product page', slug: 'goodyear-assurance-weatherready-2-mileage-warranty' },
  { key: 'bridgestone/dueler-a-t-ascent', high: 60000, text: '60,000 miles; exceptions table says None', slug: 'bridgestone-dueler-a-t-ascent-mileage-warranty' },
  { key: 'bf-goodrich/trail-terrain-t-a', high: 60000, text: '60,000 miles on the product page', slug: 'bfgoodrich-trail-terrain-t-a-mileage-warranty' },
  { key: 'michelin/primacy-tour-a-s', high: 55000, text: '55,000 at H and V; 45,000 at W', slug: 'michelin-primacy-tour-a-s-mileage-warranty' },
  { key: 'michelin/primacy-a-s', high: 55000, text: '55,000 at T, H, and V; 45,000 at W and Y', slug: 'michelin-primacy-a-s-mileage-warranty' },
  { key: 'michelin/primacy-mxm4', high: 55000, text: '55,000 at H and V; 45,000 at W', slug: 'michelin-primacy-mxm4-mileage-warranty' },
  { key: 'continental/procontact-rx', high: 55000, text: '55,000 at H; 45,000 at V; 40,000 at W', slug: 'continental-procontact-rx-mileage-warranty' },
  { key: 'goodyear/wrangler-workhorse-at-2', high: 55000, text: '55,000 miles on the product page', slug: 'goodyear-wrangler-workhorse-at-2-mileage-warranty' },
  { key: 'continental/extremecontact-dws06-plus', high: 50000, text: '50,000 miles', slug: 'continental-extremecontact-dws06-plus-mileage-warranty' },
  { key: 'michelin/pilot-sport-all-season-4', high: 45000, text: 'Guide: 45,000 at Y and 30,000 at (Y)', slug: 'michelin-pilot-sport-all-season-4-mileage-warranty' },
];

const mileByKey = new Map(MILES.map((m) => [m.key, m]));

const LONGEST_SIZES = ['225-65r17', '235-55r19', '225-60r18', '205-55r16', '235-65r17', '275-65r18'];
const BEST_MILEAGE_SIZES = new Set(['225-65r17', '265-70r17', '265-65r18', '215-60r16', '235-60r18', '205-55r16', '215-55r17', '255-70r17', '255-60r19', '285-45r20', '305-40r22', '275-70r16']);

function buildLongest(sizeKey: string): ExactPage {
  const s = sizeByKey.get(sizeKey);
  if (!s) throw new Error(`wave3 size missing ${sizeKey}`);
  const hits = s.rows.flatMap((r) => {
    const fact = mileByKey.get(`${r.brand_slug}/${r.line_slug}`);
    if (!fact) return [];
    const line = lineByKey.get(`${r.brand_slug}/${r.line_slug}`);
    return [{ row: r, fact, line }];
  }).sort((a, b) => b.fact.high - a.fact.high || a.row.brand.localeCompare(b.row.brand) || a.row.line.localeCompare(b.row.line));
  if (hits.length < 2) throw new Error(`wave3 longest ${sizeKey} has ${hits.length} cited lines`);
  const top = hits[0].fact.high;
  const tied = hits.filter((h) => h.fact.high === top);
  const tiedNames = tied.map((h) => `${h.row.brand} ${h.row.line}`).join('; ');
  const absent = MILES.filter((m) => m.high > top && !hits.some((h) => `${h.row.brand_slug}/${h.row.line_slug}` === m.key))
    .sort((a, b) => b.high - a.high)
    .filter((m, i, arr) => arr.findIndex((x) => x.slug === m.slug) === i)
    .slice(0, 4);
  const answer = `Among lines NHTSA names for ${s.label}, and for which this site cites a maker mileage warranty, the highest printed figure is ${top.toLocaleString('en-US')} miles, for ${tiedNames}. That figure is the top of the maker’s table, not a mile count for every speed rating in ${s.label}. Lines filed only as “All sizes” are not in the table.`;
  const blocks: Block[] = [
    table(
      ['Line', 'Highest figure cited', 'What the maker prints', 'Treadwear on this size'],
      hits.map((h) => {
        const span = h.row.wear_min === h.row.wear_max ? String(h.row.wear_min) : `${h.row.wear_min}–${h.row.wear_max}`;
        return [
          { text: `${h.row.brand} ${h.row.line}`, href: h.line && hasLine(h.line) ? lineUrl(h.line) : undefined },
          { text: h.fact.high.toLocaleString('en-US'), href: exactPath(h.fact.slug) },
          { text: h.fact.text },
          { text: span },
        ];
      }),
      `Read ${WAVE3_DATE}. The treadwear cell is the NHTSA grade on the record that names ${s.label}, pulled ${PULLED}. Rank uses the highest printed warranty figure, so a lower speed rating on the same line can be a smaller number.`,
    ),
    p(answer),
  ];
  if (absent.length) {
    blocks.push(p(`These cited lines have a higher printed figure and the NHTSA file does not name ${s.label} on their records, so they are not ranked here: ${absent.map((m) => `${must(m.key).brand} ${must(m.key).line} at ${m.high.toLocaleString('en-US')} miles`).join('; ')}. A missing size row is not proof the tire is unsold in ${s.label}.`));
  }
  blocks.push(p('A quote you already have can be typed into the one cost-per-mile calculator. This page does not store a price and does not fill the miles in for you.'));
  return {
    slug: `${sizeKey}-tires-longest-warranty`,
    kind: 'longest',
    title: clipTitle(`${s.label} Longest Cited Warranty`),
    h1: `${s.label} tires with the longest cited warranty`,
    description: clipDesc(`Highest cited mileage warranty among NHTSA lines that name ${s.label} is ${top.toLocaleString('en-US')} miles (${tiedNames}). Speed ratings can be lower. Not a road test.`),
    kicker: 'Longest cited mileage warranty',
    answer,
    blocks,
    faqs: [
      { q: `Which ${s.label} tire has the longest mileage warranty in this file?`, a: answer },
      { q: 'Why are some long-warranty tires missing?', a: `The table keeps a line only when NHTSA names ${s.label} and this site cites a maker warranty. A line filed as “All sizes” stays off the table. A tire with no cited warranty stays off even if the grade is high.` },
      { q: 'Does this page list prices?', a: 'No. Use the cost-per-mile calculator with a quote you already have. The warranty miles are a ceiling from the maker, not a forecast.' },
    ],
    sources: srcs(['nhtsa', 'cfr104', 'michelinFlyer', 'contiWarranty', 'bsManual', 'hankookPt', 'goodyearMl']),
    lineKeys: hits.map((h) => `${h.row.brand_slug}/${h.row.line_slug}`),
    sizeKey,
    shopSize: s.label,
    retrieved: WAVE3_DATE,
    related: [
      ...(BEST_MILEAGE_SIZES.has(sizeKey) ? [{ href: exactPath(`${sizeKey}-best-mileage-tire`), label: `${s.label} highest UTQG grade` }] : []),
      ...tied.slice(0, 3).map((h) => ({ href: exactPath(h.fact.slug), label: `${h.row.brand} ${h.row.line} mileage warranty` })),
      calc,
      lookup,
    ],
  };
}

function winterPage(): ExactPage {
  const summary = 'Michelin’s 2025 guide lists winter mileage warranties from 25,000 to 40,000 miles by line. The Bridgestone Firestone 2025 manual says winter tires have no limited mileage warranty. Continental’s June 12, 2026 list does not name a winter line.';
  return {
    slug: 'winter-tire-mileage-warranty',
    kind: 'winter',
    title: clipTitle('Winter Tire Mileage Warranty'),
    h1: 'Winter tire mileage warranty',
    description: clipDesc(summary),
    kicker: 'Winter mileage warranty',
    answer: `${summary} November 27, 2026 is Black Friday. A maker rebate is a separate page, and none of these warranty documents prints a sale price.`,
    blocks: [
      table(
        ['Michelin 2025 guide row', 'Speed rating', 'Miles'],
        [
          [{ text: 'X-Ice Snow' }, { text: 'T, H' }, { text: '40,000' }],
          [{ text: 'X-Ice Snow SUV' }, { text: 'T, H' }, { text: '40,000' }],
          [{ text: 'X-Ice Xi3' }, { text: 'T, H' }, { text: '40,000' }],
          [{ text: 'X-Ice Xi3 ZP' }, { text: 'H' }, { text: '30,000' }],
          [{ text: 'Latitude X-Ice Xi2' }, { text: 'T, H' }, { text: '40,000' }],
          [{ text: 'Latitude X-Ice Xi2 ZP' }, { text: 'T, H' }, { text: '30,000' }],
          [{ text: 'Pilot Alpin 5 and Pilot Alpin 5 SUV' }, { text: 'H, V' }, { text: '30,000' }],
          [{ text: 'Pilot Alpin PA4' }, { text: 'V, W, H' }, { text: '30,000' }],
          [{ text: 'Latitude Alpin and Latitude Alpin LA2' }, { text: 'H, V' }, { text: '25,000' }],
        ],
        `Each of these rows is typed Winter on the guide, read ${WAVE3_DATE}. One row under the winter heading is typed All-Season (X Tour A/S2, 80,000 miles). It is not in this table.`,
      ),
      ul([WINTER_LIMIT, ...MICHELIN_LIMITS]),
      p('The Bridgestone Firestone 2025 manual says: winter and temporary-use spare tires have no limited mileage warranty. The same manual’s covered-tire tables do not name Blizzak. That manual is the Costco U.S. English edition.'),
      p('Continental’s mileage-warranty article, updated June 12, 2026, lists the lines that carry a mileage figure. No line in that list has Winter, Ice, or Viking in the name. The article does not add a sentence that an unlisted line is uncovered. This page does not add one.'),
      p('The NHTSA file pulled on 2026-10-25 has no X-Ice Snow row. 49 CFR § 575.104 does not require a treadwear grade for deep-tread winter-type snow tires. A missing row is not a grade of zero.'),
      p('Michelin’s Fall 2026 purchase window includes November 27 and November 30, 2026. The rebate page says the offer covers new Michelin passenger or light truck tires and does not limit the offer to one model. The maker page does not call the window Black Friday, and it does not print a sale price. A quote you already have can be typed into the cost-per-mile calculator.'),
    ],
    faqs: [
      { q: 'Do winter tires have a mileage warranty?', a: 'Michelin’s 2025 guide lists winter rows from 25,000 to 40,000 miles. The Bridgestone Firestone 2025 manual says winter tires have no limited mileage warranty. Continental’s June 12, 2026 mileage list does not name a winter line.' },
      { q: 'What is the Michelin X-Ice Snow mileage warranty?', a: 'The guide lists 40,000 miles at T and H for X-Ice Snow and for X-Ice Snow SUV. The product page also prints 40,000 miles. Coverage needs the guide’s install-and-remove record for each winter.' },
      { q: 'Does Black Friday 2026 change these miles?', a: 'No. November 27, 2026 is a calendar date inside some makers’ purchase windows. Those windows are on the rebate pages. They are not a new mileage warranty and not a sale price.' },
    ],
    sources: srcs(['michelinFlyer', 'xIce', 'bsManual', 'contiWarranty', 'nhtsa', 'cfr104']),
    lineKeys: ['michelin/crossclimate2'],
    shopLine: { brand: 'Michelin', line: 'X-Ice Snow', brandSlug: 'michelin', lineSlug: 'x-ice-snow' },
    retrieved: WAVE3_DATE,
    related: [
      { href: exactPath('michelin-x-ice-snow-mileage-warranty'), label: 'X-Ice Snow mileage warranty' },
      { href: exactPath('michelin-x-ice-snow-vs-crossclimate2-mileage'), label: 'X-Ice Snow vs CrossClimate2 mileage' },
      { href: exactPath('michelin-tire-rebate-november-2026'), label: 'Michelin November 2026 rebate' },
      { href: blackFridayPath, label: 'Black Friday 2026 tire rebate dates' },
      { href: '/guides/all-season-vs-all-weather-vs-winter-tires/', label: 'All-season vs all-weather vs winter' },
      calc,
      lookup,
    ],
  };
}

export const WAVE3_PAGES: ExactPage[] = [
  ...WARRANTIES.map(buildWarranty),
  ...TREADWEAR,
  xIceTreadwear(),
  ...COMPARES,
  xIceCompare(),
  ...LONGEST_SIZES.map(buildLongest),
  winterPage(),
];

if (WAVE3_PAGES.length !== 40) throw new Error(`wave3 page count ${WAVE3_PAGES.length}`);
