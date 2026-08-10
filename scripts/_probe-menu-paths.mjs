/**
 * Apuri kuittauskierrokselle: kokeilee yleisia ruokalistapolkuja niille
 * ravintoloille joilta loytoskripti ei loytanyt ehdokasta.
 *
 * Kertakaytto, ei osa putkea. Tulos luetaan silmalla ja kuitatut linkit
 * kirjataan restaurant-menus.json:iin kasin.
 *
 * Aja: node scripts/_probe-menu-paths.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens, titleLooksLikeMenu, EVIDENCE_MIN } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const PATHS = [
  '/ruokalista', '/ruokalistat', '/ruokalista/', '/menu', '/menu/', '/menut',
  '/annokset', '/lounas', '/lounaslista', '/a-la-carte', '/alacarte',
  '/fi/ruokalista', '/fi/menu', '/en/menu', '/ravintola', '/meny',
];

const rows = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'));
const targets = rows.filter((r) => ['weak', 'rejected'].includes(r.verdict) && r.site);
console.log(`Kokeillaan ${PATHS.length} polkua ${targets.length} ravintolalle`);

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

async function tryPath(origin, p) {
  try {
    const res = await fetch(origin + p, {
      headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const title = titleOf(html);
    const evidence = countPriceTokens(strip(html));
    // Moni sivusto ohjaa tuntemattoman polun etusivulle. Vaaditaan etta
    // vastauksen osoite yha viittaa ruokalistaan.
    if (!titleLooksLikeMenu(title) && !titleLooksLikeMenu(res.url)) return null;
    return { url: res.url, title, evidence };
  } catch {
    return null;
  }
}

const found = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < targets.length) {
    const r = targets[i++];
    let origin;
    try { origin = new URL(r.site).origin; } catch { continue; }
    for (const p of PATHS) {
      const hit = await tryPath(origin, p);
      if (hit) { found.push({ slug: r.slug, name: r.name, was: r.verdict, ...hit }); break; }
    }
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

found.sort((a, b) => b.evidence - a.evidence);
console.log(`\nLoytyi ${found.length} / ${targets.length}:\n`);
for (const f of found) {
  const tier = f.evidence >= EVIDENCE_MIN ? 'strong' : 'titled';
  console.log(`${String(f.evidence).padStart(3)} ${tier.padEnd(6)} ${f.name.slice(0, 26).padEnd(26)} ${f.title.slice(0, 30).padEnd(30)} ${f.url}`);
}
fs.writeFileSync(path.join(HERE, '_menu-path-hits.json'), JSON.stringify(found, null, 1));
console.log('\n-> scripts/_menu-path-hits.json');
