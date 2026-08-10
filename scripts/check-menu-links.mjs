/**
 * Kuukausivahti julkaistuille ruokalistalinkeille.
 *
 * Ajaa saman todisteportin kuin loytoskripti ja raportoi mitka linkit ovat
 * lakanneet olemasta ruokalistoja: 404, uudelleenohjaus etusivulle, poistettu
 * kausi-PDF. URL on pysyva mutta ei ikuinen.
 *
 * Kadenssi: kuukausittain, samaan aikaan sync-restaurants.mjs:n kanssa.
 * Aja: node scripts/check-menu-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens, classifyKind, titleLooksLikeMenu, redirectedToFrontPage, EVIDENCE_MIN } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), 'utf8'));

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

const entries = Object.entries(reg).filter(([, e]) => e.url);
const rot = [];
let i = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (i < entries.length) {
    const [slug, e] = entries[i++];
    try {
      const res = await fetch(e.url, {
        headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) { rot.push(`${slug}: HTTP ${res.status} — ${e.url}`); continue; }
      // Moni sivusto ohjaa poistetun sivun etusivulle 200-koodilla.
      if (redirectedToFrontPage(e.url, res.url)) {
        rot.push(`${slug}: ohjautuu nyt etusivulle — ${e.url} -> ${res.url}`);
        continue;
      }
      const body = await res.text();
      if (classifyKind(e.url) === 'pdf') continue; // PDF:n sisaltoa ei voi lukea, riittaa etta se vastaa
      const ev = countPriceTokens(strip(body));
      // Sivu kelpaa jos hinnat loytyvat TAI otsikko yha sanoo ruokalista
      // (JS-renderoidyt sivut eivat koskaan naytaneet hintoja staattisesti).
      if (ev < EVIDENCE_MIN && !titleLooksLikeMenu(titleOf(body)) && !titleLooksLikeMenu(res.url)) {
        rot.push(`${slug}: ei enaa ruokalista (${ev} hintaa, oli ${e.evidence}) — ${res.url}`);
      }
    } catch (err) {
      rot.push(`${slug}: ${err.name} — ${e.url}`);
    }
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

console.log(`Tarkistettu ${entries.length} ruokalistalinkkia.`);
if (rot.length) {
  console.error(`\n${rot.length} vaatii huomiota:`);
  rot.forEach((r) => console.error('  ' + r));
  process.exit(1);
}
console.log('Kaikki linkit ovat yha ruokalistoja.');
