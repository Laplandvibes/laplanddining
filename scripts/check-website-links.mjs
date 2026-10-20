/**
 * Tarkistaa etta jokainen kortilla nakyva `Nettisivut →` -linkki vastaa.
 *
 * Lukee Maps-datan, toimituksellisen override-tason JA gemsit, koska
 * rikkinaiset osoitteet korjataan overrideissa (sync pyyhkisi generoidun
 * tiedoston) ja gemsien linkit ovat kortteja siina missa muutkin.
 *
 * Loysi 10.8.2026 neljä 404-linkkia jotka olivat livena.
 *
 * 20.10.2026: ohittaa piilotetut (permanentlyClosed) ravintolat, lukee
 * overrides-merkinnat lohkorajoilla, ja erottaa bottieston (429, Cloudflare
 * 52x, katkaistu TLS) oikeasta viasta. Estetty osoite kelpaa vain jos se on
 * tarkistettu selaimella viimeisen 92 paivan aikana (selaintarkistukset.json);
 * muuten vahti pyytaa selaintarkistusta eika julista linkkia kunnossa olevaksi.
 *
 * Aja: node scripts/check-website-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseOverrides, parseGems, probe, isBotBlock, readBrowserChecks, validBrowserCheck, todayIso,
  BROWSER_CHECK_MAX_DAYS,
} from './lib/link-watch.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const TODAY = todayIso();

const maps = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'));
const list = Array.isArray(maps) ? maps : Object.values(maps).flat();
const overrides = parseOverrides(fs.readFileSync(path.join(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8'));
const gems = parseGems(fs.readFileSync(path.join(ROOT, 'src/data/restaurant-gems.ts'), 'utf8'));
const browserChecks = readBrowserChecks(path.join(HERE, 'selaintarkistukset.json'));

let closed = 0;
let removed = 0;
const targets = [];
for (const r of list) {
  const o = overrides.get(r.googlePlaceId);
  if (o?.closed) { closed++; continue; }
  const url = o?.hasWebsite ? o.website : r.website;
  if (o?.hasWebsite && !o.website) removed++;
  targets.push({ slug: r.slug, url });
}
for (const g of gems) targets.push({ slug: g.slug, url: g.url });
const checked = targets.filter((r) => r.url && !/facebook\.com|instagram\.com/i.test(r.url));

console.log(`Tarkistetaan ${checked.length} verkkosivulinkkia (${list.length} Maps + ${gems.length} gemsia; ${closed} piilotettua ja ${removed} poistettua linkkia ohitettu)`);

const bad = [];
const browserNeeded = [];
const browserOk = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < checked.length) {
    const r = checked[i++];
    const p = await probe(r.url);
    if (!p.ok) {
      const what = p.status ? `HTTP ${p.status}` : p.errorCode;
      if (isBotBlock(p)) {
        const ok = validBrowserCheck(browserChecks, r.url, TODAY);
        if (ok) browserOk.push(`${r.slug}: ${what} (bottiesto), selaimella tarkistettu ${ok} — ${r.url}`);
        else browserNeeded.push(`${r.slug}: ${what} (bottiesto) — ${r.url}`);
      } else {
        bad.push(`${r.slug}: ${what} — ${r.url}`);
      }
    }
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

if (browserOk.length) {
  console.log(`\n${browserOk.length} estaa koneen, mutta toimi selaimessa (kirjaus vanhenee ${BROWSER_CHECK_MAX_DAYS} paivassa):`);
  browserOk.forEach((b) => console.log('  ' + b));
}
if (browserNeeded.length) {
  console.error(`\n${browserNeeded.length} estaa koneen eika selaintarkistusta ole (tai se on vanhentunut).`);
  console.error('Avaa selaimessa ja kirjaa scripts/selaintarkistukset.json:iin, tai korjaa linkki:');
  browserNeeded.forEach((b) => console.error('  ' + b));
}
if (bad.length) {
  console.error(`\n${bad.length} rikkinaista:`);
  bad.forEach((b) => console.error('  ' + b));
}
if (bad.length || browserNeeded.length) process.exit(1);
console.log('\nKaikki verkkosivulinkit vastaavat.');
