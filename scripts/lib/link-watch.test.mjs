import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseOverrides, parseGems, isBotBlock, validBrowserCheck, isExpired, todayIso,
} from './link-watch.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('sisakkainen objekti ei katkaise merkintaa ennen website-kenttaa', () => {
  const src = [
    'export const restaurantOverrides = {',
    "  // Sataman Krouwi",
    "  'ChIJ8QV9vzJL1UUR09TOcEEMzhg': {",
    '    curatedDescription: {',
    "      en: 'Down at the harbour.',",
    "    }, website: undefined },",
    '',
    "  // Tori-Kioski",
    "  'ChIJ4bE7F8Ir00URltDAnU0CI5Q': { website: 'https://torikioski.fi/' },",
    '};',
  ].join('\r\n');
  const m = parseOverrides(src);
  assert.deepEqual(m.get('ChIJ8QV9vzJL1UUR09TOcEEMzhg'), { closed: false, hasWebsite: true, website: null });
  assert.deepEqual(m.get('ChIJ4bE7F8Ir00URltDAnU0CI5Q'), { closed: false, hasWebsite: true, website: 'https://torikioski.fi/' });
});

test('permanentlyClosed luetaan myos kun se on sisakkaisen objektin jalkeen', () => {
  const src = [
    'export const restaurantOverrides = {',
    "  'ChIJqRNr4LGy00URZOb6pM88YDo': {",
    "    curatedDescription: { en: 'x', fi: 'y' },",
    '    permanentlyClosed: true,',
    '  },',
    "  'ChIJST3thVW900URZ7CT6hKOiqY': { permanentlyClosed: true },",
    "  'ChIJabcdefghijklmnopqrstuv': { city: 'Levi' },",
    '};',
  ].join('\n');
  const m = parseOverrides(src);
  assert.equal(m.get('ChIJqRNr4LGy00URZOb6pM88YDo').closed, true);
  assert.equal(m.get('ChIJST3thVW900URZ7CT6hKOiqY').closed, true);
  assert.equal(m.get('ChIJabcdefghijklmnopqrstuv').closed, false);
  assert.equal(m.get('ChIJabcdefghijklmnopqrstuv').hasWebsite, false);
});

test('oikea overrides-tiedosto: tunnetut tapaukset luetaan oikein', () => {
  const m = parseOverrides(fs.readFileSync(path.join(ROOT, 'src/data/restaurant-overrides.ts'), 'utf8'));
  assert.ok(m.size > 40, `vain ${m.size} merkintaa irtosi`);
  // Tunturikettu (Muonio): piilotettu 10.8.2026.
  assert.equal(m.get('ChIJST3thVW900URZ7CT6hKOiqY')?.closed, true);
  // Sataman Krouwi (Kemi): website poistettu curatedDescriptionin perassa.
  assert.equal(m.get('ChIJ8QV9vzJL1UUR09TOcEEMzhg')?.hasWebsite, true);
  assert.equal(m.get('ChIJ8QV9vzJL1UUR09TOcEEMzhg')?.website, null);
});

test('gemsien slug ja website irtoavat kaikista merkinnoista', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/restaurant-gems.ts'), 'utf8');
  const gems = parseGems(src);
  const slugCount = (src.match(/\bslug:\s*'/g) ?? []).length;
  assert.equal(gems.length, slugCount);
  assert.ok(gems.every((g) => g.url === null || /^https?:\/\//.test(g.url)));
});

test('bottiesto erotetaan oikeasta viasta', () => {
  assert.equal(isBotBlock({ status: 429 }), true);
  assert.equal(isBotBlock({ status: 520 }), true);
  assert.equal(isBotBlock({ status: 0, errorCode: 'UND_ERR_SOCKET' }), true);
  assert.equal(isBotBlock({ status: 404 }), false);
  assert.equal(isBotBlock({ status: 410 }), false);
  assert.equal(isBotBlock({ status: 0, errorCode: 'ENOTFOUND' }), false);
});

test('selaintarkistus koskee vain samaa osoitetta ja vanhenee', () => {
  const checks = { 'https://fieno.fi/': { checked: '2026-10-20' } };
  assert.equal(validBrowserCheck(checks, 'https://fieno.fi/', '2026-10-20'), '2026-10-20');
  assert.equal(validBrowserCheck(checks, 'https://fieno.fi/', '2027-01-20'), '2026-10-20');
  assert.equal(validBrowserCheck(checks, 'https://fieno.fi/', '2027-01-21'), null);
  assert.equal(validBrowserCheck(checks, 'https://fieno.fi/ruokalistat/', '2026-10-20'), null);
  assert.equal(validBrowserCheck(checks, 'https://fieno.fi/', '2026-10-19'), null);
});

test('voimassaolo paattyy viimeisen paivan jalkeen', () => {
  assert.equal(isExpired('2026-10-31', '2026-10-31'), false);
  assert.equal(isExpired('2026-10-31', '2026-11-01'), true);
  assert.equal(isExpired(undefined, '2026-11-01'), false);
  assert.equal(todayIso(new Date(2026, 0, 5)), '2026-01-05');
});
