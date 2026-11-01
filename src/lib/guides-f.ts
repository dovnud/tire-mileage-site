import { A, X, Z, Ln, type Guide } from './guides';
import { HOLIDAY_SLUG, PAGE_DATE, COMPARE_PATH, REPLACE_PATH } from './paths';
import { buildFreeQueryUrl, LINK_REL, AMAZON_DISCLOSURE } from './retailers';

const amz = (query: string) => `<div class="shop-btns"><a class="sbtn sbtn-amz" href="${buildFreeQueryUrl('amazon', query)}" target="_blank" rel="${LINK_REL}">Search on Amazon<span aria-hidden="true"> ↗</span><span class="sr"> (opens in a new tab)</span></a></div>`;

const card = (title: string, body: string, query: string) => `<div class="card"><h3>${title}</h3>${body}${amz(query)}<p class="meta">The button opens an Amazon search. It is not a product page, a price, a rating, or a stock check.</p></div>`;

export const GUIDES_F: Guide[] = [
  {
    slug: HOLIDAY_SLUG,
    kicker: 'Seasonal',
    updated: PAGE_DATE,
    title: 'Holiday 2026: Winter Tire and Gear Gift Guide',
    h1: 'Holiday 2026 winter tire and gear gift guide',
    description: 'Holiday 2026 guide to winter tires and tire gear. Amazon searches use this site’s tag. Rebate dates appear only where Michelin’s own pages publish them.',
    answer: 'Michelin’s Fall-North and Fall-South pages publish an 80-dollar reward on four Michelin tires bought from September 3 through November 30, 2026. Those pages do not call the window Black Friday, so this guide does not state a Black Friday date. The gear below is Amazon search links for a tread gauge, a pressure gauge, an inflator and valve caps. No prices are shown.',
    body: `
<h2>Rebate dates published for 2026</h2>
<p>Read on ${PAGE_DATE}. A date is included only when the maker’s own page states it. No other Black Friday or shipping-cutoff date is listed, because no primary page we read published one for 2026.</p>
<h3>Michelin Fall-North and Fall-South</h3>
<p>Michelin publishes two promotion pages with the same purchase window and the same reward (${X('michelinFallNorth', 'Fall-North')}, ${X('michelinFallSouth', 'Fall-South')}):</p>
<ul>
<li>80 dollars as a Visa reward card or a Visa virtual account, one reward per purchase of four new Michelin passenger or light truck tires, including the Agilis family.</li>
<li>Purchase completed between September 3, 2026 and November 30, 2026. Requests must be received by December 31, 2026.</li>
<li>Participating dealers in the 50 states, the District of Columbia, Puerto Rico, Guam and the U.S. Virgin Islands. The buyer must be a U.S. resident and at least 18.</li>
<li>Purchases from warehouse clubs (Sam’s Club, BJ’s, Costco), mass merchandisers, and national retailers including Discount Tire and Big O are excluded from this manufacturer offer. Michelin says those stores may have their own offer.</li>
<li>The offer is not stackable with another Michelin manufacturer offer. Buy-three-get-one style deals and similar combinations are excluded. Limit of three redemptions per household.</li>
<li>Michelin says it may modify or discontinue the offer. The pages do not use the words Black Friday.</li>
</ul>
<p>The two pages name different promotions (Fall-North and Fall-South) and tell you which name to use if you call. The text we read does not list which states are in which promotion, so this guide does not guess a state map.</p>
<h3>Continental’s offers page</h3>
<p>Continental’s offers page, read the same day, says a set of four qualifying Continental tires comes with a 110-dollar prepaid Mastercard, plus 90 dollars more when the purchase is made with a Continental Tire credit card (${X('contiOffers', 'Continental Tire Offers')}). That page did not state a start date, an end date, or a Black Friday date in the text we read, so none is repeated here. Open the page before you treat the offer as open.</p>
<h2>Winter tires</h2>
<p>Dedicated winter tires are for snow, ice and cold. Federal UTQG grading does not apply to deep-tread, winter-type snow tires (${X('cfr104', '49 CFR 575.104')}), which is why this site does not rank them by treadwear. The season definitions are in ${A('/guides/all-season-vs-all-weather-vs-winter-tires/', 'all-season vs. all-weather vs. winter')}. USTMA’s care guide says the same exclusion and says dedicated winter/snow tires are designed for adverse winter driving (${X('ustmaGuide', 'USTMA')}).</p>
<p>Michelin’s winter-life page says the Michelin X-Ice Snow+ has a 60,000-mile limited treadwear warranty, and that winter tires should come off the car when winter ends because the compound wears faster in warm weather (${X('michelinWinter', 'Michelin')}). That mileage figure is Michelin’s warranty statement for that tire, not a price and not a promise of how many miles you will get.</p>
<div class="grid g2">
${card('Winter / snow tires', '<p>Search Amazon for winter snow tires. Confirm the size on your door placard and the three-peak mountain snowflake mark on the tire you buy.</p>', 'winter snow tires')}
${card('Michelin X-Ice Snow', '<p>Search for the winter tire Michelin names on its winter-life page. The page states a 60,000-mile limited treadwear warranty for the X-Ice Snow+.</p>', 'Michelin X-Ice Snow+')}
</div>
<h2>Gear that matches a published check</h2>
<p>Each card is a search, using this site’s existing Amazon Associates tag. ${AMAZON_DISCLOSURE} Nothing below is a rating, a shipping date, or a claim that a seller has stock.</p>
<div class="grid g2">
${card('Tread depth gauge', `<p>Michelin says a tread depth gauge is the precise way to read depth, and that wear indicators show the legal wear point (${X('michelinTread', 'Michelin')}). Use it with the thresholds on ${A(REPLACE_PATH, 'when to replace your tires')}.</p>`, 'tire tread depth gauge')}
${card('Tire pressure gauge', `<p>USTMA says you cannot tell radial-tire pressure by looking, that you must use a gauge, and that drivers should keep their own gauge in the vehicle. A gauge marked in 1 psi steps up to 60 psi is enough for most passenger tires (${X('ustmaGuide', 'USTMA')}). NHTSA says to check every tire, including the spare, at least monthly when the tires are cold, and that the pressure warning light is not a substitute (${X('nhtsa', 'NHTSA')}).</p>`, 'tire pressure gauge')}
${card('Portable tire inflator', `<p>USTMA says passenger and light-truck tires may lose 1 to 2 psi per month and 1 to 2 psi for every 10 °F drop, so a way to add air belongs with the gauge. USTMA also says inflating a tire that is not secured is dangerous: never inflate a tire unless it is secured to a vehicle, a tire machine, or another restraining device.</p>`, 'portable tire inflator')}
${card('Valve stem caps', `<p>Michelin’s FAQ says the caps keep moisture and dirt out of the valve and should be on every tire, and that a new valve stem should be installed when a tire is replaced (${X('michelinFaq', 'Michelin')}).</p>`, 'tire valve stem caps')}
</div>
<h2>What to do with the tires you already have</h2>
<ul>
<li>Compare two sets you have quotes for, with prices you type yourself: ${A(COMPARE_PATH, 'compare two tires, cost per mile')}.</li>
<li>Read the 2/32-inch, 4/32-inch and age thresholds: ${A(REPLACE_PATH, 'when to replace your tires')}.</li>
<li>Store a rotation or replacement reminder on a tire line page. The form saves the request and does not send a message. Example: ${Ln('michelin/defender-2')} (the form is under the calculator). The same form is on size pages such as ${Z('225-65r17')}.</li>
<li>Pressure, rotation and alignment: ${A('/guides/how-to-make-tires-last-longer/', 'how to make tires last longer')}.</li>
</ul>`,
    faqs: [
      { q: 'Does this page list a Black Friday 2026 tire sale date?', a: 'No. Michelin’s Fall-North and Fall-South pages publish a purchase window of September 3 through November 30, 2026, and they do not call that window Black Friday. Continental’s offers page, read October 31, 2026, did not state a start date, an end date, or a Black Friday date. No shipping cutoff is listed because no primary source we read published one for 2026.' },
      { q: 'What does Michelin’s 2026 fall promotion require?', a: 'Michelin’s Fall-North and Fall-South pages say 80 dollars on four new Michelin passenger or light truck tires bought from a participating dealer between September 3 and November 30, 2026, with the request received by December 31, 2026. Warehouse clubs and national retailers, including Discount Tire, are excluded from this manufacturer offer. Michelin says it may modify or discontinue the offer.' },
      { q: 'What do the Amazon buttons on this page open?', a: 'Each button opens an Amazon search for that kind of product: winter tires, a tread depth gauge, a tire pressure gauge, a portable tire inflator, or valve stem caps. The page does not show a price, a star rating, or whether an item is in stock. The links use this site’s Amazon Associates tag.' },
      { q: 'Why is there no treadwear ranking of winter tires?', a: 'Federal UTQG rules do not apply to deep-tread, winter-type snow tires, so a treadwear grade is not a way to rank them. USTMA’s care guide notes the same exclusion. Use the season guide on this site, then a retailer search for the size on your placard.' },
    ],
    sources: ['michelinFallNorth', 'michelinFallSouth', 'contiOffers', 'michelinWinter', 'michelinTread', 'michelinFaq', 'ustmaGuide', 'nhtsa', 'cfr104'],
    sizes: ['225-65r17'],
    lines: [],
    related: ['all-season-vs-all-weather-vs-winter-tires', 'when-to-replace-tires', 'tire-cost-per-mile', 'how-to-make-tires-last-longer'],
  },
];
