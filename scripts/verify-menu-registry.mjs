/**
 * Portti rekisterille. Ajetaan ennen committia.
 *
 * Vaatii etta jokainen ravintola on kirjattu ja etta yksikaan julkaistu
 * linkki ei ole ilmiselvaa roskaa. Kattavuus on koneellisesti todistettu,
 * ei silmamaarainen.
 *
 * Aja: node scripts/verify-menu-registry.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyKind, isFrontPage } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), 'utf8'));
const cands = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'));
const slugs = cands.map((c) => c.slug);
const siteBySlug = Object.fromEntries(cands.map((c) => [c.slug, c.site]));

const errors = [];
const seenUrls = new Map();

for (const slug of slugs) {
  const e = reg[slug];
  if (!e) { errors.push(`puuttuu kokonaan: ${slug}`); continue; }
  if (!e.checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(e.checkedAt)) {
    errors.push(`${slug}: checkedAt puuttuu tai on vaarassa muodossa`);
  }
  if (e.status === 'none') {
    if (!e.reason) errors.push(`${slug}: status none ilman syyta`);
    if (e.url) errors.push(`${slug}: status none mutta url on asetettu`);
    continue;
  }
  if (!e.url) { errors.push(`${slug}: ei urlia eika status: none`); continue; }
  if (!/^https?:\/\//i.test(e.url)) errors.push(`${slug}: url ei ole http(s)`);
  if (classifyKind(e.url) === 'image') errors.push(`${slug}: url on kuvatiedosto (${e.url})`);
  if (e.kind !== classifyKind(e.url)) errors.push(`${slug}: kind=${e.kind} ei vastaa urlia ${e.url}`);
  if (isFrontPage(e.url)) errors.push(`${slug}: url on sivuston etusivu (${e.url})`);
  if (!e.title) errors.push(`${slug}: title puuttuu`);
  if (typeof e.evidence !== 'number') errors.push(`${slug}: evidence puuttuu`);
  // Sama URL kahdelle ravintolalle tarkoittaa etta toinen sai naapurin listan.
  if (seenUrls.has(e.url)) errors.push(`${slug}: sama url kuin ${seenUrls.get(e.url)} (${e.url})`);
  seenUrls.set(e.url, slug);
  // Ruokalistan pitaa olla ravintolan omalla sivustolla.
  const site = siteBySlug[slug];
  if (site) {
    const bare = (u) => { try { return new URL(u).hostname.replace(/^www\./i, '').toLowerCase(); } catch { return ''; } };
    if (bare(e.url) !== bare(site)) errors.push(`${slug}: url on eri domainilla kuin verkkosivu (${bare(e.url)} vs ${bare(site)})`);
  }
}

for (const key of Object.keys(reg)) {
  if (!slugs.includes(key)) errors.push(`tuntematon slug rekisterissa: ${key}`);
}

const withUrl = Object.values(reg).filter((e) => e.url).length;
const none = Object.values(reg).filter((e) => e.status === 'none').length;
const pdf = Object.values(reg).filter((e) => e.kind === 'pdf').length;
console.log(`Rekisterissa ${Object.keys(reg).length} / ${slugs.length} ravintolaa`);
console.log(`  ruokalistalinkki:        ${withUrl}  (joista PDF ${pdf})`);
console.log(`  ei linkkia, syy kirjattu: ${none}`);

if (errors.length) {
  console.error(`\n${errors.length} virhetta:`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('\nOK — kaikki ravintolat kirjattu ja linkit muodollisesti kunnossa.');
