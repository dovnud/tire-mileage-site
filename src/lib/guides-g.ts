// Exact-match buy-timing pages. Dates are the 2026 calendar plus maker windows already read into rebates-2026.ts.
// No sale price is added. Dollar amounts stay in words, matching the maker text stored in that file.
import { A, X, Z, Ln, type Guide } from './guides';
import { REBATE_OFFERS, OUTSIDE_OFFERS, type RebateOffer } from './rebates-2026';
import {
  BLACK_FRIDAY_SLUG, CYBER_MONDAY_SLUG, CHART_DATE, REBATE_DATE, REBATE_PATH, AFTER_REBATE_PATH, COMPARE_PATH, LOOKUP_PATH, LOAD_INDEX_PATH,
} from './paths';

const srcs = (o: RebateOffer) => [o.sourceId, ...(o.alsoSourceIds ?? [])];

function offerHtml(o: RebateOffer): string {
  const links = srcs(o).map((id) => X(id)).join('; ');
  return `<h3>${o.maker}: ${o.name}</h3>
<ul>
<li><strong>Purchase window on the page:</strong> ${o.purchase}</li>
<li><strong>Submission on the page:</strong> ${o.submission}</li>
<li><strong>What the page says you get:</strong> ${o.reward}</li>
<li><strong>Tires named:</strong> ${o.tires}</li>
${o.notes.map((n) => `<li>${n}</li>`).join('\n')}
</ul>
<p>Source: ${links}. Retrieved ${REBATE_DATE}.</p>`;
}

const outsideHtml = OUTSIDE_OFFERS.map((o) => `<li><strong>${o.maker}.</strong> ${o.summary} ${o.sourceIds.map((id) => X(id)).join('; ')}.</li>`).join('\n');

const offerIds = [...new Set([...REBATE_OFFERS.flatMap(srcs), ...OUTSIDE_OFFERS.flatMap((o) => o.sourceIds)])];

const sharedTail = `
<h2>Windows that do not include these days</h2>
<p>These maker pages were read on ${REBATE_DATE}. Their purchase dates end before November 2026. A purchase on November 27 or November 30 is outside them.</p>
<ul>
${outsideHtml}
</ul>
<h2>What to do with a quote</h2>
<p>This page does not store a tire price. Type the price you were quoted into ${A(COMPARE_PATH, 'compare two tires')} or, if you are subtracting a rebate you were quoted, ${A(AFTER_REBATE_PATH, 'cost per mile after a rebate')}. The calculators do not fill in a rebate amount. The full maker text, including offers not repeated as a story here, stays on ${A(REBATE_PATH, 'the rebate lookup')}. The lookup is not gated.</p>
<p>Match the size, load index, and speed rating on the placard before you buy. Load-index cells checked from Michelin’s chart are on ${A(LOAD_INDEX_PATH, 'the load index pages')}. A common size that the 10-line cutoff does not publish on its own is ${Z('265-65r18')}. A line the explicit-size cutoff does not publish on its own is ${Ln('michelin/crossclimate2')}.</p>
<p>Every exact-match page in this wave is listed on ${A(LOOKUP_PATH, 'exact tire lookups')}.</p>`;

export const GUIDES_G: Guide[] = [
  {
    slug: BLACK_FRIDAY_SLUG,
    kicker: 'Buy timing',
    updated: CHART_DATE,
    title: 'Black Friday 2026 Tire Rebate Dates',
    h1: 'Black Friday 2026 tire rebate dates',
    description: 'Friday, November 27, 2026 is Black Friday. Maker purchase windows that include that day are quoted here. No sale price is added.',
    answer: 'Black Friday 2026 is Friday, November 27. Thanksgiving is the fourth Thursday in November, and in 2026 that Thursday is November 26. The maker purchase windows read on November 4 run through November 30, so November 27 falls inside them. Those pages do not call the window Black Friday, and this page does not add a sale price.',
    body: `
<h2>The date</h2>
<p>November 26, 2026 is a Thursday, and it is the fourth Thursday of November. The Friday after it is November 27, 2026. The Monday after that Friday is November 30, which has its own page: ${A(`/guides/${CYBER_MONDAY_SLUG}/`, 'Cyber Monday 2026 tire rebate dates')}. November 27 is inside a purchase window that ends November 30. It is not the last day of those windows.</p>
<h2>Maker windows that include November 27, 2026</h2>
<p>Each block is the maker’s own page, read ${REBATE_DATE}. The amount is the maker’s words. Nothing here is a store’s Black Friday price, because no maker page we read printed one.</p>
${REBATE_OFFERS.map(offerHtml).join('\n')}
${sharedTail}`,
    faqs: [
      { q: 'When is Black Friday 2026?', a: 'Friday, November 27, 2026. November 26, 2026 is the fourth Thursday in November.' },
      { q: 'Do tire makers call November 27 a Black Friday sale?', a: 'The Michelin, BFGoodrich, Goodyear, Cooper, and Pirelli pages read on November 4, 2026 do not use the words Black Friday. Their purchase windows run through November 30, 2026, so November 27 falls inside the window. That is not a sale price.' },
      { q: 'Does this page list a Black Friday tire price?', a: 'No. Prices are not stored. A quote you already have can be typed into the cost-per-mile tools. Rebate amounts are not filled in.' },
      { q: 'Which earlier offers do not cover November 27?', a: 'Continental’s dated page is July 1 through August 31, 2026. Bridgestone and Firestone list October 1 through October 31, 2026. General Tire’s purchase window ends October 31, 2026. Those purchase dates do not include November 27.' },
    ],
    sources: offerIds,
    sizes: ['265-65r18', '225-65r17'],
    lines: ['michelin/crossclimate2', 'goodyear/assurance-weatherready-2'],
    related: [CYBER_MONDAY_SLUG, 'holiday-2026-tire-gifts', 'load-index-and-speed-rating', 'tire-cost-per-mile'],
  },
  {
    slug: CYBER_MONDAY_SLUG,
    kicker: 'Buy timing',
    updated: CHART_DATE,
    title: 'Cyber Monday 2026 Tire Rebate Dates',
    h1: 'Cyber Monday 2026 tire rebate dates',
    description: 'Monday, November 30, 2026 is Cyber Monday, the last day of several maker purchase windows. General Tire’s November 30 date is a claim deadline. No sale price.',
    answer: 'Cyber Monday 2026 is Monday, November 30. It is the last day of the Michelin, BFGoodrich, Goodyear, Cooper, and Pirelli purchase windows read on November 4. Those pages do not call the day Cyber Monday. General Tire’s November 30 date is a submission deadline for a purchase window that ended October 31, not a day to buy. This page does not add a sale price.',
    body: `
<h2>The date</h2>
<p>November 30, 2026 is a Monday. The Friday before it is November 27, 2026, which is ${A(`/guides/${BLACK_FRIDAY_SLUG}/`, 'Black Friday 2026')}. For the maker windows below, November 30 is the last day of the purchase window, not a separate discount.</p>
<h2>Maker windows that include November 30, 2026</h2>
<p>Each block is the maker’s own page, read ${REBATE_DATE}. The amount is the maker’s words. A purchase on November 30 is inside these windows. It is not a price.</p>
${REBATE_OFFERS.map(offerHtml).join('\n')}
<h2>November 30 dates that are not a purchase day</h2>
<p>General Tire’s page says the form must be submitted online or postmarked by November 30, 2026, for purchases between September 1 and October 31, 2026. The November 30 date is a deadline to submit a claim for an earlier purchase. A tire bought on November 30 is outside that purchase window. Bridgestone and Firestone say to submit by November 10, 2026, for an October purchase, so November 30 is after their claim deadline too.</p>
${sharedTail}`,
    faqs: [
      { q: 'When is Cyber Monday 2026?', a: 'Monday, November 30, 2026, the Monday after Friday, November 27.' },
      { q: 'Is November 30 the last day to buy under the maker windows?', a: 'For the Michelin, BFGoodrich, Goodyear, Cooper, and Pirelli pages read on November 4, 2026, the purchase window ends November 30, 2026. Those pages do not call that day Cyber Monday.' },
      { q: 'Why does General Tire mention November 30 if the purchase window ended in October?', a: 'General’s page says purchases run from September 1 through October 31, 2026, and the form must be submitted or postmarked by November 30, 2026. November 30 is the claim deadline, not a purchase day.' },
      { q: 'Does this page list a Cyber Monday tire price?', a: 'No. No maker page we read printed a Cyber Monday price. Type a quote you already have into the cost-per-mile tools. Rebate amounts are not filled in.' },
    ],
    sources: offerIds,
    sizes: ['265-65r18', '245-50r20'],
    lines: ['goodyear/assurance-maxlife-2', 'continental/extremecontact-dws06-plus'],
    related: [BLACK_FRIDAY_SLUG, 'holiday-2026-tire-gifts', 'load-index-and-speed-rating', 'tire-cost-per-mile'],
  },
];
