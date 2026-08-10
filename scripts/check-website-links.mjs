/**
 * Tarkistaa etta jokainen kortilla nakyva `Nettisivut →` -linkki vastaa.
 *
 * Lukee Maps-datan JA toimituksellisen override-tason, koska rikkinaiset
 * osoitteet korjataan overrideissa (sync pyyhkisi generoidun tiedoston).
 *
 * Loysi 10.8.2026 neljä 404-linkkia jotka olivat livena.
 * Aja: node scripts/check-website-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const maps = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurants-from-maps.json'), 'utf8'));
const list = Array.isArray(maps) ? maps : Object.values(maps).flat();

// Poimi override-tason website-muutokset Place ID:n mukaan.
const src = fs.readFileSync(path.join(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8');
const overrides = {};
for (const m of src.matchAll(/'(ChIJ[^']+)':\s*\{([^}]*)\}/g)) {
  const body = m[2];
  if (/website:\s*undefined/.test(body)) overrides[m[1]] = null;
  else {
    const url = body.match(/website:\s*'([^']+)'/);
    if (url) overrides[m[1]] = url[1];
  }
}

const targets = list
  .map((r) => ({
    slug: r.slug,
    name: r.name,
    url: r.googlePlaceId in overrides ? overrides[r.googlePlaceId] : r.website,
  }))
  .filter((r) => r.url && !/facebook\.com|instagram\.com/i.test(r.url));

console.log(`Tarkistetaan ${targets.length} verkkosivulinkkia (${Object.values(overrides).filter((v) => v === null).length} poistettu overrideissa)`);

const bad = [];
let i = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (i < targets.length) {
    const r = targets[i++];
    try {
      const res = await fetch(r.url, {
        headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) bad.push(`${r.slug}: HTTP ${res.status} — ${r.url}`);
    } catch (e) {
      bad.push(`${r.slug}: ${e.name} — ${r.url}`);
    }
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

if (bad.length) {
  console.error(`\n${bad.length} rikkinaista:`);
  bad.forEach((b) => console.error('  ' + b));
  process.exit(1);
}
console.log('Kaikki verkkosivulinkit vastaavat.');
