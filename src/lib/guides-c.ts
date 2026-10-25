import { A, X, Z, Ln, SRC, table, nf, fmt, mtRows, exRows, exTop, exMed, SIZE_EX, rgn, ratedLines, nRatedLines, TYPES, typeUrl, rimUrl, BANDS, bandUrl, S, R, type Guide } from './guides';

export const GUIDES_C: Guide[] = [
  {
    slug: 'all-season-vs-all-weather-vs-winter-tires', kicker: 'Tire types', updated: R,
    title: 'All-Season vs. All-Weather vs. Winter Tires: What’s the Difference?', h1: 'All-season vs. all-weather vs. winter tires',
    description: 'M+S versus the three-peak mountain snowflake (3PMSF), when winter tires are needed, the tread-life trade-off, and why UTQG treadwear grades don’t cover winter-type snow tires.',
    answer: 'All-season tires cover moderate climates and usually carry M+S but not the three-peak mountain snowflake (3PMSF). All-weather tires carry 3PMSF and handle winter better than all-season tires. Dedicated winter tires are the choice for regular snow, ice and temperatures below about 45 °F, and all-weather tires still do not match them.',
    body: `
<h2>The three categories</h2>
${table(['Type', 'Designed for', 'Winter marking'], [['All-season', 'Year-round in moderate climates; fine in rain and light snow, not heavy snow or ice (Michelin)', 'Often M+S (mud and snow), which is not winter certification'], ['All-weather', 'Year-round including winter; better than all-season tires in winter (Cooper)', '3PMSF symbol; all-season tires typically do not carry it'], ['Winter', 'Snow, slush, black ice and cold; compound stays flexible below 45 °F (Michelin)', '3PMSF; sometimes an Ice Grip symbol']], `Sources: ${SRC.michelinSeasons.publisher} “Summer vs. Winter vs. All-Season Tires” and ${SRC.coopers.publisher} “All-Season vs. All-Weather Tires”. These are makers’ own descriptions.`)}
<p>NHTSA’s plain-language version: all-season tires “can handle a variety of road conditions” with “some mud and snow capabilities”; winter tires “are more effective than all-season tires in deep snow”; summer tires are “not designed to operate in temperatures below freezing, or on snow and ice” (${X('nhtsa', 'NHTSA')}).</p>
<h2>M+S vs. 3PMSF</h2>
<p>Michelin: M+S is “common on all-season tires but not a substitute for 3PMSF certification”, while 3PMSF is “the official winter standard”. TIA likewise says a tire that passes winter test requirements will usually carry the mountain-and-snowflake icon (${X('tiaSidewall', 'TIA')}). Michelin’s advice: all-season tires are workable in mild winters with occasional cold days; where temperatures regularly fall below freezing with snow and ice they are not sufficient (${X('michelinSeasons', 'Michelin')}).</p>
<h2>The tread-life trade-off</h2>
<p>Cooper says all-season tires “usually last longer” than all-weather tires because the all-weather tread is made of different materials built for colder conditions, so it is “normal for its tread to wear down faster” (${X('coopers', 'Cooper Tire')}). That is a maker’s general statement, not a measured figure. It is the reason to pair this guide with the ${A('/guides/how-to-find-longest-lasting-tires-for-your-size/', 'longest-lasting tire guide')} and the ${A('/guides/tire-cost-per-mile/', 'cost-per-mile math')}.</p>
<h2>Practical rules from the sources</h2>
<ul>
<li>With 4WD or AWD you still need winter tires on all four wheels for balanced traction (Michelin).</li>
<li>Don’t mix tire types: Michelin says all four should be the same type, including summer with all-season.</li>
<li>TIA: if winter tires go on the front they must also go on the rear; if only two, mount them on the rear (${X('tiaReplace', 'TIA')}).</li>
<li>Studded-tire rules vary by state (Michelin).</li>
</ul>
<h2>Why winter tires are missing from our UTQG data</h2>
<p>The federal UTQG rule does not apply to “deep tread, winter-type snow tires” (${X('cfr104', '49 CFR 575.104(c)')}), so a UTQG treadwear grade can’t be used to compare them and we don’t create winter pages from NHTSA data. Only ${ratedLines.filter((l) => /ALL WEATHER|SNOW|WINTER/i.test(l.line)).length} of ${nf(nRatedLines)} lines have winter, snow or all-weather words in their NHTSA names. Our ${A(typeUrl(TYPES[0]), 'all-season')} hub covers lines that carry an all-season marker. Browse by category: ${TYPES.map((t) => A(typeUrl(t), t.label)).join(' · ')}.</p>`,
    faqs: [
      { q: 'What is the difference between all-season and all-weather tires?', a: 'All-weather tires carry the three-peak mountain snowflake (3PMSF) symbol and are better in winter than all-season tires, which typically lack it. Cooper adds that all-weather tread typically wears faster.' },
      { q: 'Does M+S mean a tire is winter-rated?', a: 'No. Michelin says M+S is common on all-season tires but is not a substitute for 3PMSF certification.' },
      { q: 'Do I need winter tires if I have AWD?', a: 'Michelin says that if you often drive in snow, ice or freezing temperatures, winter tires are essential even with 4WD or AWD, and should be on all four wheels.' },
      { q: 'Are winter tires UTQG-graded?', a: 'Federal UTQG rules do not apply to deep-tread, winter-type snow tires, so they are not covered by the treadwear, traction and temperature grades.' },
    ],
    sources: ['michelinSeasons', 'coopers', 'nhtsa', 'cfr104', 'tiaSidewall', 'tiaReplace'], sizes: ['225-65r17', '265-70r17'], lines: [], related: ['utqg-traction-and-temperature-grades', 'what-does-treadwear-rating-mean', 'how-to-find-longest-lasting-tires-for-your-size'],
  },
  {
    slug: 'how-to-make-tires-last-longer', kicker: 'Maintenance', updated: R,
    title: 'How to Make Tires Last Longer: Pressure, Rotation, Alignment and Balance', h1: 'How to make your tires last longer',
    description: 'Check pressure monthly, rotate every 5,000–8,000 miles per your manual, keep alignment and balance in check. What NHTSA, TIA and USTMA each recommend, and the rotation patterns.',
    answer: 'Keep pressure at the vehicle’s placard value (check monthly with tires cold), rotate on the schedule in your owner’s manual (industry guidance is every 5,000–8,000 miles), and get alignment and balance checked when the car pulls or vibrates. NHTSA says properly inflated tires can extend average tire life by 4,700 miles.',
    body: `
<h2>1. Pressure: the biggest lever</h2>
<ul>
<li>Check at least monthly and before long trips, with tires cold (NHTSA: parked at least three hours; TIA: first thing in the morning or at least two hours after driving).</li>
<li>Use the number on the Tire and Loading Information Label on the driver’s door edge or in the owner’s manual, <em>not</em> the pressure printed on the tire (${X('nhtsa', 'NHTSA')}, ${X('tiaPressure', 'TIA')}).</li>
<li>Pressure moves one to two pounds for every 10 degrees of temperature change (${X('ustma', 'USTMA')}).</li>
<li>Don’t rely on the warning light: TPMS warns when tires are 25% under-inflated, which USTMA says may be too late to prevent damage.</li>
<li>Why it matters: under-inflation causes heat build-up and irregular wear; over-inflated tires are more likely to be cut or punctured (USTMA). NHTSA: properly inflated tires can extend the average life of a tire by 4,700 miles, yet only 19 percent of consumers inflate properly.</li>
</ul>
<h2>2. Rotation</h2>
<p>Front and rear tires wear differently: steering scrubs the fronts, and on front-wheel drive the drive axle adds stress (${X('tiaRotation', 'TIA')}). Intervals vary by source: TIA says every 5,000–7,000 miles; NHTSA says 5,000 to 8,000 if the vehicle maker recommends rotation; USTMA says follow the owner’s manual or, if none is given, 5,000–8,000 miles. Patterns per TIA:</p>
${table(['Drivetrain', 'Pattern'], [['Front-wheel drive', 'Fronts go straight back; rears cross to the front'], ['Rear-wheel drive', 'Rears go straight forward; fronts cross to the back'], ['4WD / AWD', '“Double X”: right front ↔ left rear, left front ↔ right rear'], ['Directional tires', 'Swap front and rear on the same side unless the tire is remounted']], 'Source: Tire Industry Association, Tire Rotation. If front and rear tires are different sizes, NHTSA says you may not be able to rotate; check your manual.')}
<p>Rotation can also be a warranty condition: Continental’s requires rotation every 6,000–8,000 miles with a record (${X('contiWarranty', 'Continental')}). See ${A('/guides/treadwear-vs-warranty-mileage/', 'warranty vs. treadwear')}.</p>
<h2>3. Alignment and balance</h2>
<p>Misalignment, for example after hitting a pothole, “can lead to uneven, rapid tread wear”; have it checked at any sign of pulling and periodically with balance as the owner’s manual specifies (USTMA). New tires should always be balanced when installed (NHTSA).</p>
<h2>4. Inspect, then replace on time</h2>
<p>Look at tread monthly alongside pressure (NHTSA) and replace at 2/32 inch (${A('/guides/when-to-replace-tires/', 'when to replace')}).</p>
<h2>What to expect</h2>
<p>None of this guarantees a specific number of miles, and the choice of tire matters too. Compare lines for your size on pages like ${Z('225-65r17')} or ${Z('245-45r18')}, and estimate cost with ${A('/guides/tire-cost-per-mile/', 'cost per mile')}.</p>`,
    faqs: [
      { q: 'How often should I rotate my tires?', a: 'Follow the owner’s manual. When no interval is given, USTMA recommends every 5,000 to 8,000 miles; TIA says 5,000–7,000; NHTSA says 5,000 to 8,000 if rotation is recommended for the vehicle.' },
      { q: 'Where do I find the correct tire pressure?', a: 'On the Tire and Loading Information Label on the driver’s door edge or post, or in the owner’s manual, not on the tire sidewall (NHTSA).' },
      { q: 'Does proper inflation really make tires last longer?', a: 'NHTSA says properly inflated tires can extend the average life of a tire by 4,700 miles, and USTMA says under-inflation causes heat build-up and irregular wear.' },
      { q: 'What rotation pattern should I use?', a: 'TIA: cross the free-rolling axle on front- or rear-wheel drive, “Double X” on 4WD/AWD, and swap front/rear on directional tires; check your manual, especially if tire sizes differ front to rear.' },
    ],
    sources: ['nhtsa', 'tiaPressure', 'tiaRotation', 'ustma', 'contiWarranty'], sizes: ['225-65r17', '245-45r18'], lines: [], related: ['when-to-replace-tires', 'treadwear-vs-warranty-mileage', 'tire-cost-per-mile'],
  },
  {
    slug: 'how-much-do-tires-cost', kicker: 'Buying', updated: R,
    title: 'How Much Do Tires Cost? What Drives the Price (No Made-Up Numbers)', h1: 'How much do tires cost?',
    description: 'We don’t quote tire prices we can’t source. What actually drives tire cost, what an installed quote includes, how to compare quotes fairly, and why cost per mile beats sticker price.',
    answer: 'It depends mainly on your size, the tire’s speed and load ratings, its type and maker, and your installer’s fees, so there is no single honest number. We don’t have a licensed price feed yet, so rather than guess we show how to get comparable quotes and convert them into cost per mile.',
    body: `
<h2>Why we don’t print a price range</h2>
<p>Prices change by retailer, region and week, and we haven’t licensed a price source. The only market-size figure we can cite is NHTSA’s: owners buy approximately 340 million replacement tires a year (${X('nhtsa', 'NHTSA')}). Anything more specific would be a guess, so this guide covers what moves the price.</p>
<h2>What drives price</h2>
<ul>
<li><strong>Size and rim diameter:</strong> your size is fixed by the placard, so compare within it. Our rim hubs show how common each diameter is: ${[16, 17, 18, 19, 20].map((r) => A(rimUrl(r), `${r}-inch`)).join(', ')}. See ${A('/guides/how-to-read-a-tire-sidewall/', 'reading the sidewall')}.</li>
<li><strong>Load index and speed rating:</strong> must meet or exceed the vehicle’s requirement; XL tires are built to carry more (${X('michelinRatings', 'Michelin')}).</li>
<li><strong>Type and tread life:</strong> season type and mileage warranty differ between lines (${A('/guides/all-season-vs-all-weather-vs-winter-tires/', 'seasons')}, ${A('/guides/treadwear-vs-warranty-mileage/', 'warranties')}).</li>
<li><strong>Maker and line:</strong> browse by ${A('/tires/', 'brand')} or ${A('/treadwear/', 'treadwear band')}.</li>
</ul>
<h2>What an installed quote includes</h2>
<p>Ask for an out-the-door price. Fees that can apply to a replacement include taxes, shipping, mounting, balancing and disposal or service fees (the items Continental lists on a pro-rata replacement, ${X('contiWarranty', 'Continental Tire')}). Check that all four tires are quoted, since TIA’s best practice is to replace all four together (${X('tiaReplace', 'TIA')}).</p>
<h2>Compare quotes fairly</h2>
<ol>
<li>Same size, load index and speed rating for each quote.</li>
<li>Same fees included.</li>
<li>Write down each tire’s warranty miles and its conditions.</li>
<li>Turn each quote into cost per 1,000 miles (${A('/guides/tire-cost-per-mile/', 'the method')}). The cheapest sticker is not always the cheapest per mile.</li>
</ol>
<p>Treat treadwear grades as a shortlist tool only (${A('/guides/what-does-treadwear-rating-mean/', 'what they mean')}).</p>`,
    faqs: [
      { q: 'How much does a set of four tires cost?', a: 'We can’t give a sourced figure: it depends on size, ratings, type, maker, retailer and fees. Get out-the-door quotes for your exact size and compare cost per 1,000 miles.' },
      { q: 'What is included in an installed tire price?', a: 'It can include taxes, mounting, balancing and disposal or service fees; ask for the out-the-door total. Continental lists taxes, shipping, mounting, balancing, and disposal or service fees on a pro-rata replacement.' },
      { q: 'Do more expensive tires last longer?', a: 'Not necessarily, and we have no price data to test it. Compare cost per mile using real quotes and maker warranty terms.' },
      { q: 'How many replacement tires are sold in the U.S. each year?', a: 'NHTSA says vehicle owners purchase approximately 340 million replacement tires each year.' },
    ],
    sources: ['nhtsa', 'contiWarranty', 'tiaReplace', 'michelinRatings'], sizes: ['225-65r17', '235-55r19'], lines: [], related: ['tire-cost-per-mile', 'treadwear-vs-warranty-mileage', 'how-to-read-a-tire-sidewall'],
  },
  {
    slug: 'how-to-find-longest-lasting-tires-for-your-size', kicker: 'Choosing', updated: R,
    title: 'How to Find the Longest-Lasting Tires for Your Size (225/65R17 Example)', h1: 'How to find the longest-lasting tires for your size',
    description: `A practical method using NHTSA treadwear grades, maker warranties and maker test claims, worked through for 225/65R17 (${exRows.length} graded lines), with the limits of each signal.`,
    answer: 'No public number predicts your mileage, so triangulate: shortlist your exact size’s lines by NHTSA treadwear grade, compare maker mileage warranties for your speed rating, check test claims for who ran them, then convert to cost per mile. Treadwear is a shortlist tool; Michelin’s own test shows near-equal grades can still differ widely in life.',
    body: `
<h2>Step 1: Start from your exact size</h2>
<p>Use the size on your door-jamb placard (${A('/guides/how-to-read-a-tire-sidewall/', 'how to read it')}). Our size pages rank every NHTSA-graded line for a size. Example: ${Z(SIZE_EX)} has <strong>${exRows.length}</strong> graded lines in NHTSA’s file with a median treadwear grade of <strong>${fmt(exMed)}</strong>; the highest grade filed is <strong>${exTop[0].wear_min}</strong>.</p>
${table(['Highest treadwear grades filed for 225/65R17', 'Treadwear', 'Traction', 'Temperature'], exTop.slice(0, 6).map((r) => [`${r.brand} ${r.line}`, rgn(r.wear_min as number, r.wear_max as number), r.traction ?? '—', r.temperature ?? '—']), `Source: NHTSA ratings API, pulled ${S.pulled_at.slice(0, 10)}. Where a line has several records for this size the lowest grade is used for ranking, as on the size page.`)}
<h2>Step 2: Treat treadwear as a shortlist</h2>
<p>Higher grades mean slower wear on the government course, but they are not mileage (${A('/guides/what-does-treadwear-rating-mean/', 'why')}). Browse the higher bands: ${BANDS.slice(4).map((b) => A(bandUrl(b), b.label)).join(', ')}.</p>
<h2>Step 3: Read test claims by who ran them</h2>
<p>Michelin’s 2022 press release reports a treadwear test in exactly this size, 225/65R17 on 2021 Toyota RAV4s, estimating life from the most-worn groove: Defender2 ${nf(mtRows[0].mi)} miles, TrueContact Tour ${nf(mtRows[1].mi)}, Assurance MaxLife ${nf(mtRows[2].mi)}, Alenza AS Ultra ${nf(mtRows[3].mi)}; it says actual on-road results may vary (${X('michelinTest', 'Michelin North America')}). It is a maker’s test of its own product. It is useful because all four lines have NHTSA grades between ${Math.min(...mtRows.map((r) => r.min))} and ${Math.max(...mtRows.map((r) => r.max))}, so the grades alone would not have predicted the spread. Read it as a lead to check against independent tests, not a verdict. Table and arithmetic: ${A('/guides/treadwear-vs-warranty-mileage/', 'treadwear vs. warranty')}.</p>
<h2>Step 4: Compare warranties, with conditions</h2>
<p>Warranty miles are a ceiling, pro-rated, conditional on rotation and age, and often vary by speed rating (${A('/guides/treadwear-vs-warranty-mileage/', 'details')}). Examples with maker facts on our line pages: ${Ln('michelin/defender-2')}, ${Ln('continental/procontact-tx')}.</p>
<h2>Step 5: Convert to cost per mile and plan the upkeep</h2>
<p>Use real quotes and your own mileage expectation in ${A('/guides/tire-cost-per-mile/', 'the cost-per-mile method')}, and protect the result with ${A('/guides/how-to-make-tires-last-longer/', 'pressure, rotation and alignment')}. If you drive in snow, check ${A('/guides/all-season-vs-all-weather-vs-winter-tires/', 'the season guide')} first; winter tires are outside UTQG.</p>
<p>Other sizes: ${['235-55r19', '245-45r18', '265-70r17', '215-65r16'].map((k) => Z(k)).join(', ')}.</p>`,
    faqs: [
      { q: 'What is the best way to find long-lasting tires for my size?', a: 'Shortlist lines by NHTSA treadwear grade for your exact size, compare maker mileage warranties for your speed rating, check test claims for who ran them, and compare cost per mile from real quotes.' },
      { q: 'Does the highest treadwear grade always mean the longest-lasting tire?', a: 'No. In Michelin’s own 225/65R17 test, four lines with NHTSA grades between 700 and 840 had estimated lives from 47,700 to 94,400 miles. Treadwear is best used as a shortlist, not a prediction.' },
      { q: 'How many tire lines have a treadwear grade for 225/65R17?', a: `${exRows.length} lines in the NHTSA file we downloaded, with a median grade of ${fmt(exMed)}.` },
      { q: 'Are manufacturer test results reliable?', a: 'They are the maker’s own tests of its own products and typically say actual results may vary. Use them as a lead and look for independent confirmation.' },
    ],
    sources: ['michelinTest', 'cfr104', 'nhtsa', 'contiWarranty', 'tiaSidewall'], sizes: [SIZE_EX, '235-55r19', '245-45r18'], lines: ['michelin/defender-2', 'continental/procontact-tx'], related: ['treadwear-vs-warranty-mileage', 'tire-cost-per-mile', 'what-does-treadwear-rating-mean'],
  },
];
