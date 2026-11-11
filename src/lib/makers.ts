// Facts published by the tire maker on its own public pages. Only include a field if it is read from the cited page.
// Anything not listed here is deliberately omitted (never estimated).
export interface MakerFact {
  makerName: string; // product name as the maker writes it (NHTSA's spelling may differ)
  warranty?: { text: string; sourceUrl: string; sourceLabel: string; retrieved: string; note?: string };
}
const R = '2026-10-25';
const R3 = '2026-11-11';
const MICHELIN_FLYER = 'https://dgaddcosprod.blob.core.windows.net/cxf-multisite/clsq28vx9001a11mh1x0t9t5w/attachments/s02te3s8qdc8t86vxq13xt10-michelin-2025-quick-guide-warranty-flyer-0525-final.pdf';
export const MAKER_FACTS: Record<string, MakerFact> = {
  'michelin/defender-2': {
    makerName: 'Defender2',
    warranty: { text: '80,000-mile limited treadwear warranty (Michelin says "on most sizes")', sourceUrl: 'https://www.michelinman.com/auto/tires/michelin-defender2', sourceLabel: 'michelinman.com: Michelin Defender2', retrieved: R, note: 'Michelin writes the name "Defender2"; NHTSA files it as "Defender 2". Michelin’s warranty guide lists 80k for H and V speed ratings.' },
  },
  'michelin/defender-ltx-m-s-2': {
    makerName: 'Defender LTX M/S2',
    warranty: { text: '50,000 to 75,000 miles depending on size (Michelin guide: 75k for T/H speed ratings, 50k for S)', sourceUrl: 'https://www.michelinman.com/auto/tires/michelin-defender-ltx-m-s2', sourceLabel: 'michelinman.com: Michelin Defender LTX M/S2', retrieved: R, note: 'Michelin writes "Defender LTX M/S2"; NHTSA files it as "Defender LTX M/S 2". Split by speed rating per ' + MICHELIN_FLYER },
  },
  'michelin/defender-ltx-m-s': {
    makerName: 'Defender LTX M/S',
    warranty: { text: '70,000 miles for T/H speed ratings; 50,000 for R', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R },
  },
  'michelin/defender-t-h': {
    makerName: 'Defender T + H',
    warranty: { text: '80,000 miles (H speed rating)', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R3 },
  },
  'michelin/primacy-tour-a-s': {
    makerName: 'Primacy Tour A/S',
    warranty: { text: '55,000 miles at H and V; 45,000 at W; Zero Pressure at V is 30,000', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R3 },
  },
  'michelin/pilot-sport-all-season-4': {
    makerName: 'Pilot Sport All Season 4',
    warranty: { text: 'Quick guide lists Pilot Sport A/S 4 at 45,000 miles for Y and 30,000 for (Y). The product page says up to 45,000 miles and also prints cards that both include speed index V.', sourceUrl: 'https://www.michelinman.com/auto/tires/michelin-pilot-sport-all-season-4', sourceLabel: 'michelinman.com: Pilot Sport All Season 4', retrieved: R3, note: 'Guide name is Pilot Sport A/S 4. NHTSA files Pilot Sport All Season 4. The guide and the product-page cards do not assign V the same way. See the mileage-warranty page.' },
  },
  'michelin/ltx-a-t2': {
    makerName: 'LTX A/T2',
    warranty: { text: '60,000 miles at R, S, and T', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R3, note: 'The guide types this row as all-season.' },
  },
  'michelin/premier-ltx': {
    makerName: 'Premier LTX',
    warranty: { text: '60,000 miles at T, H, and V', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R3 },
  },
  'michelin/latitude-tour': {
    makerName: 'Latitude Tour',
    warranty: { text: '65,000 miles at S and T', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R3, note: 'Latitude Tour HP is a different row on the same guide.' },
  },
  'michelin/primacy-mxm4': {
    makerName: 'Primacy MXM4',
    warranty: { text: '55,000 miles at H and V; 45,000 at W; Zero Pressure at H and V is 30,000', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R3 },
  },
  'continental/procontact-gx': {
    makerName: 'ProContact GX',
    warranty: { text: '65,000 miles (S/T), 55,000 (H), 45,000 (V), 40,000 (W)', sourceUrl: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty', sourceLabel: 'Continental Tire support: Mileage Warranty', retrieved: R3, note: 'Article updated June 12, 2026. Replacement tires only.' },
  },
  'continental/procontact-rx': {
    makerName: 'ProContact RX',
    warranty: { text: '55,000 miles (H), 45,000 (V), 40,000 (W)', sourceUrl: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty', sourceLabel: 'Continental Tire support: Mileage Warranty', retrieved: R3, note: 'The article does not print an S or T row for ProContact RX.' },
  },
  'continental/contiprocontact': {
    makerName: 'ContiProContact',
    warranty: { text: '80,000 miles (S/T), 60,000 (H), 40,000 (V and W)', sourceUrl: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty', sourceLabel: 'Continental Tire support: Mileage Warranty', retrieved: R3 },
  },
  'bridgestone/weatherpeak': {
    makerName: 'WeatherPeak',
    warranty: { text: '70,000 miles; the exceptions table says None', sourceUrl: 'https://www.firestonetire.com/content/dam/consumer/bst/na/warranties/bridgestone_warranty%20_manual_costco_US_EN_2025.pdf', sourceLabel: 'Bridgestone Firestone warranty manual, Costco U.S. English 2025 (PDF)', retrieved: R3, note: 'NHTSA files WEATHERPeak. The manual is the Costco-channel edition.' },
  },
  'bridgestone/alenza-as-ultra': {
    makerName: 'Alenza AS Ultra',
    warranty: { text: '80,000-mile limited mileage warranty; the 2025 manual’s exceptions table says None', sourceUrl: 'https://www.bridgestonetire.com/tire/alenza-as-ultra/', sourceLabel: 'bridgestonetire.com: Alenza AS Ultra', retrieved: R3, note: 'The same 80,000-mile figure is in the Costco U.S. English 2025 manual on firestonetire.com, under Alenza A/S Ultra.' },
  },
  'bridgestone/dueler-a-t-ascent': {
    makerName: 'Dueler A/T Ascent',
    warranty: { text: '60,000 miles; the exceptions table says None', sourceUrl: 'https://www.firestonetire.com/content/dam/consumer/bst/na/warranties/bridgestone_warranty%20_manual_costco_US_EN_2025.pdf', sourceLabel: 'Bridgestone Firestone warranty manual, Costco U.S. English 2025 (PDF)', retrieved: R3 },
  },
  'firestone/destination-le3': {
    makerName: 'Destination LE3',
    warranty: { text: '70,000 miles; the exceptions table says None', sourceUrl: 'https://www.firestonetire.com/content/dam/consumer/bst/na/warranties/bridgestone_warranty%20_manual_costco_US_EN_2025.pdf', sourceLabel: 'Bridgestone Firestone warranty manual, Costco U.S. English 2025 (PDF)', retrieved: R3 },
  },
  'goodyear/assurance-comfortdrive': {
    makerName: 'Assurance ComfortDrive',
    warranty: { text: '65,000 miles (65k mi tag, schema.org Warranty, and 105,000 km on the product page)', sourceUrl: 'https://www.goodyear.com/en-us/tires/assurance-comfortdrive_24385', sourceLabel: 'goodyear.com: Assurance ComfortDrive', retrieved: R3, note: 'NHTSA files ASSURANCE COMFORTDRIVE.' },
  },
  'goodyear/wrangler-workhorse-at-2': {
    makerName: 'Wrangler Workhorse AT 2',
    warranty: { text: '55,000 miles (55k mi tag, schema.org Warranty, and 90,000 km on the product page)', sourceUrl: 'https://www.goodyear.com/en-us/tires/wrangler-workhorse-at-2_25329', sourceLabel: 'goodyear.com: Wrangler Workhorse AT 2', retrieved: R3, note: 'Separate from Wrangler Workhorse AT. The page also tags the tire all-terrain and 3PMSF.' },
  },
  'bf-goodrich/advantage-control': {
    makerName: 'Advantage Control',
    warranty: { text: '75,000 miles for H-rated; 65,000 miles for V and W rated', sourceUrl: 'https://www.bfgoodrichtires.com/auto/tires/bfgoodrich-advantage-control', sourceLabel: 'bfgoodrichtires.com: Advantage Control', retrieved: R3, note: 'Footnote 3 on the product page assigns the speed ratings.' },
  },
  'bf-goodrich/trail-terrain-t-a': {
    makerName: 'Trail-Terrain T/A',
    warranty: { text: '60,000 miles', sourceUrl: 'https://www.bfgoodrichtires.com/auto/tires/bfgoodrich-trail-terrain-t-a', sourceLabel: 'bfgoodrichtires.com: Trail-Terrain T/A', retrieved: R3, note: 'The page does not split the 60,000 miles by speed rating.' },
  },
  'hankook/kinergy-pt': {
    makerName: 'Kinergy PT',
    warranty: { text: '90K mileage warranty for H and T; 75K for V, as printed on the product page', sourceUrl: 'https://www.hankooktire.com/us/en/tire/kinergy/pt-h737.html', sourceLabel: 'hankooktire.com: Kinergy PT', retrieved: R3, note: 'NHTSA files KInERGy PT. This site reads 90K as 90,000 miles and 75K as 75,000 miles.' },
  },
  'cooper/endeavor-plus-t-rated': {
    makerName: 'Endeavor Plus',
    warranty: { text: '65,000 miles (105,000 km). The booklet does not split Endeavor Plus by speed rating.', sourceUrl: 'https://www.coopertire.com/on/demandware.static/-/Sites-CooperTire-Library/default/dw89190143/pdfs/AB1E-WREG-BKT-2-2023-WarrantyRegBook-US-Eng-v5.pdf', sourceLabel: 'Cooper 2023 limited warranty and registration booklet (PDF)', retrieved: R3, note: 'NHTSA also files ENDEAVOR PLUS (H/V-rated). The booklet has one Endeavor Plus row.' },
  },
  'cooper/endeavor-plus-h-v-rated': {
    makerName: 'Endeavor Plus',
    warranty: { text: '65,000 miles (105,000 km). The booklet does not split Endeavor Plus by speed rating.', sourceUrl: 'https://www.coopertire.com/on/demandware.static/-/Sites-CooperTire-Library/default/dw89190143/pdfs/AB1E-WREG-BKT-2-2023-WarrantyRegBook-US-Eng-v5.pdf', sourceLabel: 'Cooper 2023 limited warranty and registration booklet (PDF)', retrieved: R3, note: 'NHTSA files this row separately from ENDEAVOR PLUS (T-rated).' },
  },
  'continental/procontact-tx': {
    makerName: 'ProContact TX',
    warranty: { text: 'Mileage warranty by speed rating: 65,000 (S/T), 55,000 (H), 45,000 (V), 40,000 (W)', sourceUrl: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty', sourceLabel: 'Continental Tire support: Mileage Warranty', retrieved: R, note: 'Continental’s product page says "Up to 65K Limited Warranty". Replacement tires only; original-equipment tires excluded.' },
  },
};
