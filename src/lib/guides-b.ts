import { A, X, Z, SRC, table, nf, ex, per1k, records, gradeShare, BANDS, bandUrl, R, type Guide } from './guides';

export const GUIDES_B: Guide[] = [
  {
    slug: 'tire-cost-per-mile', kicker: 'Buying math', updated: R,
    title: 'How to Calculate Tire Cost Per Mile (With a Worked Example)', h1: 'How to calculate tire cost per mile',
    description: 'Cost per mile = what you pay for the set ÷ miles you actually get. A worked example with clearly made-up inputs, what to include, why warranty miles are an upper bound, and a calculator.',
    answer: 'Divide the total you pay for a set by the miles you expect to get from it. Use the out-the-door price, and be careful with the miles: a maker’s warranty is a ceiling the maker will stand behind, not a forecast. The example below uses made-up numbers to show the method.',
    body: `
<h2>The formula</h2>
<p><code>cost per mile = total installed price of the set ÷ miles until the tires are worn out</code>. Cost per 1,000 miles is easier to read, so we use that.</p>
<h2>What to put in</h2>
<ul>
<li><strong>Price:</strong> the out-the-door total for the set. Fees on a replacement can include taxes, shipping, mounting, balancing and disposal (the items Continental lists on a pro-rata replacement, ${X('contiWarranty', 'Continental Tire support')}).</li>
<li><strong>Miles:</strong> your own estimate. A warranty figure is the maker’s limited promise, settled pro rata and conditional on rotation records and an age limit (${A('/guides/treadwear-vs-warranty-mileage/', 'details')}); treat it as a ceiling. Treadwear grades can’t be converted into miles at all (${A('/guides/what-does-treadwear-rating-mean/', 'why')}).</li>
<li><strong>Wear-out point:</strong> tires are worn out at 2/32 inch (${A('/guides/when-to-replace-tires/', 'when to replace')}).</li>
</ul>
<h2>Worked example (made-up numbers)</h2>
<p class="note"><strong>Illustrative only.</strong> Every input below is invented to show the arithmetic. These are not real prices, not real warranties and not a recommendation of any tire.</p>
${table(['Made-up input', 'Tire A', 'Tire B'], [['Installed price for the set', `$${ex.aSet}`, `$${ex.bSet}`], ['Miles you expect', nf(ex.aMi), nf(ex.bMi)], ['Cost per 1,000 miles', `$${per1k(ex.aSet, ex.aMi)}`, `$${per1k(ex.bSet, ex.bMi)}`], ['Cost per mile', `$${(ex.aSet / ex.aMi).toFixed(4)}`, `$${(ex.bSet / ex.bMi).toFixed(4)}`], [`Years at a made-up ${nf(ex.annual)} miles a year`, (ex.aMi / ex.annual).toFixed(1), (ex.bMi / ex.annual).toFixed(1)]])}
<p>Here the cheaper set (B) costs more per mile, because it is assumed to last fewer miles. The result is only as good as the mileage input: if Tire A in fact wore out at ${nf(ex.bMi)} miles it would cost $${per1k(ex.aSet, ex.bMi)} per 1,000 miles, even more than B’s assumed figure. That is why the mileage estimate, not the price, is the hard part.</p>
<h2>Two cautions</h2>
<ul>
<li><strong>Age can end a tire before mileage does.</strong> At the made-up ${nf(ex.annual)} miles a year, tire A would take ${(ex.aMi / ex.annual).toFixed(0)} years to wear out. NHTSA notes some vehicle and tire manufacturers recommend replacing tires six to 10 years old regardless of tread (${X('nhtsa', 'NHTSA')}), and warranties can have their own age limits.</li>
<li><strong>Upkeep changes the miles.</strong> See ${A('/guides/how-to-make-tires-last-longer/', 'making tires last longer')}.</li>
</ul>
<h2>Try your own numbers</h2>
<p>The calculator below runs entirely in your browser and nothing is pre-filled. Size pages carry a per-row version: ${Z('225-65r17')}, ${Z('235-55r19')}.</p>
<!--CALC-->`,
    faqs: [
      { q: 'How do I calculate cost per mile for tires?', a: 'Divide the total installed price of the set by the miles you expect to get. For example (made-up numbers), an $800 set expected to last 60,000 miles costs about $13.33 per 1,000 miles.' },
      { q: 'Should I use the mileage warranty as my expected miles?', a: 'Use it as a ceiling, not a forecast. Warranties are limited, usually pro-rated and conditional, and actual mileage varies with driving habits, vehicle type and road conditions.' },
      { q: 'Does the cheapest tire have the lowest cost per mile?', a: 'Not necessarily. A cheaper set that wears out sooner can cost more per mile, as the made-up example shows; the answer depends on real prices and real mileage.' },
      { q: 'Does this site show tire prices?', a: 'Not yet. We have no licensed price feed, so we don’t display prices; the calculator uses only what you enter.' },
    ],
    sources: ['contiWarranty', 'nhtsa', 'tiaReplace'], sizes: ['225-65r17', '235-55r19'], lines: [], related: ['treadwear-vs-warranty-mileage', 'how-much-do-tires-cost', 'how-to-make-tires-last-longer'],
  },
  {
    slug: 'when-to-replace-tires', kicker: 'Safety', updated: R,
    title: 'When to Replace Tires: 2/32 Inch, the Penny Test and Tire Age', h1: 'When to replace your tires',
    description: 'Replace tires at 2/32 inch of tread, when wear bars are flush, on visible damage, and consider age. How to do the penny test and read the DOT date code, with NHTSA, TIA and USTMA sources.',
    answer: 'Replace tires when the tread is worn to 2/32 of an inch (wear bars level with the tread, or the top of the portrait visible in the penny test), when you see damage such as bulges or exposed cord, and ask a professional about tires that are six to 10 years old even if the tread looks fine.',
    body: `
<h2>1. Tread depth: 2/32 inch</h2>
<p>NHTSA: “Tires are not safe and should be replaced when the tread is worn down to 2/32 of an inch,” and it recommends checking tread at least monthly. Two checks (${X('nhtsa', 'NHTSA')}, ${X('tiaReplace', 'TIA')}, ${X('ustma', 'USTMA')}):</p>
<ul>
<li><strong>Wear bars:</strong> small raised rubber humps molded into the main grooves at 2/32 inch. When the tread is level with them, replace the tire.</li>
<li><strong>Penny test:</strong> place a penny upside down in a major groove with the portrait facing you. If you can see the top of the portrait, replace the tire (NHTSA). TIA says to check at any point in any major groove and then see a tire professional.</li>
</ul>
<p>Continental’s mileage warranty counts a tire as worn out at the same point, 2/32 inch (1.6 mm) (${X('contiWarranty', 'Continental')}); the ${A('/guides/tire-cost-per-mile/', 'cost-per-mile math')} uses the same endpoint.</p>
<h2>2. Damage and irregular wear</h2>
<p>Per TIA: if any steel or fabric is visible, replace the tire immediately; have a professional look at bulges, irregular wear or anything abnormal. NHTSA adds that you should stop using tires with cuts, cracks or bulges, or irregular wear from underinflation or overloading, and take note of changes in noise or vibration. Don’t use a full-size spare as a replacement for worn tires except in an emergency.</p>
<h2>3. Age</h2>
<p>“As tires age, they are more prone to failure. Some vehicle and tire manufacturers recommend replacing tires that are six to 10 years old, regardless of treadwear,” says NHTSA, which also says you cannot detect aging by looking. It is a greater concern for low-mileage vehicles, recreational vehicles and spares, and in the southern Sun Belt (${X('nhtsa', 'NHTSA')}). Some warranties set their own limit: Continental’s does not cover tires in service longer than 72 months (${X('contiWarranty', 'Continental')}).</p>
<h3>Find the tire’s date code</h3>
<p>On the sidewall, after “DOT”, the last four digits of the Tire Identification Number are the week and year. NHTSA’s example: 0308 = third week of 2008. The regulation’s example: 0109 = week beginning Sunday, Jan. 4, 2009 (${X('cfr574', '49 CFR 574.5')}). The TIN may be on only one side of the tire. More in ${A('/guides/how-to-read-a-tire-sidewall/', 'how to read a tire sidewall')}.</p>
<h2>4. Replacing fewer than four</h2>
<ul>
<li>TIA’s best practice is to replace all four at once; some all-wheel-drive and four-wheel-drive vehicles require it so the drivetrain isn’t damaged.</li>
<li>One new tire: mount it on the rear axle, paired with the tire with the most tread. Two: install the new ones on the rear, or the vehicle may be more likely to lose control when turning in wet or slippery conditions (TIA).</li>
<li>Match the size, load index and speed rating on the placard (${A('/guides/how-to-read-a-tire-sidewall/', 'sidewall guide')}).</li>
</ul>
<h2>Choosing replacements</h2>
<p>Compare candidates for your size on a size page, for example ${Z('225-65r17')}, ${Z('215-65r16')} or ${Z('265-70r17')}, and see ${A('/guides/how-to-find-longest-lasting-tires-for-your-size/', 'how to find long-lasting tires')}. Help the next set last with ${A('/guides/how-to-make-tires-last-longer/', 'rotation, pressure and alignment')}.</p>`,
    faqs: [
      { q: 'How do I do the penny test?', a: 'Put a penny upside down in a major tread groove with the portrait facing you. If you can see the top of the portrait, the tread is at or below 2/32 inch and the tire should be replaced (NHTSA).' },
      { q: 'How old is too old for tires?', a: 'NHTSA says some vehicle and tire manufacturers recommend replacing tires that are six to 10 years old regardless of treadwear, and that you can’t tell aging by looking. Check your owner’s manual and ask a tire professional.' },
      { q: 'How do I read the DOT date code?', a: 'The last four digits of the DOT Tire Identification Number are the week and year of manufacture: 0308 is the third week of 2008.' },
      { q: 'If I only replace two tires, where do they go?', a: 'On the rear axle, according to the Tire Industry Association, because new tires on the front with worn tires on the rear can make the vehicle more likely to lose control when turning in wet or slippery conditions.' },
    ],
    sources: ['nhtsa', 'tiaReplace', 'ustma', 'cfr574', 'contiWarranty'], sizes: ['225-65r17', '215-65r16', '265-70r17'], lines: [], related: ['how-to-read-a-tire-sidewall', 'how-to-make-tires-last-longer', 'tire-cost-per-mile'],
  },
  {
    slug: 'utqg-traction-and-temperature-grades', kicker: 'UTQG basics', updated: R,
    title: 'Tire Traction (AA, A, B, C) and Temperature (A, B, C) Grades Explained', h1: 'Tire traction and temperature grades explained',
    description: 'What AA/A/B/C traction and A/B/C temperature grades measure, the exact federal test thresholds, what they don’t cover, and how grades are distributed across NHTSA’s database.',
    answer: 'Traction grades (AA, A, B, C) rank a tire’s straight-ahead braking on wet asphalt and concrete skid pads; temperature grades (A, B, C) rank resistance to heat build-up on a lab test wheel. Neither measures cornering, dry grip, snow or ice, or treadwear.',
    body: `
<h2>Traction: AA, A, B, C</h2>
<p>NHTSA: traction grades indicate “a tire’s ability to stop on wet pavement,” from AA (highest) to C (${X('nhtsa', 'NHTSA')}). TIA describes it as stopping “in a straight line on wet pavement” (${X('tiaSidewall', 'TIA')}). The test (49 CFR 575.104(f)) uses wetted asphalt and concrete skid pads and a locked-wheel test trailer, and the grade depends on the adjusted traction coefficient on <em>both</em> surfaces (${X('cfr104')}):</p>
${table(['Grade', 'Asphalt coefficient', 'Concrete coefficient'], [['AA', 'more than 0.54', 'more than 0.38'], ['A', 'more than 0.47', 'more than 0.35'], ['B', 'more than 0.38', 'more than 0.26'], ['C', '0.38 or less', '0.26 or less']], 'To earn a grade the tire must meet both thresholds; C results from either at or below its limit. Source: 49 CFR 575.104(d)(2)(ii).')}
<p><strong>Not covered:</strong> the procedure is a wet, locked-wheel, straight-line stop, so the grade doesn’t test cornering, hydroplaning resistance, dry grip, or snow and ice. For winter performance see ${A('/guides/all-season-vs-all-weather-vs-winter-tires/', 'all-season vs. all-weather vs. winter')}.</p>
<h2>Temperature: A, B, C</h2>
<p>The temperature grade shows resistance to heat build-up (${X('nhtsa', 'NHTSA')}). In the test the tire runs against a 67.23-inch steel wheel at 95 °F ambient, loaded to 88% of its maximum load rating, stepping up speed in 30-minute stages (${X('cfr104', '575.104(g)')}):</p>
${table(['Grade', 'Rule', 'Roughly equal to*'], [['A', 'Completes the 575 rpm stage with no tread, sidewall, ply or bead separation, chunking or cracking, and pressure held', `${Math.round((575 * Math.PI * 67.23 * 60) / 63360)} mph`], ['B', 'Completes the 500 rpm stage but not the 575 rpm stage', `${Math.round((500 * Math.PI * 67.23 * 60) / 63360)} mph`], ['C', 'Fails the 500 rpm stage', 'below that']], '*Our arithmetic from the wheel diameter in the regulation (rpm × π × 67.23 in); the regulation specifies rpm, not mph.')}
<p>In real use USTMA warns that “under inflated tires generate excessive heat build-up and stress, causing irregular wear and internal damage” (${X('ustma', 'USTMA')}), so keeping correct pressure matters more than the letter. See ${A('/guides/how-to-make-tires-last-longer/', 'making tires last longer')}.</p>
<h2>How the grades are distributed</h2>
<p>NHTSA gives the split for “current tires”; we also computed it across all ${nf(records.length)} records in the NHTSA file (which includes older lines; not market share).</p>
${table(['Grade', 'NHTSA “current tires”', 'All records in file'], [['Traction AA', '15%', `${gradeShare('traction', 'AA')}%`], ['Traction A', '77%', `${gradeShare('traction', 'A')}%`], ['Traction B', '7%', `${gradeShare('traction', 'B')}%`], ['Traction C', 'only 4 lines', `${records.filter((r) => r.traction === 'C').length} records`], ['Temperature A', '62%', `${gradeShare('temperature', 'A')}%`], ['Temperature B', '34%', `${gradeShare('temperature', 'B')}%`], ['Temperature C', '4%', `${gradeShare('temperature', 'C')}%`]])}
<p>Most tires land at A or AA for traction, so the letter separates tires less than the treadwear number does. Compare grades within a size on pages such as ${Z('225-65r17')} and ${Z('235-55r19')}, or by treadwear band: ${BANDS.slice(3, 7).map((b) => A(bandUrl(b), b.label)).join(', ')}.</p>`,
    faqs: [
      { q: 'What does traction AA mean on a tire?', a: 'AA is the highest UTQG traction grade: more than 0.54 on the asphalt skid pad and more than 0.38 on the concrete pad in the federal wet locked-wheel braking test (49 CFR 575.104).' },
      { q: 'Does the UTQG traction grade tell me how a tire handles in snow?', a: 'No. It is a wet-pavement straight-line braking grade on asphalt and concrete. It does not test snow, ice, cornering or dry grip.' },
      { q: 'What does temperature grade A mean?', a: 'Grade A means the tire completed the 575 rpm stage of the federal heat test (about 115 mph on the 67.23-inch test wheel, by our arithmetic) without separation, chunking, cracking or pressure loss.' },
      { q: 'Are most tires graded A or AA for traction?', a: `Yes. NHTSA says 15% of current tires are AA and 77% are A. In the full NHTSA file we downloaded, ${gradeShare('traction', 'AA')}% of records are AA and ${gradeShare('traction', 'A')}% are A.` },
    ],
    sources: ['cfr104', 'nhtsa', 'tiaSidewall', 'ustma'], sizes: ['225-65r17', '235-55r19'], lines: [], related: ['what-does-treadwear-rating-mean', 'all-season-vs-all-weather-vs-winter-tires', 'how-to-make-tires-last-longer'],
  },
];
