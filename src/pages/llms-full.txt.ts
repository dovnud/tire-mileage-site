import { GUIDES, guideUrl } from '../lib/all-guides';
import { SRC } from '../lib/guides';
import { S, UPDATED, SOURCE_URL } from '../lib/data';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/site';
import { COMPARE_PATH, REPLACE_PATH, PAGE_DATE } from '../lib/paths';
import { compareFaqs, replaceFaqs } from '../lib/tool-faqs';

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/** Enough of the guide HTML to keep headings, lists and links as markdown. */
function htmlToMd(html: string): string {
  const s = html
    .replace(/<!--[\s\S]*?-->/g, '\n')
    .replace(/<h2[^>]*>/gi, '\n\n## ')
    .replace(/<\/h2>/gi, '\n\n')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<\/h3>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '');
  return decode(s).replace(/\n{3,}/g, '\n\n').trim();
}

export const GET = ({ site }: { site: URL }) => {
  const u = (p: string) => new URL(p, site).href;
  const guides = GUIDES.map((g) => {
    const sources = g.sources.map((id) => SRC[id]).filter(Boolean).map((s) => `- [${s.label}](${s.url}) (${s.publisher})`).join('\n');
    return `# ${g.h1}

URL: ${u(guideUrl(g))}
Last updated: ${g.updated}

${g.answer}

${htmlToMd(g.body)}

## Sources
${sources}
`;
  }).join('\n\n---\n\n');

  const body = `# ${SITE_NAME} full text

> Full text of the editorial pages for answer engines. Facts are NHTSA UTQG grades (source ${SOURCE_URL}, pulled ${UPDATED}; ${S.raw_records} records, ${S.normalized_lines} lines, ${S.normalized_brands} brands). No prices. ${CONTACT_EMAIL ? `Contact: ${CONTACT_EMAIL}.` : ''} Amazon links are affiliate links. Other retailer links are plain.

## Key pages
- [Home](${u('/')})
- [Methodology](${u('/methodology/')})
- [About](${u('/about/')})
- [Where to buy](${u('/where-to-buy/')})
- [Dataset](${u('/data/')})
- [Tire lines](${u('/tires/')})
- [Sizes](${u('/sizes/')})
- [Guides index](${u('/guides/')})
- [Compare two tires: cost per mile](${u(COMPARE_PATH)})
- [When to replace your tires](${u(REPLACE_PATH)})
- [Link map](${u('/llms.txt')})

---

${guides}

---

# Compare two tires: cost per mile

URL: ${u(COMPARE_PATH)}
Last updated: ${PAGE_DATE}

Cost per 1,000 miles is the set price you type divided by (expected miles ÷ 1,000). Break-even miles are how far the higher-priced set must last to match the lower-priced set’s cost per mile: higher set price × lower set’s expected miles ÷ lower set price. Prices are never filled in. A treadwear grade is not a mileage number. Warranty text is shown only when this site cites a maker page, and it is not copied into the miles box.

${compareFaqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Sources
- This site’s cost-per-mile guide and NHTSA ratings file. No price source.

---

# When to replace your tires

URL: ${u(REPLACE_PATH)}
Last updated: ${PAGE_DATE}

NHTSA: replace at 2/32 inch of tread. Bridgestone: most states use a 2/32-inch minimum. Wisconsin DOT and Michigan MCL 257.710 are cited for their passenger-vehicle rules. Michigan’s 4/32-inch figure is the front-tire rule for vehicles of 10,000 pounds or more, not a passenger wet-weather rule. 49 CFR 571.139 requires treadwear indicators at one sixteenth of an inch on new light-vehicle radial tires. Michelin: wet braking declines at 4/32 inch, and tires are designed to the 2/32-inch limit in normal use. Michelin’s winter page quotes Consumer Reports’ tire-testing program on 4/32 inch in snow. NHTSA: some manufacturers recommend replacement at six to 10 years. Michelin recommends inspection after five years and replacement by ten years from the manufacture date. The reminder form is on tire line pages and size pages; it stores a request and does not send a message.

${replaceFaqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Sources
${['nhtsa', 'cfr139', 'bridgestoneTread', 'wiTread', 'miTread', 'michelinTread', 'michelinWinter', 'cfr574'].map((id) => `- [${SRC[id].label}](${SRC[id].url}) (${SRC[id].publisher})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
