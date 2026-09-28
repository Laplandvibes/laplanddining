// Sivustokortin kuvaus (og:image:alt, twitter:image:alt) lukijan kielellä: scripts/og-alt.json.
//
// Kortti on tehty etusivun herosta, joten sen kuvaus on heron alt + sanamerkki. Kolme paikkaa kantaa samaa tekstiä:
//   index.html-kuori      englanninkielinen alt (lv-ops scripts/og/install.mjs kirjoittaa)
//   pages.json home.heroAlt  heron alt jokaisella kielellä (etusivun <img alt>)
//   scripts/og-alt.json   prerenderöijän käännökset, avaimena kuoren englanninkielinen alt
// Testi pitää ne samoina: jos heron käännös muuttuu, jakokortin kuvaus muuttuu samalla.
//
// Aja: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const LOCALES = ['fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];
const MERKKI = '#LAPLANDDINING';
const heroAlt = (l) => JSON.parse(readFileSync(resolve(ROOT, `src/locales/${l}/pages.json`), 'utf8')).home.heroAlt;
const kuori = readFileSync(resolve(ROOT, 'index.html'), 'utf8');
const kuorenAlt = (attr, key) => {
  const t = kuori.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, 'i'));
  return t ? t[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : null;
};
const ogAlt = JSON.parse(readFileSync(resolve(ROOT, 'scripts/og-alt.json'), 'utf8'));

test('kuoren englanninkielinen alt = heron englanninkielinen alt + sanamerkki', () => {
  assert.equal(kuorenAlt('property', 'og:image:alt'), `${heroAlt('en')}. ${MERKKI}`);
  assert.equal(kuorenAlt('name', 'twitter:image:alt'), `${heroAlt('en')}. ${MERKKI}`);
});

test('og-alt.json tuntee kuoren altin (muuten jokainen kieli saa englannin)', () => {
  assert.ok(ogAlt[kuorenAlt('property', 'og:image:alt')], Object.keys(ogAlt).join(' | '));
});

test('jokaisella 11 kielellä käännös = heron alt + sanamerkki, ja/zh täysleveällä pisteellä', () => {
  const kaannokset = ogAlt[kuorenAlt('property', 'og:image:alt')] || {};
  for (const l of LOCALES) {
    const h = heroAlt(l);
    assert.ok(h && h !== heroAlt('en'), `${l}: home.heroAlt puuttuu tai on englanniksi`);
    const erotin = l === 'ja' || l === 'zh-CN' ? '。' : '. ';
    assert.equal(kaannokset[l], `${h}${erotin}${MERKKI}`, l);
    assert.doesNotMatch(kaannokset[l], /—/, `${l}: em-viiva`);
  }
});
