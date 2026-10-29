/** SERP title: 15–60 characters, query first, brand suffix only when it fits. */
const BRAND = 'TireMileage';
const SUFFIX = ` | ${BRAND}`;

export function serpTitle(raw: string): string {
  let t = raw.replace(/\s+/g, ' ').trim().replace(new RegExp(`\\s*\\|\\s*${BRAND}\\s*$`, 'i'), '').trim();
  t = t.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  const fit = (core: string): string => {
    const branded = `${core}${SUFFIX}`;
    if (branded.length >= 15 && branded.length <= 60) return branded;
    if (core.length >= 15 && core.length <= 60) return core;
    return '';
  };
  const direct = fit(t);
  if (direct) return direct;
  const head = t.split(': ')[0].trim();
  if (head && head !== t) {
    const headed = fit(head);
    if (headed) return headed;
  }
  if (t.length < 15) {
    const short = fit(t) || `${t}${SUFFIX}`.trim();
    if (short.length >= 15 && short.length <= 60) return short;
  }
  let cut = t.slice(0, 60);
  const sp = cut.lastIndexOf(' ');
  if (sp >= 15) cut = cut.slice(0, sp);
  cut = cut.replace(/[\s,:;—–\-|]+$/g, '').trim();
  return fit(cut) || (cut.length >= 15 ? cut.slice(0, 60) : `${cut}${SUFFIX}`.slice(0, 60));
}

/** Meta description: 70–160 characters, aiming at 120–155. Keeps the opening fact. */
export function serpDescription(raw: string): string {
  let d = raw.replace(/\s+/g, ' ').trim();
  if (d.length > 160) {
    const parts = d.split(/(?<=[.!?])\s+/);
    let acc = '';
    for (const part of parts) {
      const next = acc ? `${acc} ${part}` : part;
      if (next.length <= 155) acc = next;
      else break;
    }
    if (acc.length >= 70) d = acc;
    else {
      let cut = d.slice(0, 155);
      const sp = cut.lastIndexOf(' ');
      if (sp >= 70) cut = cut.slice(0, sp);
      d = cut.replace(/[\s,;:–—-]+$/g, '').trim();
    }
  }
  if (d.length < 120) {
    const extra = ' NHTSA UTQG treadwear grades compared in plain language.';
    if (d.length + extra.length <= 155) d = `${d}${extra}`.trim();
  }
  if (d.length < 70) {
    d = `${d} Independent tire treadwear reference from NHTSA data.`.replace(/\s+/g, ' ').trim();
    if (d.length > 155) d = d.slice(0, 155).replace(/\s+\S*$/, '').trim();
  }
  if (d.length > 160) d = d.slice(0, 155).replace(/\s+\S*$/, '').trim();
  return d;
}
