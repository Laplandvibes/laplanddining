/**
 * Auditoi jokaisen julkaistun ruokalistalinkin kahdesta näkökulmasta:
 *   1. KIELI    — millä kielellä sivu on ja onko englanninkielistä vastinetta
 *   2. OIKEELLISUUS — esiintyykö ravintolan oma nimi sivulla
 *
 * Aja: node scripts/_audit-menu-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), 'utf8'));
const cands = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'));
const nameBySlug = Object.fromEntries(cands.map((c) => [c.slug, c.name]));

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

/** Karkea kielentunnistus suomi vs englanti tyypillisillä funktiosanoilla. */
function detectLang(text) {
  const t = ' ' + text.toLowerCase().slice(0, 6000) + ' ';
  const fi = (t.match(/ (ja|on|että|sekä|kanssa|hinta|ruokalista|lounas|annos|kaikki|myös|tai) /g) || []).length;
  const en = (t.match(/ (the|and|with|our|from|served|menu|starters|mains|dessert|price) /g) || []).length;
  const sv = (t.match(/ (och|med|från|vår|alla|eller|meny|pris) /g) || []).length;
  const top = Math.max(fi, en, sv);
  if (top < 3) return 'epaselva';
  if (top === fi) return 'fi';
  if (top === sv) return 'sv';
  return 'en';
}

/** Etsii englanninkielisen vastineen: hreflang, /en/-polku tai kielivalitsimen linkki. */
function findEnglish(html, baseUrl) {
  const out = new Set();
  for (const m of html.matchAll(/<link[^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi)) {
    if (/^en/i.test(m[1])) { try { out.add(new URL(m[2], baseUrl).toString()); } catch { /* kelvoton */ } }
  }
  for (const m of html.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*hreflang=["']([^"']+)["']/gi)) {
    if (/^en/i.test(m[2])) { try { out.add(new URL(m[1], baseUrl).toString()); } catch { /* kelvoton */ } }
  }
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]{0,60}?)<\/a>/gi)) {
    const href = m[1];
    const text = m[2].replace(/<[^>]+>/g, ' ').trim();
    if (/^\/en\/|\/en\/|[?&]lang=en|\/english/i.test(href) || /^(en|eng|english|in english)$/i.test(text)) {
      try { out.add(new URL(href, baseUrl).toString()); } catch { /* kelvoton */ }
    }
  }
  return [...out].filter((u) => !/\.(jpg|png|css|js)$/i.test(u)).slice(0, 3);
}

const entries = Object.entries(reg).filter(([, e]) => e.url);
const rows = [];
let i = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (i < entries.length) {
    const [slug, e] = entries[i++];
    const rec = { slug, nimi: nameBySlug[slug], url: e.url, kind: e.kind };
    try {
      const res = await fetch(e.url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      const html = await res.text();
      if (e.kind === 'pdf') {
        rec.kieli = 'pdf';
        rec.omaNimi = /Menu|menu/.test(e.url) && new RegExp((nameBySlug[slug] || '').split(/\s+/).filter((w) => w.length > 4)[0] || 'zzz', 'i').test(e.url);
      } else {
        const text = strip(html);
        rec.htmlLang = (html.match(/<html[^>]*\blang=["']([^"']+)["']/i) || [])[1] || '';
        rec.kieli = detectLang(text);
        rec.title = titleOf(html).slice(0, 40);
        const toks = (nameBySlug[slug] || '').toLowerCase().replace(/[^a-zåäö0-9 ]/gi, ' ').split(/\s+/)
          .filter((w) => w.length >= 4 && !['ravintola', 'restaurant', 'cafe', 'pizzeria', 'hotel', 'resort', 'bistro'].includes(w));
        rec.omaNimi = toks.length === 0 ? null : toks.some((t) => text.toLowerCase().includes(t));
        rec.enVaihtoehto = rec.kieli === 'fi' ? findEnglish(html, res.url) : [];
      }
    } catch (err) { rec.virhe = err.name; }
    rows.push(rec);
    process.stdout.write('.');
  }
}));
process.stdout.write('\n\n');

const byLang = rows.reduce((a, r) => ({ ...a, [r.kieli || r.virhe]: (a[r.kieli || r.virhe] ?? 0) + 1 }), {});
console.log('KIELIJAKAUMA:', JSON.stringify(byLang));
const fiWithEn = rows.filter((r) => r.kieli === 'fi' && r.enVaihtoehto?.length);
console.log(`Suomenkielisiä joilla LÖYTYY englanninkielinen vastine: ${fiWithEn.length}`);
console.log(`Suomenkielisiä ilman vastinetta: ${rows.filter((r) => r.kieli === 'fi' && !r.enVaihtoehto?.length).length}`);
console.log(`\nOMA NIMI EI ESIINNY SIVULLA (${rows.filter((r) => r.omaNimi === false).length}):`);
rows.filter((r) => r.omaNimi === false).forEach((r) => console.log(`  ${r.nimi} — ${r.url}`));

console.log('\n--- SUOMEKSI, ENGLANTI SAATAVILLA ---');
fiWithEn.forEach((r) => console.log(`  ${(r.nimi || '').slice(0, 26).padEnd(26)} ${r.url}\n      -> ${r.enVaihtoehto[0]}`));

fs.writeFileSync(path.join(HERE, '_menu-lang-audit.json'), JSON.stringify(rows, null, 1));
console.log('\n-> scripts/_menu-lang-audit.json');
