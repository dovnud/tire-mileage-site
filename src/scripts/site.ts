// Tiny vanilla-JS helpers: header search, size lookup, sortable tables. No framework, no dependencies.
type Row = [string, string, string, string, string?];
let index: Row[] | null = null;
let loading: Promise<Row[]> | null = null;
const load = () => (index ? Promise.resolve(index) : (loading ??= fetch('/search-index.json').then((r) => r.json()).then((j: Row[]) => (index = j))));
const norm = (s: string) => s.toLowerCase().replace(/[\/\-_.,()]+/g, ' ').replace(/\s+/g, ' ').trim();
const TYPE: Record<string, string> = { L: 'Tire line', B: 'Brand', S: 'Size' };

export function parseSize(v: string): string | null {
  const m = v.toLowerCase().replace(/\b(p|lt|ltx)(?=\d)/, '').match(/(\d{3})\s*[\/\- ]?\s*(\d{2})\s*(?:z?r|-|\s)?\s*(\d{2})\b/);
  return m ? `${m[1]}-${m[2]}r${m[3]}` : null;
}
const sizeLabel = (k: string) => k.replace('-', '/').replace('r', 'R');

function search(q: string, rows: Row[], max = 8): Row[] {
  const toks = norm(q).split(' ').filter(Boolean);
  if (!toks.length) return [];
  const sk = parseSize(q);
  const out: [number, Row][] = [];
  for (const r of rows) {
    const hay = norm(r[1]);
    if (sk && r[0] === 'S' && r[4] === sk) { out.push([100, r]); continue; }
    if (!toks.every((t) => hay.includes(t))) continue;
    out.push([(hay.startsWith(toks[0]) ? 10 : 0) + (r[0] === 'B' ? 3 : r[0] === 'S' ? 2 : 0) - hay.length / 100, r]);
  }
  return out.sort((a, b) => b[0] - a[0]).slice(0, max).map((x) => x[1]);
}

function initHeaderSearch() {
  const input = document.getElementById('q') as HTMLInputElement | null;
  const list = document.getElementById('q-results') as HTMLUListElement | null;
  if (!input || !list) return;
  let cur = -1;
  const items = () => [...list.querySelectorAll<HTMLAnchorElement>('a')];
  const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); cur = -1; };
  const sel = (i: number) => { const a = items(); a.forEach((x, n) => x.setAttribute('aria-selected', String(n === i))); cur = i; if (a[i]) input.setAttribute('aria-activedescendant', a[i].id); };
  const render = async () => {
    const rows = await load();
    const res = search(input.value, rows);
    if (!input.value.trim()) return close();
    list.innerHTML = res.length
      ? res.map((r, n) => `<li role="presentation"><a role="option" id="q-o${n}" href="${r[2]}">${esc(r[1])}<small>${TYPE[r[0]]} · ${esc(r[3])}</small></a></li>`).join('')
      : `<li class="empty">No match in this site’s ${rows.length} searchable pages. Try a brand, a tire line or a size like 225/65R17.</li>`;
    list.hidden = false; input.setAttribute('aria-expanded', 'true'); cur = -1;
  };
  input.addEventListener('focus', () => void load());
  input.addEventListener('input', () => void render());
  input.addEventListener('keydown', (e) => {
    const a = items();
    if (e.key === 'ArrowDown') { e.preventDefault(); sel(Math.min(cur + 1, a.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel(Math.max(cur - 1, 0)); }
    else if (e.key === 'Escape') { close(); }
    else if (e.key === 'Enter') { const t = a[cur] ?? a[0]; if (t) { e.preventDefault(); location.href = t.href; } }
  });
  document.addEventListener('click', (e) => { if (!(e.target as Element).closest('.search')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && !/input|textarea/i.test((e.target as Element).tagName)) { e.preventDefault(); input.focus(); } });
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

function initLookup() {
  const form = document.getElementById('size-lookup') as HTMLFormElement | null;
  if (!form) return;
  const input = form.querySelector('input') as HTMLInputElement;
  const msg = document.getElementById('lookup-msg')!;
  input.addEventListener('focus', () => void load());
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = parseSize(input.value);
    if (!key) { msg.textContent = 'Enter a size like 225/65R17 (width / aspect ratio / rim diameter).'; return; }
    const rows = await load();
    const hit = rows.find((r) => r[0] === 'S' && r[4] === key);
    if (hit) { location.href = hit[2]; return; }
    const rim = key.split('r')[1], width = key.split('-')[0];
    const near = rows.filter((r) => r[0] === 'S' && r[4] && (r[4].endsWith('r' + rim) || r[4].startsWith(width + '-'))).slice(0, 6);
    msg.innerHTML = `No page for <b>${sizeLabel(key)}</b> yet. NHTSA names few sizes explicitly, so size pages exist only for the most-listed sizes.` + (near.length ? ' Closest: ' + near.map((r) => `<a href="${r[2]}">${esc(r[1])}</a>`).join(', ') + '.' : ' <a href="/sizes/">Browse available sizes</a>.');
  });
}

function initSortable() {
  document.querySelectorAll<HTMLTableElement>('table[data-sortable]').forEach((t) => {
    const heads = [...t.tHead!.rows[0].cells];
    heads.forEach((th, i) => {
      if (th.dataset.nosort !== undefined) return;
      const b = document.createElement('button'); b.type = 'button'; b.innerHTML = th.innerHTML; th.innerHTML = ''; th.appendChild(b);
      th.setAttribute('aria-sort', 'none');
      b.addEventListener('click', () => {
        const dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
        const num = th.classList.contains('n');
        const rows = [...t.tBodies[0].rows];
        const val = (r: HTMLTableRowElement) => { const c = r.cells[i]; const v = c.dataset.v ?? c.textContent!.trim(); return num ? (v === '' || v === '—' ? -Infinity : parseFloat(v.replace(/[^\d.\-]/g, ''))) : v.toLowerCase(); };
        rows.sort((a, c) => { const x = val(a), y = val(c); return (x < y ? -1 : x > y ? 1 : 0) * dir; });
        rows.forEach((r) => t.tBodies[0].appendChild(r));
        heads.forEach((h) => h.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
      });
    });
  });
}
initHeaderSearch(); initLookup(); initSortable();
