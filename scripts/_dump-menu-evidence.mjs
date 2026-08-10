/**
 * Apuri kuittauskierrokselle: hakee jokaisen strong/titled-ehdokkaan ja
 * tulostaa sen verran sisaltoa etta ihminen voi paattaa.
 *
 * Ratkaiseva sarake on OMANIMI: esiintyyko ravintolan oma nimi sivulla.
 * Juuri sen puuttuminen paljasti etta Wanha Hullu Poron "ruokalista" oli
 * Ammilan lounasbuffet samassa talossa.
 *
 * Kertakaytto, ei osa putkea. Aja: node scripts/_dump-menu-evidence.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const rows = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'))
  .filter((r) => ['strong', 'titled'].includes(r.verdict));

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

/** Ravintolan nimen ytimekkaat sanat, joilla sen esiintyminen tunnistetaan. */
function nameTokens(name) {
  return name.toLowerCase()
    .replace(/[^a-zaåäö0-9 ]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !['ravintola', 'restaurant', 'cafe', 'pizzeria', 'hotel', 'resort', 'bistro'].includes(w));
}

const out = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < rows.length) {
    const r = rows[i++];
    const rec = { ...r, ownName: null, sample: null, dishes: null };
    try {
      const res = await fetch(r.url, {
        headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000),
      });
      const html = await res.text();
      const text = strip(html);
      const toks = nameTokens(r.name);
      rec.ownName = toks.length === 0 ? null : toks.some((t) => text.toLowerCase().includes(t));
      rec.prices = countPriceTokens(text);
      rec.sample = [...text.matchAll(/.{0,34}\d{1,3}(?:[.,]\d{2})?\s?€/g)].slice(0, 3).map((m) => m[0].trim());
      rec.dishes = text.slice(0, 160).trim();
    } catch (e) {
      rec.error = e.name;
    }
    out.push(rec);
    process.stdout.write('.');
  }
}));
process.stdout.write('\n\n');

const order = { strong: 0, titled: 1 };
out.sort((a, b) => (order[a.verdict] - order[b.verdict]) || (b.prices ?? 0) - (a.prices ?? 0));
for (const r of out) {
  const flag = r.ownName === false ? ' 🔴 EI OMAA NIMEA' : '';
  const shared = r.sharedDomain ? ` 🔴 JAETTU ${r.sharedDomain}` : '';
  console.log(`[${r.verdict}] ${r.name}${flag}${shared}`);
  console.log(`   ${r.url}`);
  console.log(`   otsikko: ${(r.title || '').slice(0, 70)}`);
  console.log(`   hintoja: ${r.prices ?? '-'}  ${(r.sample ?? []).slice(0, 2).join(' | ').slice(0, 110)}`);
  console.log(`   sisalto: ${(r.dishes || '').slice(0, 110)}`);
  console.log('');
}
fs.writeFileSync(path.join(HERE, '_menu-evidence.json'), JSON.stringify(out, null, 1));
console.log(`-> scripts/_menu-evidence.json (${out.length} riviä)`);
console.log(`Ilman omaa nimea sivulla: ${out.filter((r) => r.ownName === false).length}`);
