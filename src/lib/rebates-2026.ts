// Manufacturer rebate facts read from the maker's own page on REBATE_DATE.
// Amounts are written in words so this file never invents a price feed.
// A purchase window is listed only when that page states dates inside November or December 2026.
import { REBATE_DATE } from './paths';

export { REBATE_DATE };

export interface RebateOffer {
  id: string;
  maker: string;
  name: string;
  /** Months in which the stated purchase window includes at least one day. */
  purchaseMonths: ('2026-11' | '2026-12')[];
  /** True when the maker prints a submission deadline that falls in December 2026. */
  decemberSubmission: boolean;
  purchase: string;
  submission: string;
  reward: string;
  tires: string;
  notes: string[];
  /** NHTSA line keys that match a model the maker named. Rendered only when that line has a page. */
  lines: string[];
  brandSlug: string;
  sourceId: string;
  /** Extra maker documents for the same offer, such as a terms PDF. */
  alsoSourceIds?: string[];
}

export const REBATE_OFFERS: RebateOffer[] = [
  {
    id: 'michelin-fall-north',
    maker: 'Michelin',
    name: '2026 Michelin Fall-North Promotion',
    purchaseMonths: ['2026-11'],
    decemberSubmission: true,
    purchase: 'Purchase completed between September 3, 2026 and November 30, 2026.',
    submission: 'All requests must be received by December 31, 2026.',
    reward: 'One 80-dollar Visa reward card or Visa virtual account per purchase of four new Michelin passenger or light truck tires, including the Agilis family.',
    tires: 'New Michelin passenger or light truck tires, including the Agilis family. The page does not limit the offer to one model line.',
    notes: [
      'The buyer must be a U.S. resident, at least 18, buying from a participating dealer in the 50 states, the District of Columbia, Puerto Rico, Guam, or the U.S. Virgin Islands.',
      'Warehouse clubs (Sam’s Club, BJ’s, Costco), mass merchandisers, and national retailers including Discount Tire and Big O are excluded from this manufacturer offer. Michelin says those stores may have their own offer.',
      'The offer is not stackable with another Michelin manufacturer offer. Buy-three-get-one style deals and similar combinations are excluded. Limit of three redemptions per household.',
      'Michelin says it may modify or discontinue the offer. The page does not use the words Black Friday or Cyber Monday.',
      'Please allow four to six weeks for the reward card by mail, and three to five weeks for the virtual account by email. That is reward-card timing, not a tire shipping cutoff.',
      'The Fall-North page tells callers to name this promotion. The text does not list which states are in Fall-North, so this site does not guess a state map.',
    ],
    lines: [],
    brandSlug: 'michelin',
    sourceId: 'michelinFallNorth',
  },
  {
    id: 'michelin-fall-south',
    maker: 'Michelin',
    name: '2026 Michelin Fall-South Promotion',
    purchaseMonths: ['2026-11'],
    decemberSubmission: true,
    purchase: 'Purchase completed between September 3, 2026 and November 30, 2026.',
    submission: 'All requests must be received by December 31, 2026.',
    reward: 'One 80-dollar Visa reward card or Visa virtual account per purchase of four new Michelin passenger or light truck tires, including the Agilis family.',
    tires: 'Same tire scope as Fall-North. The two pages name different promotions and tell you which name to use if you call.',
    notes: [
      'The legal paragraph matches Fall-North: participating dealers, the same retailer exclusions, the same stacking limit, and the same age and residency rules.',
      'The page does not use the words Black Friday or Cyber Monday, and it does not list which states are Fall-South.',
    ],
    lines: [],
    brandSlug: 'michelin',
    sourceId: 'michelinFallSouth',
  },
  {
    id: 'bfgoodrich-fall',
    maker: 'BFGoodrich',
    name: '2026 BFGoodrich Fall Promotion',
    purchaseMonths: ['2026-11'],
    decemberSubmission: true,
    purchase: 'Purchase completed between September 3, 2026 and November 30, 2026.',
    submission: 'All requests must be received by December 31, 2026.',
    reward: 'One 80-dollar Visa reward card or Visa virtual account per purchase of four new BFGoodrich passenger or light truck tires, including the HD Pro and Route Control families.',
    tires: 'New BFGoodrich passenger or light truck tires, including the HD Pro and Route Control families.',
    notes: [
      'U.S. residents, at least 18, buying from a participating dealer in the 50 states, the District of Columbia, Puerto Rico, Guam, or the U.S. Virgin Islands.',
      'Warehouse clubs (Sam’s Club, BJ’s, Costco), mass merchandisers, and national retailers including Discount Tire and Big O are excluded. The page says those stores may have their own offer.',
      'Not stackable with another BFGoodrich manufacturer offer. Buy-three-get-one style deals and similar combinations are excluded. Limit of three redemptions per household.',
      'The legal text says Michelin fleet customers, including North American Fleet Accounts and Advantage Accounts, are not eligible. That is the sentence on the BFGoodrich page.',
      'Four to six weeks for the reward card by mail, and three to five weeks for the virtual account by email. That is not a tire shipping cutoff. The page does not say Black Friday or Cyber Monday.',
    ],
    lines: [],
    brandSlug: 'bf-goodrich',
    sourceId: 'bfgFall',
  },
  {
    id: 'goodyear-sep-nov',
    maker: 'Goodyear',
    name: 'Goodyear tire rebates on the current offers page',
    purchaseMonths: ['2026-11'],
    decemberSubmission: false,
    purchase: 'Offer valid on purchases made September 1, 2026 through November 30, 2026.',
    submission: 'The page’s FAQ says consumers have one month from the promotion end date to submit, and its example is a promotion ending March 31 that must be postmarked or submitted online no later than April 30. The page does not print a December 2026 date for this offer.',
    reward: 'Headings on the page, with the tire names listed under each heading: up to 200 dollars back with the Goodyear Credit Card (Eagle F1 All Season; Wrangler DuraTrac RT); up to 150 dollars back with the Goodyear Credit Card (Assurance WeatherReady 2); 100 dollars back with any payment type (Wrangler Outbound AT); 80 dollars back with any payment type (Wrangler Steadfast HT; Vector 4Seasons Gen-3; Assurance MaxLife 2); 60 dollars back with any payment type (Assurance ComfortDrive). The savings line says the rebate is by online or mail-in submission and paid by prepaid card.',
    tires: 'The models named under those headings. Vector 4Seasons Gen-3 is marked subject to availability.',
    notes: [
      'The FAQ says a rebate requires a minimum of four eligible tires. The dollar headings do not themselves say “per set.”',
      '“Up to” is the page’s wording on the credit-card headings. This site does not turn “up to” into a guaranteed amount.',
      'The page does not use the words Black Friday or Cyber Monday, and it does not state a tire shipping cutoff.',
    ],
    lines: [
      'goodyear/wrangler-duratrac-rt',
      'goodyear/assurance-weatherready-2',
      'goodyear/wrangler-outbound-at',
      'goodyear/wrangler-steadfast-ht',
      'goodyear/assurance-maxlife-2',
      'goodyear/assurance-comfortdrive',
    ],
    brandSlug: 'goodyear',
    sourceId: 'goodyearRebate',
  },
  {
    id: 'cooper-sep-nov',
    maker: 'Cooper',
    name: 'Cooper tire rebates on Goodyear’s offers page',
    purchaseMonths: ['2026-11'],
    decemberSubmission: false,
    purchase: 'The Cooper block on the same Goodyear page says the offer is valid on purchases made September 1, 2026 through November 30, 2026.',
    submission: 'The FAQ on that page is the same one-month-from-the-end rule, with the March 31 to April 30 example. It does not print a December 2026 submission date.',
    reward: 'Headings on the page: up to 140 dollars back with the Goodyear Credit Card (TractionCommand); up to 120 dollars back with the Goodyear Credit Card (ProControl; Discoverer Stronghold AT; Discoverer Road+Trail AT); 70 dollars back with any payment type (Discoverer Rugged Trek; Discoverer HT; Cobra Instinct). The Cooper savings line says online or mail-in rebate, paid by prepaid card.',
    tires: 'The models named under those headings. Discoverer HT is marked subject to availability.',
    notes: [
      'Cooper’s own rebate URL did not return the offer text when this site fetched it. The amounts and dates here are the ones printed on Goodyear’s offers page, which publishes the Cooper block.',
      'The same FAQ requires a minimum of four eligible tires. NHTSA files ProControl as separate H-rated, T-rated, and V-rated lines. The Goodyear page says ProControl and does not name a speed rating.',
      'The page does not say Black Friday, Cyber Monday, or a tire shipping cutoff.',
    ],
    lines: [
      'cooper/traction-command',
      'cooper/procontrol-h-rated',
      'cooper/procontrol-t-rated',
      'cooper/procontrol-v-rated',
      'cooper/discoverer-road-trail-at',
      'cooper/discoverer-rugged-trek',
      'cooper/discoverer-ht',
      'cooper/cobra-instinct',
    ],
    brandSlug: 'cooper',
    sourceId: 'goodyearRebate',
  },
  {
    id: 'pirelli-november',
    maker: 'Pirelli',
    name: 'Pirelli 2026 November rebate',
    purchaseMonths: ['2026-11'],
    decemberSubmission: true,
    purchase: 'A new set of four qualifying tires from participating dealers between November 1, 2026 and November 30, 2026.',
    submission: 'The overview page, and page 1 of the terms PDF, say requests must be postmarked if mailed, or submitted online, by December 30, 2026, at 11:59 p.m. EST. The terms section on page 2 of the same PDF says October 30, 2026, at 11:59 EST. Both dates are printed. This site does not choose between them.',
    reward: 'A 100-dollar Pirelli Visa prepaid card. The card is issued as a digital card unless the buyer opts for a physical card. The PDF says the digital card is issued within four weeks, and a physical card takes six to eight weeks. A physical card expires six months after issuance.',
    tires: 'Scorpion Weatheractive or Cinturato Weatheractive, a set of four. The qualifying-tire list in the PDF names those two and no others.',
    notes: [
      'The PDF says the offer is not combinable with any other offer and is not valid on Sam’s Club purchases. It is for legal residents of the 50 states, the District of Columbia, and Puerto Rico who are 18 or older and are individual consumers.',
      'The overview page lists support at 1-866-351-3488. The terms PDF marks a different email address as TBD. Use the overview page for the phone.',
      'The pages do not say Black Friday or Cyber Monday. The four-week and six-to-eight-week figures are for the prepaid card, not a tire shipping cutoff.',
    ],
    lines: [],
    brandSlug: 'pirelli',
    sourceId: 'pirelliNov',
    alsoSourceIds: ['pirelliNovTerms'],
  },
];

export interface OutsideOffer {
  id: string;
  maker: string;
  summary: string;
  sourceIds: string[];
}

/** Maker pages we read that do not publish a November or December 2026 purchase window. */
export const OUTSIDE_OFFERS: OutsideOffer[] = [
  {
    id: 'continental',
    maker: 'Continental',
    summary: 'The offers page says “Promotion Has Ended.” The dated promotion page says purchases between July 1 and August 31, 2026, with the rebate form postmarked or submitted online by September 30, 2026. That page describes a 110-dollar prepaid Mastercard on four qualifying tires, plus 90 dollars more with a Continental Tire credit card. Those purchase dates are not November or December 2026.',
    sourceIds: ['contiOffers', 'contiPromotion'],
  },
  {
    id: 'bridgestone',
    maker: 'Bridgestone',
    summary: 'The fall 2026 automotive offer says 80 dollars with a set of four eligible Bridgestone tires, plus 100 dollars when the purchase uses a CFNA credit card, and “up to 180 dollars” on a Bridgestone prepaid Mastercard. Offer valid October 1 through October 31, 2026. Submit the claim no later than November 10, 2026. The purchase window is October.',
    sourceIds: ['bridgestoneFall'],
  },
  {
    id: 'firestone',
    maker: 'Firestone',
    summary: 'The fall 2026 page says up to 70 dollars with a set of four eligible Firestone tires, plus 100 dollars with a CFNA credit card. Eligible for the 70-dollar card: Affinity AS, Destination, Firehawk, or WeatherGrip. Eligible for a 60-dollar card: Firestone All Season or Pathway AS. Offer valid October 1 through October 31, 2026. Submit the claim no later than November 10, 2026. The purchase window is October.',
    sourceIds: ['firestoneFall'],
  },
  {
    id: 'general',
    maker: 'General',
    summary: 'The promotion page says purchases between September 1 and October 31, 2026, with the form submitted online or postmarked by November 30, 2026. It says 90 dollars on four qualifying tires in one group (G-MAX RS, Grabber APT, Grabber A/T X, Grabber H/T, Grabber HTS 60, and Grabber X 3), plus another 90 dollars with the General Tire credit card, or 70 dollars on four tires in a second group, plus another 70 dollars with that card. The purchase window ends October 31, 2026, so a November purchase is outside it. The November 30 date is a submission deadline for an earlier purchase.',
    sourceIds: ['generalPromotion'],
  },
];

export const UNVERIFIED_NOTES: { maker: string; summary: string; sourceId: string }[] = [
  {
    maker: 'Uniroyal',
    summary: 'The promotions page, fetched the same day, invites visitors to check back and does not state a November or December 2026 rebate.',
    sourceId: 'uniroyalPromos',
  },
  {
    maker: 'Kumho',
    summary: 'The rebates page, with the year filter on 2026, showed “No Results Found.” No Kumho rebate is listed.',
    sourceId: 'kumhoRebates',
  },
  {
    maker: 'Yokohama',
    summary: 'The rebates page HTML we fetched did not include a dated November or December 2026 offer, so none is listed.',
    sourceId: 'yokohamaRebates',
  },
  {
    maker: 'Hankook',
    summary: 'The promotions page HTML we fetched did not include a dated November or December 2026 offer, so none is listed.',
    sourceId: 'hankookPromos',
  },
];
