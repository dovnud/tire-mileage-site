import { GUIDES, guideUrl } from '../lib/all-guides';
import { SRC } from '../lib/guides';
import { S, UPDATED, SOURCE_URL } from '../lib/data';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/site';

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
- [Link map](${u('/llms.txt')})

---

${guides}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
