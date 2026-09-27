// Kaupunkisivujen heron kuvateksti lukijan kielellä (src/data/photoCredit.ts).
//
// Rivi piirtyy vasta selaimessa, joten kielipuhtausportti (esirenderöity HTML) ei näe
// sitä. Tämä testi on se paikka, jossa jokaisen kielen tulos luetaan.
//
// Aja: npm test (Node 22.6+ lukee TypeScriptin suoraan; vanhempi Node ohittaa testin).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Aikavyöhyke, jossa naiivi new Date('2026-07') näyttäisi kesäkuun. Asetetaan ennen
// ensimmäistäkään päivämäärää.
process.env.TZ = 'Pacific/Honolulu';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const LOCALES = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];
const WORD = {
  en: 'Photo', fi: 'Kuva', de: 'Foto', ja: '写真', es: 'Foto', 'pt-BR': 'Foto',
  'zh-CN': '图片', ko: '사진', fr: 'Photo', it: 'Foto', nl: 'Foto', sv: 'Foto',
};
const pages = Object.fromEntries(LOCALES.map((l) => [
  l, JSON.parse(readFileSync(resolve(ROOT, `src/locales/${l}/pages.json`), 'utf8')),
]));

const canStrip = Boolean(process.features?.typescript);
const mod = canStrip ? await import('../../src/data/photoCredit.ts') : null;
const opts = canStrip ? {} : { skip: 'Node ilman TypeScript-tukea (process.features.typescript)' };

test('Levin kuvateksti kaikilla 12 kielellä, sivuston omalla paikannimellä', opts, () => {
  const expected = {
    en: 'Photo: LaplandVibes · Levi, July 2026',
    fi: 'Kuva: LaplandVibes · Levi, heinäkuu 2026',
    de: 'Foto: LaplandVibes · Levi, Juli 2026',
    ja: '写真：LaplandVibes · レヴィ、2026年7月',
    es: 'Foto: LaplandVibes · Levi, julio de 2026',
    'pt-BR': 'Foto: LaplandVibes · Levi, julho de 2026',
    'zh-CN': '图片：LaplandVibes · 莱维，2026年7月',
    ko: '사진: LaplandVibes · 레비, 2026년 7월',
    fr: 'Photo\u00A0: LaplandVibes · Levi, juillet 2026',
    it: 'Foto: LaplandVibes · Levi, luglio 2026',
    nl: 'Foto: LaplandVibes · Levi, juli 2026',
    sv: 'Foto: LaplandVibes · Levi, juli 2026',
  };
  for (const l of LOCALES) {
    const place = pages[l].cities.levi.name;
    assert.equal(mod.ownPhotoCredit(WORD[l], place, '2026-07', l), expected[l], l);
  }
});

test('Rukan kuvateksti tulee OTHER_PHOTO_PLACES-taulusta (Kuusamon sivu)', opts, () => {
  const expected = {
    en: 'Photo: LaplandVibes · Ruka, July 2026',
    ja: '写真：LaplandVibes · ルカ、2026年7月',
    'zh-CN': '图片：LaplandVibes · 鲁卡，2026年7月',
    ko: '사진: LaplandVibes · 루카, 2026년 7월',
    sv: 'Foto: LaplandVibes · Ruka, juli 2026',
  };
  for (const [l, want] of Object.entries(expected)) {
    assert.equal(mod.ownPhotoCredit(WORD[l], mod.OTHER_PHOTO_PLACES.ruka[l], '2026-07', l), want, l);
  }
});

test('ei suomea muilla kielillä, ja kuukausi on UTC:ssä (ei kesäkuuta Havaijilla)', opts, () => {
  const FI = /heinäkuu|kesäkuu|Kuva:|Kuvituskuva/;
  for (const l of LOCALES.filter((x) => x !== 'fi')) {
    const s = mod.ownPhotoCredit(WORD[l], 'X', '2026-07', l);
    assert.doesNotMatch(s, FI, `${l}: ${s}`);
  }
  assert.equal(mod.monthYear('2026-07', 'en'), 'July 2026');
  assert.equal(mod.monthYear('2026-01', 'en'), 'January 2026');
  assert.equal(mod.monthYear('2026-12', 'fi'), 'joulukuu 2026');
});

test('virheellinen kuukausi ei kaada sivua: merkintä jää ilman kuukautta', opts, () => {
  assert.equal(mod.monthYear('heinäkuu 2026', 'en'), '');
  assert.equal(mod.monthYear('2026-13', 'en'), '');
  assert.equal(mod.ownPhotoCredit('Photo', 'Levi', '2026-7', 'en'), 'Photo: LaplandVibes · Levi');
});

test('jokaisen kaupunkisivun kuvan paikka löytyy kaikilla 12 kielellä', opts, () => {
  const src = readFileSync(resolve(ROOT, 'src/data/diningCities.ts'), 'utf8');
  const rows = [...src.matchAll(/photoCredit:\s*\{\s*place:\s*'([a-z]+)',\s*month:\s*'([^']+)'\s*\}/g)];
  // Tyhjä lista olisi valheellisen vihreä (rakenne muuttui, lauseke ei osu).
  assert.ok(rows.length >= 6, `diningCities.ts:stä löytyi vain ${rows.length} kuvatekstiä`);
  for (const [, place, month] of rows) {
    assert.match(month, /^\d{4}-(0[1-9]|1[0-2])$/, `${place}: kuukausi ${month}`);
    for (const l of LOCALES) {
      const name = mod.OTHER_PHOTO_PLACES[place]?.[l] ?? pages[l].cities?.[place]?.name;
      assert.ok(name, `${place}: ei nimeä kielellä ${l}`);
    }
  }
});
