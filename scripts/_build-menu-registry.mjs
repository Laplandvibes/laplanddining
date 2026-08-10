/**
 * Rakentaa restaurant-menus.json:in loytoajon tuloksista JA nimenomaisista
 * kasin tehdyista paatoksista.
 *
 * Kertakaytto. Paatokset ovat tassa nakyvissa, jotta ne voi lukea ja
 * kyseenalaistaa; itse rekisteri on lopputuote.
 *
 * Aja: node scripts/_build-menu-registry.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyKind, isFrontPage } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const TODAY = '2026-08-10';

const candidates = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'));
const evidence = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-evidence.json'), 'utf8'));
const evBySlug = Object.fromEntries(evidence.map((e) => [e.slug, e]));

/**
 * Kasin tehdyt paatokset. Jokainen naista on katsottu sivulta asti.
 * OVERRIDE korvaa automaatin ehdotuksen, REJECT hylkaa sen syineen.
 */
const OVERRIDE = {
  // Automaatti antoi hulluporo.fi/lounaslista/ eli AMMILAN lounasbuffetin,
  // ja sen "hinnat" olivat konserttilippuja. Ravintolan oma sivu samalla
  // sivustolla listaa 67 hintaa.
  'levi-ravintola-wanha-hullu-poro': {
    url: 'https://www.hulluporo.fi/ravintolat/wanha-hullu-poro/',
    title: 'Wanha Hullu Poro - Levi Center Hullu Poro',
    note: 'Ravintolan oma sivu talon sivustolla; automaatti tarjosi sisarravintola Ammilan lounasbuffetia.',
  },
  // Ruokalista on ankkurina etusivulla. Ilman ankkuria linkki veisi
  // etusivulle, mika on juuri se vika jota tama hanke korjaa.
  'rovaniemi-arctic-restaurant': {
    url: 'https://www.arcticrestaurant.fi/#menu',
    title: 'Arctic Restaurant - Rovaniemi',
    note: 'Ruokalista on osio etusivulla; linkki vie ankkuriin.',
  },
};

const REJECT = {
  'muonio-arctic-sauna-world': 'Harrinivan sivustolla ei ole talle omaa ruokalistaa, vain Jeris Lakeside Resortin ravintolasivu.',
  'kemi-pizzeria-san-milano': 'Pizzerian oma sivu ohjaa talon yhteiseen a la carteen; omaa listaa ei ole julkaistu.',
};

const REASONS = {
  nosite: (r) => r.reason ?? 'ei omaa verkkosivua',
  unreachable: () => 'verkkosivu ei vastaa, korjataan erikseen',
  weak: () => 'sivustolta ei loytynyt ruokalistaa etusivulta, navista eika yleisista poluista',
  rejected: () => 'ehdokas ei kelvannut ruokalistaksi',
};

const registry = {};
for (const c of candidates) {
  const slug = c.slug;

  if (REJECT[slug]) {
    registry[slug] = { status: 'none', reason: REJECT[slug], checkedAt: TODAY };
    continue;
  }

  const ov = OVERRIDE[slug];
  if (ov) {
    registry[slug] = {
      url: ov.url,
      kind: classifyKind(ov.url),
      title: ov.title,
      evidence: evBySlug[slug]?.prices ?? 0,
      note: ov.note,
      checkedAt: TODAY,
    };
    continue;
  }

  if (['strong', 'titled'].includes(c.verdict)) {
    const ev = evBySlug[slug];
    if (isFrontPage(c.url)) {
      registry[slug] = {
        status: 'none',
        reason: 'ainoa ehdokas oli sivuston etusivu, mika ei kelpaa ruokalistalinkiksi',
        checkedAt: TODAY,
      };
      continue;
    }
    registry[slug] = {
      url: c.url,
      kind: c.kind ?? classifyKind(c.url),
      title: c.title || `${c.name} (PDF)`,
      evidence: ev?.prices ?? c.evidence ?? 0,
      checkedAt: TODAY,
    };
    // Paivatty PDF-polku vaihtuu kaudessa tai viikossa. Merkitaan, jotta
    // kuukausivahdin loydos ei tule yllatyksena.
    if (classifyKind(c.url) === 'pdf' && /\/20\d\d\/\d\d\//.test(c.url)) {
      registry[slug].note = 'paivatty PDF-polku, vaihtuu kaudessa — kuukausivahti seuraa';
    }
    continue;
  }

  registry[slug] = {
    status: 'none',
    reason: (REASONS[c.verdict] ?? (() => c.verdict))(c),
    checkedAt: TODAY,
  };
}

// Vakaa jarjestys, jotta diffit pysyvat luettavina.
const sorted = Object.fromEntries(Object.keys(registry).sort().map((k) => [k, registry[k]]));
fs.writeFileSync(
  path.join(ROOT, 'src/data/generated/restaurant-menus.json'),
  `${JSON.stringify(sorted, null, 2)}\n`,
);

const withUrl = Object.values(sorted).filter((e) => e.url).length;
console.log(`${Object.keys(sorted).length} ravintolaa`);
console.log(`  ruokalistalinkki: ${withUrl}`);
console.log(`  ei linkkia:       ${Object.keys(sorted).length - withUrl}`);
console.log('-> src/data/generated/restaurant-menus.json');
