// Load index and speed rating cells read from Michelin’s own charts on CHART_DATE.
// Kilograms: Michelin UK chart, indexes 70–120, every cell in that table.
// Pounds: Michelin USA change-size chart, only the indexes below, where the pound
// cell was read and compared with the kilogram chart. Conflicting USA kilogram cells
// are stored so a page can say they were not used. Nothing else is filled in.
import { CHART_DATE } from './paths';

export { CHART_DATE };
export const MICHELIN_UK_CHART = 'https://www.michelin.co.uk/auto/advice/tyre-basics/tyre-load-rating-speed-rating';
export const MICHELIN_US_CHANGE = 'https://www.michelinman.com/auto/auto-tips-and-advice/tire-buying-guide/change-size-spec';
export const MICHELIN_US_101 = 'https://www.michelinman.com/auto/auto-tips-and-advice/tires-101/tire-load-rating-speed-rating';

/** Kilograms per tire, Michelin UK chart, indexes 70 through 120. */
export const LOAD_KG: { index: number; kg: number }[] = [
  [70, 335], [71, 345], [72, 355], [73, 365], [74, 375], [75, 387], [76, 400], [77, 412], [78, 425], [79, 437],
  [80, 450], [81, 462], [82, 475], [83, 487], [84, 500], [85, 515], [86, 530], [87, 545], [88, 560], [89, 580],
  [90, 600], [91, 615], [92, 630], [93, 650], [94, 670], [95, 690], [96, 710], [97, 730], [98, 750], [99, 775],
  [100, 800], [101, 825], [102, 850], [103, 875], [104, 900], [105, 925], [106, 950], [107, 975], [108, 1000], [109, 1030],
  [110, 1060], [111, 1090], [112, 1120], [113, 1150], [114, 1180], [115, 1215], [116, 1250], [117, 1285], [118, 1320], [119, 1360],
  [120, 1400],
].map(([index, kg]) => ({ index, kg }));

export interface LoadPage {
  code: string;
  kg: number;
  /** Pound cell printed on Michelin USA’s change-size chart. */
  lb: number;
  /** Kilogram cell printed on that same USA row. */
  usKg: number;
  usKgAgrees: boolean;
}

export const LOAD_PAGES: LoadPage[] = [
  { code: '91', kg: 615, lb: 1356, usKg: 3615, usKgAgrees: false },
  { code: '94', kg: 670, lb: 1477, usKg: 670, usKgAgrees: true },
  { code: '95', kg: 690, lb: 1521, usKg: 690, usKgAgrees: true },
  { code: '97', kg: 730, lb: 1609, usKg: 730, usKgAgrees: true },
  { code: '100', kg: 800, lb: 1764, usKg: 800, usKgAgrees: true },
  { code: '104', kg: 900, lb: 1984, usKg: 900, usKgAgrees: true },
];

export function loadNeighbors(index: number) {
  const i = LOAD_KG.findIndex((c) => c.index === index);
  if (i < 0) return [];
  return LOAD_KG.slice(Math.max(0, i - 1), i + 2);
}

export interface SpeedRow {
  letter: string;
  mph: number;
  kmh: number;
  /** Michelin USA’s vehicle-type words, as printed on the change-size chart. */
  usLabel: string;
  page: boolean;
}

/** Letters both Michelin charts state at the same mph. */
export const SPEED_ROWS: SpeedRow[] = [
  { letter: 'L', mph: 75, kmh: 120, usLabel: 'Off-Road & Light Truck Tires', page: false },
  { letter: 'M', mph: 81, kmh: 130, usLabel: 'Temporary Spare Tire', page: false },
  { letter: 'N', mph: 87, kmh: 140, usLabel: 'Temporary Spare Tires', page: false },
  { letter: 'Q', mph: 99, kmh: 160, usLabel: 'Winter 4x4', page: false },
  { letter: 'R', mph: 106, kmh: 170, usLabel: 'Heavy Duty Light Truck', page: false },
  { letter: 'S', mph: 112, kmh: 180, usLabel: 'Family Sedans & Vans', page: true },
  { letter: 'T', mph: 118, kmh: 190, usLabel: 'Family Sedans & Vans', page: true },
  { letter: 'U', mph: 124, kmh: 200, usLabel: 'Sedans & Coupes', page: false },
  { letter: 'H', mph: 130, kmh: 210, usLabel: 'Sport Sedans & Coupes', page: true },
  { letter: 'V', mph: 149, kmh: 240, usLabel: 'Sport Cars', page: true },
  { letter: 'W', mph: 168, kmh: 270, usLabel: 'Exotic Sport Cars', page: true },
  { letter: 'Y', mph: 186, kmh: 300, usLabel: 'Exotic Sport Cars', page: true },
];

export const SPEED_PAGES = SPEED_ROWS.filter((r) => r.page);

export function lbLabel(n: number): string {
  return n.toLocaleString('en-US');
}
