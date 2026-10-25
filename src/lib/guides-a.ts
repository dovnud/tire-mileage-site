import { A, X, Z, Ln, SRC, table, nf, nRec, notMult20, myDist, nhtsaDist, nRatedLines, lines600, mtRows, mtLo, mtHi, cwRows, rg, R, S, fmt, BANDS, bandUrl, rimUrl, share, type Guide } from './guides';

export const GUIDES_A: Guide[] = [
  {
    slug: 'what-does-treadwear-rating-mean', kicker: 'UTQG basics', updated: R,
    title: 'What Does a Tire Treadwear Rating Mean? UTQG Explained', h1: 'What does a tire treadwear rating mean?',
    description: `A treadwear grade is a relative wear-rate index set against a government control tire, not a mileage figure. How UTQG is tested, what 600 means, and ${nf(nRatedLines)} NHTSA-rated lines compared.`,
    answer: 'A treadwear grade is a relative wear-rate number. The government control tire is graded 100, so a tire graded 200 should wear about twice as long as the control tire on the government test course. It is not a mileage figure, and the tire industry itself says it can’t be used to compare tread life between brands.',
    body: `
<h2>How the number is produced</h2>
<p>Treadwear is one of three Uniform Tire Quality Grading (UTQG) grades required by federal regulation, alongside ${A('/guides/utqg-traction-and-temperature-grades/', 'traction and temperature')}. Each tire is graded “as a percentage of the NHTSA nominal treadwear value” and the grades “shall be expressed in multiples of 20 (for example, 80, 120, 160)” (${X('cfr104', '49 CFR 575.104(d)')}).</p>
<p>The testing is done on a specific roadway course about 400 miles long, run in convoys; the candidate tire’s projected mileage is corrected using course-monitoring tires driven in the same convoy (${X('cfr104', '49 CFR 575.104(e)')}). The regulation does not apply to deep-tread winter-type snow tires, space-saver spares or tires with rim diameters of 12 inches or less (${X('cfr104', '575.104(c)')}).</p>
<p>NHTSA’s summary: “A control tire is assigned a grade of 100. Other tires are compared to the control tire. For example, a tire grade of 200 should wear twice as long as the control tire” (${X('nhtsa', 'NHTSA TireWise')}).</p>

<h2>What it does not tell you</h2>
<ul>
<li><strong>It is not miles.</strong> The Tire Industry Association describes treadwear as a comparative figure that is “not a direct indicator of actual tread mileage” because of driving style, road conditions and maintenance (${X('tiaReplace', 'TIA, Tire Replacement')}). It also says treadwear is “comparable only to other tires within a tire manufacturer’s line” and cannot “be accurately used to compare the projected tread life of one brand against another” (${X('tiaSidewall', 'TIA, Reading a Tire Sidewall')}).</li>
<li><strong>Same grade range, very different results.</strong> In Michelin’s own published test, four tires with UTQG grades between ${Math.min(...mtRows.map((r) => r.min))} and ${Math.max(...mtRows.map((r) => r.max))} had estimated lives from ${nf(Math.min(...mtRows.map((r) => r.mi)))} to ${nf(Math.max(...mtRows.map((r) => r.mi)))} miles. That is one maker’s test, so treat it as an illustration, not a ruling; details in ${A('/guides/treadwear-vs-warranty-mileage/', 'Treadwear vs. warranty mileage')}.</li>
<li><strong>It says nothing about grip.</strong> Traction and temperature are separate grades.</li>
</ul>

<h2>What values are typical?</h2>
<p>NHTSA publishes the split for “current tires”; next to it is the split across every record in the NHTSA database we downloaded (${nf(nRec)} records with a treadwear grade, pulled ${S.pulled_at.slice(0, 10)}). They differ noticeably. Our file carries no “currently sold” flag, so it also includes older and discontinued lines; don’t read it as market share.</p>
${table(['Treadwear grade', 'NHTSA “current tires”', 'All records in the NHTSA file (our count)'], myDist.map(([b, n], i) => [b, nhtsaDist[i], `${share(n, nRec)}% (${nf(n)})`]), `Sources: NHTSA TireWise page for the first column; counts computed from the NHTSA ratings API for the second.`)}
<p>Across ${nf(nRatedLines)} rated lines the median line grade is ${fmt(S.treadwear_overall_median)}; ${lines600} lines (${share(lines600, nRatedLines)}%) have a median at 600 or above. Browse them by band: ${BANDS.map((b) => A(bandUrl(b), b.label)).join(' · ')}.</p>
<p class="note"><strong>A data quirk:</strong> although the rule requires multiples of 20, ${notMult20} of ${nf(nRec)} records in NHTSA’s file (${share(notMult20, nRec)}%) carry grades that aren’t (for example 30, 130 or 601). We show them as filed.</p>

<h2>How to use it</h2>
<ol>
<li>Compare lines from the same maker, where the grade is most meaningful.</li>
<li>Across makers, use treadwear to shortlist, then look at each maker’s ${A('/guides/treadwear-vs-warranty-mileage/', 'mileage warranty')}.</li>
<li>Never trade away the size, load index or speed rating your vehicle specifies; see ${A('/guides/how-to-read-a-tire-sidewall/', 'how to read a sidewall')}.</li>
<li>Look up your size to see every graded line side by side: ${Z('225-65r17')}, ${Z('235-55r19')}, ${Z('215-65r16')}.</li>
</ol>`,
    faqs: [
      { q: 'Is a treadwear rating of 600 good?', a: `It is a high grade. In the NHTSA file, ${share(lines600, nRatedLines)}% of rated lines have a median treadwear of 600 or more, and NHTSA says only about 2% of current tires are rated above 600. High means slow wear relative to the control tire on the government course, not a specific mileage.` },
      { q: 'Does a higher treadwear number mean the tires last longer?', a: 'Within one maker’s lineup, generally yes: a higher grade means a slower wear rate against the control tire. Across makers it is a poor predictor, because the Tire Industry Association says treadwear cannot be accurately used to compare tread life between brands.' },
      { q: 'What is the treadwear grade of the control tire?', a: 'The government control tire is assigned a grade of 100, and other tires are graded relative to it (NHTSA TireWise).' },
      { q: 'Who assigns UTQG treadwear grades?', a: 'The regulation requires tire and vehicle manufacturers and brand name owners to provide the grading information (49 CFR 575.104(a)); each grade is based on testing under the conditions in the regulation.' },
    ],
    sources: ['cfr104', 'nhtsa', 'tiaReplace', 'tiaSidewall', 'michelinTest'], sizes: ['225-65r17', '235-55r19', '215-65r16'], lines: ['michelin/defender-2', 'continental/truecontact-tour'], related: ['treadwear-vs-warranty-mileage', 'utqg-traction-and-temperature-grades', 'how-to-find-longest-lasting-tires-for-your-size'],
  },
  {
    slug: 'treadwear-vs-warranty-mileage', kicker: 'Treadwear vs. mileage', updated: R,
    title: 'Treadwear Rating vs. Mileage Warranty: Which Predicts Tire Life?', h1: 'Treadwear rating vs. mileage warranty',
    description: 'UTQG treadwear and a maker’s mileage warranty are different things and don’t convert into each other. Maker-published warranty tables matched against NHTSA grades, plus how pro-rata claims work.',
    answer: 'Neither is a prediction of how long your tires will last. Treadwear is a relative wear-rate grade from a government test course; a mileage warranty is a maker’s limited promise with conditions, usually settled pro rata. They don’t convert into each other: the matched lines below show warranty miles per treadwear point varying widely.',
    body: `
<h2>Two different promises</h2>
<ul>
<li><strong>Treadwear (UTQG)</strong> compares a tire’s wear rate with a control tire on a government course (${A('/guides/what-does-treadwear-rating-mean/', 'explained here')}).</li>
<li><strong>Mileage warranty</strong> is the maker’s commitment against “wearout”. Continental defines wearout as tread “worn evenly down to the tread wear indicators (2/32 in. or 1.6 mm remaining)” and adds that “actual mileage may vary based on driving habits, vehicle type, and road conditions” (${X('contiWarranty', 'Continental Tire support')}).</li>
</ul>

<h2>What a warranty claim involves (one maker’s published terms)</h2>
<p>These are Continental’s terms from its support article; other makers differ, so read your own paperwork.</p>
<ul>
<li><strong>Pro rata, not free replacement:</strong> “Pro-rata means the replacement cost is calculated based on the percentage of mileage actually received compared to the warranty mileage.” Continental’s own example: 45,000 miles received on a 60,000-mile warranty is 75%, so you pay 75% of the replacement tire price, plus taxes, shipping, mounting, balancing and disposal or service fees.</li>
<li><strong>Proof:</strong> the original receipt, a completed rotation schedule, and tires worn to 2/32 inch.</li>
<li><strong>Conditions:</strong> rotation every 6,000–8,000 miles; staggered fitments that can’t be rotated get 50% of the standard mileage on the rear axle; tires in service longer than 72 months are not covered; original-equipment tires are excluded.</li>
</ul>
<p>So a warranty’s headline miles are an upper bound on what the maker will stand behind, not an estimate of what you’ll get. See how to turn it into a number in ${A('/guides/tire-cost-per-mile/', 'the cost-per-mile guide')}.</p>

<h2>Matching warranty to treadwear: the numbers don’t line up</h2>
<p>Continental publishes warranty miles by speed rating on one page, and NHTSA publishes treadwear grades by line. We matched the line names by hand; NHTSA’s grade is a line-level range (it varies by size), and Continental’s warranty varies by speed rating, so both are shown as ranges.</p>
${table(['Line', 'NHTSA treadwear', 'Continental warranty (miles)'], cwRows.map((r) => [Ln(r.k, r.nm), rg(r.min, r.max, String), rg(r.lo, r.hi)]), `Sources: NHTSA ratings API (pulled ${S.pulled_at.slice(0, 10)}); Continental Tire “Mileage Warranty” support article, read ${R}. Only lines whose names match in both sources are listed. Original-equipment tires are excluded from Continental’s warranty.`)}
<p>Two things stand out. Within a single line the warranty swings with the speed rating: ${cwRows.filter((r) => r.hi - r.lo >= 30000).map((r) => `${r.nm} (${rg(r.lo, r.hi)} miles)`).join(', ')} each sit on a single NHTSA treadwear range. And across lines, the ratio of top warranty to the line’s top treadwear grade isn’t constant: ${(() => { const v = cwRows.map((r) => ({ nm: r.nm, x: r.hi / r.max })); const lo = v.reduce((a, b) => (a.x < b.x ? a : b)); const hi = v.reduce((a, b) => (a.x > b.x ? a : b)); return `from about ${Math.round(lo.x)} miles per treadwear point (${lo.nm}) to about ${Math.round(hi.x)} (${hi.nm})`; })()}. That is one maker’s lineup, not a market-wide formula.</p>

<h2>A maker-run test shows the same gap</h2>
<p>In a 2022 press release Michelin reported a treadwear test of size 225/65R17 tires on 2021 Toyota RAV4s, with an “estimated life (based on calculating the most-worn groove of a rotated set)”. This is Michelin’s own test of its own product, and it says “actual on-road results may vary” (${X('michelinTest', 'Michelin North America')}). Against the NHTSA grade for each line:</p>
${table(['Tire (225/65R17)', 'Michelin-reported estimated life (miles)', 'NHTSA treadwear', 'Miles per treadwear point*'], mtRows.map((r) => [Ln(r.k, r.nm), nf(r.mi), rg(r.min, r.max, String), `~${Math.round(r.perPt)}`]), `*Estimated life ÷ the line’s median NHTSA grade (${mtRows.map((r) => `${r.nm.split(' ').slice(-1)[0]} ${r.med}`).join(', ')}). Our arithmetic. All four lines carry NHTSA grades between ${Math.min(...mtRows.map((r) => r.min))} and ${Math.max(...mtRows.map((r) => r.max))}; the reported lives span about ${mtLo.toFixed(0)}–${mtHi.toFixed(0)} miles per point.`)}

<h2>How to use both</h2>
<ol>
<li>Use treadwear to compare within a maker, and the warranty to compare across makers, remembering the conditions above.</li>
<li>Check the warranty by speed rating for your exact size, not the headline number.</li>
<li>Keep receipts and rotation records from day one.</li>
<li>For a per-dollar view, see ${A('/guides/tire-cost-per-mile/', 'how to calculate tire cost per mile')}. Maker warranty facts we’ve read are on line pages such as ${Ln('michelin/defender-2')} and ${Ln('continental/procontact-tx')}.</li>
</ol>`,
    faqs: [
      { q: 'Is a tire’s mileage warranty the same as how long it will last?', a: 'No. It is a limited, usually pro-rated promise with conditions (receipts, rotation records, wear to 2/32 inch, an age limit), and actual mileage varies with driving habits, vehicle and roads.' },
      { q: 'How does a pro-rated tire warranty work?', a: 'Using Continental’s published example: a tire that wore out at 45,000 miles on a 60,000-mile warranty received 75% of the warranty mileage, so the owner pays 75% of the replacement tire’s price plus taxes, mounting, balancing and other fees.' },
      { q: 'Can I convert a treadwear grade into miles?', a: 'No. NHTSA data and maker warranty tables show no fixed relationship, and the Tire Industry Association says treadwear is not a direct indicator of mileage.' },
      { q: 'Do all makers have the same warranty conditions?', a: 'No. Continental’s conditions (rotation every 6,000–8,000 miles, 72-month limit, original-equipment exclusion) are one maker’s terms; check the warranty booklet for your tire.' },
    ],
    sources: ['cfr104', 'contiWarranty', 'michelinTest', 'tiaReplace', 'nhtsa'], sizes: ['225-65r17'], lines: ['michelin/defender-2', 'continental/procontact-tx', 'continental/truecontact-tour'], related: ['what-does-treadwear-rating-mean', 'tire-cost-per-mile', 'how-to-make-tires-last-longer'],
  },
  {
    slug: 'how-to-read-a-tire-sidewall', kicker: 'Tire sizes', updated: R,
    title: 'How to Read a Tire Sidewall: Size, Load Index, Speed Rating and DOT Code', h1: 'How to read a tire sidewall',
    description: 'Decode a tire size like P225/60R16 97V, the load index and speed rating, the UTQG grades and the DOT date code, using Tire Industry Association, Michelin and federal sources.',
    answer: 'In P225/60R16 97V: P = passenger tire, 225 = section width in millimeters, 60 = sidewall height as a percent of width, R = radial, 16 = wheel diameter in inches, 97 = load index and V = speed symbol. Always match what your vehicle’s door-jamb placard or owner’s manual specifies.',
    body: `
<h2>The size code, piece by piece</h2>
<p>Using the Tire Industry Association’s example <strong>P225/60R16 97V</strong> (${X('tiaSidewall', 'TIA')}):</p>
${table(['Part', 'Meaning', 'In this example'], [['P', 'Tire type: P = passenger (P-metric), LT = light truck, ST = special trailer, T = temporary. No letter means Euro-metric, which can have different load capacities.', 'Passenger'], ['225', 'Approximate section width, sidewall to sidewall, in millimeters', '225 mm'], ['60', 'Aspect ratio: sidewall height as a percentage of the width', `60% of 225 mm ≈ ${Math.round(225 * 0.6)} mm (TIA: approximately 135 mm)`], ['R', 'Radial construction (B, X or – would mean bias-ply)', 'Radial'], ['16', 'Rim (bead) diameter in inches', 'Fits a 16-inch wheel'], ['97V', 'Service description: load index + speed symbol', 'Load index 97, speed V']], 'Source: Tire Industry Association, Reading a Tire Sidewall.')}
<p>Our tables use the size without the “P”, such as ${Z('225-65r17')} or ${Z('235-55r19')}; each rim diameter has its own hub: ${[16, 17, 18].map((r) => A(rimUrl(r), `${r}-inch`)).join(', ')}.</p>

<h2>Load index and speed rating</h2>
<ul>
<li><strong>Load index</strong> is a code for the maximum weight one tire can carry when properly inflated. Michelin says a replacement’s load rating “must always meet or exceed the value specified by the vehicle manufacturer”; a higher load index is allowed but does not raise the vehicle’s own load limit. TIA adds: never install a lower load index than the original (${X('michelinRatings', 'Michelin')}, ${X('tiaReplace', 'TIA')}).</li>
<li><strong>Speed symbol:</strong> Michelin lists H = 130 mph, V = 149 mph, W = 168 mph and Y = 186 mph as the maximum speed under proper inflation and load. TIA notes the symbol is “more like a performance rating” that reflects handling once installed.</li>
<li><strong>XL (Extra Load)</strong> tires have reinforced construction to carry more load at higher inflation than standard-load tires of the same size (Michelin).</li>
<li>Where the correct size and ratings come from: the Tire and Loading Information Label on the driver’s door edge or post, or the owner’s manual (${X('nhtsa', 'NHTSA')}).</li>
</ul>

<h2>The UTQG block</h2>
<p>Most passenger tires also carry the three UTQG grades: <em>TREADWEAR</em> (a number), <em>TRACTION</em> (AA, A, B or C) and <em>TEMPERATURE</em> (A, B or C), as required by 49 CFR 575.104 (${X('cfr104')}). They are explained in ${A('/guides/what-does-treadwear-rating-mean/', 'treadwear')} and ${A('/guides/utqg-traction-and-temperature-grades/', 'traction and temperature')}.</p>

<h2>The DOT code and date of manufacture</h2>
<p>The letters “DOT” indicate the tire conforms to an applicable federal safety standard, and the Tire Identification Number (TIN) follows. Under 49 CFR 574.5 the TIN has 13 symbols for new tires: a three-symbol plant code, a six-symbol manufacturer’s code and a four-digit date code (${X('cfr574', '49 CFR 574.5')}). The last four digits give the week and year. The regulation’s example is <strong>0109</strong> = “the first full calendar week of 2009”, the week beginning Sunday, January 4, 2009. NHTSA’s example: 0308 is the third week of 2008. The TIN might be on only one sidewall, so check both sides (${X('nhtsa', 'NHTSA')}). Why age matters is covered in ${A('/guides/when-to-replace-tires/', 'when to replace tires')}.</p>`,
    faqs: [
      { q: 'What does 225/65R17 mean on a tire?', a: 'The tire is about 225 mm wide, its sidewall height is 65% of that width, it has radial construction, and it fits a 17-inch wheel. A load index and speed symbol usually follow.' },
      { q: 'Can I use a tire with a higher load index?', a: 'Michelin says a higher load rating is permitted but does not increase the vehicle’s maximum allowable load; never go lower than the vehicle manufacturer’s specification.' },
      { q: 'How do I find the date a tire was made?', a: 'Find the DOT Tire Identification Number on the sidewall; its last four digits are week and year. For 0109 that is the first full week of 2009. The number may be on only one side of the tire.' },
      { q: 'Where do I find the right tire size for my car?', a: 'On the Tire and Loading Information Label on the driver’s door edge or post, or in the owner’s manual (NHTSA). The tire dealer can help if you’re unsure.' },
    ],
    sources: ['tiaSidewall', 'michelinRatings', 'cfr574', 'cfr104', 'nhtsa', 'tiaReplace'], sizes: ['225-65r17', '235-55r19', '215-65r16'], lines: [], related: ['when-to-replace-tires', 'what-does-treadwear-rating-mean', 'how-much-do-tires-cost'],
  },
];
