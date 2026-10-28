import { UPDATED } from './data';
import { CONTACT_EMAIL, SITE_NAME } from './site';

export const ORG_ID_PATH = '/#organization';
export const SITE_ID_PATH = '/#website';

type Node = Record<string, unknown>;

function nodesFrom(ld: unknown[]): Node[] {
  const out: Node[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    const o = node as Node;
    if (Array.isArray(o['@graph'])) { walk(o['@graph']); return; }
    const rest = { ...o };
    delete rest['@context'];
    out.push(rest);
  };
  ld.forEach(walk);
  return out;
}

function hasType(node: Node, type: string): boolean {
  const t = node['@type'];
  return t === type || (Array.isArray(t) && t.includes(type));
}

const PAGE_TYPES = new Set(['WebPage', 'CollectionPage', 'Article', 'Dataset', 'FAQPage', 'ItemList', 'AboutPage', 'ContactPage', 'SearchResultsPage']);

/** One schema.org @graph for every page: Organization, WebSite, WebPage, breadcrumbs, plus the page's own entities. */
export function pageGraph(opts: {
  origin: string;
  canonical: string;
  path: string;
  title: string;
  description: string;
  crumbs: { name: string; href: string }[];
  ld: unknown[];
  ogImage: string;
  published?: string;
  modified?: string;
}): Node {
  const { origin, canonical, path, title, description, ld, ogImage } = opts;
  const orgId = new URL(ORG_ID_PATH, origin).href;
  const siteId = new URL(SITE_ID_PATH, origin).href;
  const pageDate = opts.modified || UPDATED;
  const orgRef = { '@type': 'Organization', '@id': orgId, name: SITE_NAME };
  const logoUrl = new URL('/logo-mark.png', origin).href;
  const org: Node = {
    '@type': 'Organization',
    '@id': orgId,
    name: SITE_NAME,
    url: new URL('/', origin).href,
    logo: { '@type': 'ImageObject', '@id': new URL('/#logo', origin).href, url: logoUrl, contentUrl: logoUrl, width: 512, height: 512, caption: SITE_NAME },
    ...(CONTACT_EMAIL ? {
      email: CONTACT_EMAIL,
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: CONTACT_EMAIL, url: new URL('/contact/', origin).href, availableLanguage: 'English' },
    } : {}),
    publishingPrinciples: new URL('/methodology/', origin).href,
    // No third-party social profile is published for this site. sameAs lists its own canonical identity pages.
    sameAs: [new URL('/about/', origin).href, new URL('/methodology/', origin).href, new URL('/llms.txt', origin).href],
  };
  const website: Node = {
    '@type': 'WebSite',
    '@id': siteId,
    name: SITE_NAME,
    url: new URL('/', origin).href,
    description,
    publisher: { '@id': orgId },
    inLanguage: 'en-US',
  };
  const crumbItems = opts.crumbs.length ? opts.crumbs : (path === '/' ? [] : [{ name: 'Home', href: '/' }, { name: title, href: path }]);
  const crumbId = `${canonical}#breadcrumb`;
  const breadcrumb: Node | null = crumbItems.length ? {
    '@type': 'BreadcrumbList',
    '@id': crumbId,
    itemListElement: crumbItems.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.href, origin).href })),
  } : null;
  const webpage: Node = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    dateModified: pageDate,
    datePublished: opts.published || pageDate,
    inLanguage: 'en-US',
    isPartOf: { '@id': siteId },
    publisher: orgRef,
    author: orgRef,
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImage },
    ...(breadcrumb ? { breadcrumb: { '@id': crumbId } } : {}),
  };
  const extras = nodesFrom(ld).filter((n) => !hasType(n, 'WebSite') && !hasType(n, 'Organization') && !hasType(n, 'BreadcrumbList'));
  for (const node of extras) {
    const t = node['@type'];
    const types = Array.isArray(t) ? t : [t];
    if (types.some((x) => PAGE_TYPES.has(String(x)))) {
      if (!node.dateModified) node.dateModified = pageDate;
      if (!node.publisher) node.publisher = orgRef;
      if (!node.author && (hasType(node, 'Article') || hasType(node, 'WebPage') || hasType(node, 'Dataset'))) node.author = orgRef;
    }
    if (hasType(node, 'Article') && !node.publisher) node.publisher = orgRef;
    if (hasType(node, 'Article')) {
      node.author = orgRef;
      node.publisher = orgRef;
      if (!node['@id']) node['@id'] = `${canonical}#article`;
      if (!webpage.mainEntity) webpage.mainEntity = { '@id': node['@id'] };
    } else if (hasType(node, 'Dataset') && !webpage.mainEntity) {
      if (!node['@id']) node['@id'] = `${canonical}#dataset`;
      webpage.mainEntity = { '@id': node['@id'] };
    }
  }
  return { '@context': 'https://schema.org', '@graph': [org, website, webpage, ...(breadcrumb ? [breadcrumb] : []), ...extras] };
}
