/**
 * Etsii englanninkielisen ruokalistan niille ravintoloille joiden julkaistu
 * linkki on suomenkielinen.
 *
 * Sama todisteportti kuin suomenkielisillä: hinnat sivulla TAI otsikko sanoo
 * ruokalista, ei etusivu, sama domain. Englanninkielinen ETUSIVU ei kelpaa —
 * se toistaisi juuri sen vian jota koko hanke korjaa.
 *
 * Aja: node scripts/_probe-en-menus.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens, titleLooksLikeMenu, isFrontPage, sameHost, classifyKind, EVIDENCE_MIN } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const audit = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-lang-audit.json'), 'utf8'));
const targets = audit.filter((r) => r.kieli === 'fi');

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

async function get(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    return res.ok ? { url: res.url, html: await res.text() } : null;
  } catch { return null; }
}

/** Arvaa englanninkielisen vastineen suomenkielisestä polusta. */
function guessEnglish(url) {
  const out = new Set();
  const u = new URL(url);
  const p = u.pathname;
  const swaps = [
    [/^\/fi\//, '/en/'], [/^\//, '/en/'],
    [/ruokalistat/gi, 'menus'], [/ruokalista/gi, 'menu'],
    [/annokset/gi, 'menu'], [/lounas/gi, 'lunch'], [/ravintola/gi, 'restaurant'],
  ];
  for (const [from, to] of swaps) {
    if (from.test(p)) out.add(u.origin + p.replace(from, to));
  }
  out.add(`${u.origin}/en${p}`);
  out.add(`${u.origin}/en/menu/`);
  out.add(`${u.origin}/en/menus/`);
  out.add(`${u.origin}/en/a-la-carte/`);
  out.add(`${u.origin}${p}${p.endsWith('/') ? '' : '/'}?lang=en`);
  return [...out];
}

async function evaluate(url, siteUrl, nimi) {
  if (isFrontPage(url)) return { verdict: 'etusivu' };
  if (!sameHost(url, siteUrl)) return { verdict: 'vieras domain' };
  const r = await get(url);
  if (!r) return { verdict: '404' };
  if (isFrontPage(r.url)) return { verdict: 'ohjautui etusivulle' };
  const text = strip(r.html);
  const ev = countPriceTokens(text);
  const title = titleOf(r.html);
  // Onko sivu oikeasti englanniksi
  const en = (text.toLowerCase().match(/ (the|and|with|our|from|served|starters|mains|dessert) /g) || []).length;
  const fi = (text.toLowerCase().match(/ (ja|on|että|sekä|kanssa|hinta|annos|kaikki) /g) || []).length;
  if (en <= fi) return { verdict: 'ei englanniksi', url: r.url, title };
  const nameOk = (nimi || '').toLowerCase().replace(/[^a-zåäö0-9 ]/gi, ' ').split(/\s+/)
    .filter((w) => w.length >= 4 && !['ravintola', 'restaurant', 'cafe', 'pizzeria', 'hotel', 'resort', 'bistro'].includes(w))
    .some((t) => text.toLowerCase().includes(t));
  if (ev >= EVIDENCE_MIN) return { verdict: 'strong', url: r.url, title, evidence: ev, nameOk };
  if (titleLooksLikeMenu(title) || titleLooksLikeMenu(r.url)) return { verdict: 'titled', url: r.url, title, evidence: ev, nameOk };
  return { verdict: 'ei ruokalista', url: r.url, title, evidence: ev };
}

const found = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < targets.length) {
    const t = targets[i++];
    const tried = new Set();
    let hit = null;
    // 1) sivuston itse ilmoittamat englanninlinkit, 2) polkuarvaukset
    for (const cand of [...(t.enVaihtoehto || []), ...guessEnglish(t.url)]) {
      if (tried.has(cand)) continue;
      tried.add(cand);
      if (classifyKind(cand) === 'image') continue;
      const r = await evaluate(cand, t.url, t.nimi);
      if (r.verdict === 'strong') { hit = r; break; }
      if (r.verdict === 'titled' && !hit) hit = r;
    }
    found.push({ slug: t.slug, nimi: t.nimi, fiUrl: t.url, ...(hit ?? { verdict: 'ei loytynyt' }) });
    process.stdout.write('.');
  }
}));
process.stdout.write('\n\n');

const ok = found.filter((f) => f.url);
console.log(`Suomenkielisiä linkkejä: ${targets.length}`);
console.log(`Englanninkielinen ruokalista löytyi ja läpäisi portin: ${ok.length}\n`);
ok.sort((a, b) => (b.evidence ?? 0) - (a.evidence ?? 0));
for (const f of ok) {
  console.log(`${f.verdict.padEnd(7)} ${String(f.evidence ?? 0).padStart(3)} ${(f.nimi || '').slice(0, 24).padEnd(24)} ${f.nameOk === false ? '🔴nimi ' : '      '} ${f.url}`);
}
console.log('\nEI LÖYTYNYT:');
found.filter((f) => !f.url).forEach((f) => console.log(`  ${(f.nimi || '').slice(0, 26).padEnd(26)} ${f.fiUrl}`));
fs.writeFileSync(path.join(HERE, '_menu-en-candidates.json'), JSON.stringify(found, null, 1));
console.log('\n-> scripts/_menu-en-candidates.json');
