// Facts published by the tire maker on its own public pages. Only include a field if it is read from the cited page.
// Anything not listed here is deliberately omitted (never estimated).
export interface MakerFact {
  makerName: string; // product name as the maker writes it (NHTSA's spelling may differ)
  warranty?: { text: string; sourceUrl: string; sourceLabel: string; retrieved: string; note?: string };
}
const R = '2026-10-25';
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
    warranty: { text: '80,000 miles (H speed rating)', sourceUrl: MICHELIN_FLYER, sourceLabel: 'Michelin 2025 mileage warranty quick guide (PDF)', retrieved: R },
  },
  'continental/procontact-tx': {
    makerName: 'ProContact TX',
    warranty: { text: 'Mileage warranty by speed rating: 65,000 (S/T), 55,000 (H), 45,000 (V), 40,000 (W)', sourceUrl: 'https://continentaltire.zendesk.com/hc/en-us/articles/37882201800212-Mileage-Warranty', sourceLabel: 'Continental Tire support: Mileage Warranty', retrieved: R, note: 'Continental’s product page says "Up to 65K Limited Warranty". Replacement tires only; original-equipment tires excluded.' },
  },
};
