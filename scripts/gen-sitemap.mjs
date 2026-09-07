#!/usr/bin/env node
/**
 * Generoi public/sitemap.xml suoraan scripts/routes.json:ista.
 *
 * MIKSI: sitemap oli käsin ylläpidetty 120 URLin tiedosto. Kun reittejä
 * lisätään 10 → 24, käsin päivittäminen tarkoittaa 168 riviä hreflang-lohkoja
 * ja varman virheen. Reitit ovat jo yhdessä paikassa (routes.json, sama lähde
 * jota prerender käyttää), joten sitemap kuuluu johtaa siitä.
 *
 * 🔴 Trailing slash on pakollinen. Cloudflare Pages palvelee
 * `/city/levi/index.html` osoitteessa `/city/levi/` (200) ja 308-uudelleen-
 * ohjaa muodon ilman kauttaviivaa. Sitemapissa saa olla vain se muoto joka
 * vastaa 200 — muuten jokainen rivi on "Page with redirect" GSC:ssä.
 * Sama muoto kuin `Hreflang.tsx` emittoi canonicaliin.
 *
 * Aja: node scripts/gen-sitemap.mjs        (kirjoittaa public/sitemap.xml)
 *      node scripts/gen-sitemap.mjs --check (exit 1 jos tiedosto on jäljessä)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://laplanddining.com';
const OUT = resolve(ROOT, 'public/sitemap.xml');

/** hreflang-koodi → polun etuliite. Sama taulu kuin src/i18n/config.ts. */
const LOCALES = [
  ['en', ''],
  ['fi', '/fi'],
  ['de', '/de'],
  ['ja', '/ja'],
  ['es', '/es'],
  ['pt-BR', '/br'],
  ['zh-CN', '/cn'],
  ['ko', '/kr'],
  ['fr', '/fr'],
  ['it', '/it'],
  ['nl', '/nl'],
  ['sv', '/sv'],
];

/** Reitin painoarvo. Etusivu 1.0, pilarit 0.9, kaupungit 0.7, lakisivut 0.3. */
function priorityFor(path) {
  if (path === '/') return '1.0';
  if (path === '/restaurants' || path === '/cities') return '0.9';
  if (path.startsWith('/city/')) return '0.7';
  if (['/privacy', '/terms', '/cookie-policy'].includes(path)) return '0.3';
  return '0.8';
}

const routes = JSON.parse(readFileSync(resolve(ROOT, 'scripts/routes.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const url = (prefix, path) =>
  `${ORIGIN}${prefix}${path === '/' ? '' : path}`.replace(/\/?$/, '/');

const blocks = [];
for (const route of routes) {
  const path = route.path;
  for (const [, prefix] of LOCALES) {
    const loc = url(prefix, path);
    const alts = LOCALES.map(
      ([code, p]) =>
        `    <xhtml:link rel="alternate" hreflang="${code}" href="${url(p, path)}" />`,
    );
    alts.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url('', path)}" />`,
    );
    blocks.push(
      `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <priority>${priorityFor(path)}</priority>\n` +
        `${alts.join('\n')}\n` +
        `  </url>`,
    );
  }
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${blocks.join('\n')}\n` +
  `</urlset>\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* puuttuu = jäljessä */ }
  // lastmod muuttuu joka päivä, joten vertaa vain <loc>-joukkoa.
  const locs = (s) => (s.match(/<loc>[^<]*<\/loc>/g) || []).sort().join('\n');
  if (locs(current) !== locs(xml)) {
    console.error(
      `❌ sitemap: public/sitemap.xml ei vastaa routes.json:ia ` +
      `(${(current.match(/<loc>/g) || []).length} URLia tiedostossa, ${blocks.length} odotettu).\n` +
      `   Aja: node scripts/gen-sitemap.mjs`,
    );
    process.exit(1);
  }
  console.log(`✅ sitemap: ${blocks.length} URLia, vastaa routes.json:ia`);
  process.exit(0);
}

writeFileSync(OUT, xml, 'utf8');
console.log(`✅ sitemap: ${blocks.length} URLia (${routes.length} reittiä × ${LOCALES.length} kieltä) → public/sitemap.xml`);
