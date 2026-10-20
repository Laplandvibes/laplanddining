/**
 * Kuukausivahti julkaistuille ruokalistalinkeille.
 *
 * Ajaa saman todisteportin kuin loytoskripti ja raportoi mitka linkit ovat
 * lakanneet olemasta ruokalistoja: 404, uudelleenohjaus etusivulle, poistettu
 * kausi-PDF. URL on pysyva mutta ei ikuinen.
 *
 * 20.10.2026 lisatty:
 * - Englanninkieliset osoitteet (`urlEn`) tarkistetaan samalla tavalla; ne
 *   ovat se linkki jonka kaikki muut kuin suomenkieliset kavijat saavat.
 * - `validUntil`: viimeinen paiva jolloin osoite on voimassa (kuukauden
 *   lista /lokakuu, kampanjamenu 11.9.–31.10.). Sivusto piilottaa linkin sen
 *   jalkeen itse, ja vahti pyytaa etsimaan uuden osoitteen.
 * - `evidenceMin`: rivikohtainen hintaraja kun sivu on aidosti ruokalista
 *   mutta hintoja on vahan (viikon lounaslista yhdella buffet-hinnalla).
 *   Peruste kirjataan riville `note`-kenttaan.
 * - Bottiesto (429, Cloudflare 52x, katkaistu TLS) ei ole vika: osoite
 *   kelpaa jos se on tarkistettu selaimella 92 paivan sisalla
 *   (selaintarkistukset.json), muuten vahti pyytaa selaintarkistusta.
 *
 * Kadenssi: kuukausittain, samaan aikaan sync-restaurants.mjs:n kanssa.
 * Aja: node scripts/check-menu-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens, classifyKind, titleLooksLikeMenu, redirectedToFrontPage, EVIDENCE_MIN } from './lib/menu-detect.mjs';
import { probe, isBotBlock, readBrowserChecks, validBrowserCheck, todayIso, isExpired, BROWSER_CHECK_MAX_DAYS } from './lib/link-watch.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const TODAY = todayIso();
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/restaurant-menus.json'), 'utf8'));
const browserChecks = readBrowserChecks(path.join(HERE, 'selaintarkistukset.json'));

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

// Yksi tarkistettava osoite per kieli: { slug, label, url, entry }.
const checks = [];
for (const [slug, e] of Object.entries(reg)) {
  if (e.url) checks.push({ slug, label: slug, url: e.url, kind: e.kind, entry: e });
  if (e.urlEn) checks.push({ slug, label: `${slug} (en)`, url: e.urlEn, kind: e.kindEn, entry: e });
}

const rot = [];
const browserNeeded = [];
const browserOk = [];
for (const [slug, e] of Object.entries(reg)) {
  if (e.url && isExpired(e.validUntil, TODAY)) {
    rot.push(`${slug}: voimassaolo paattyi ${e.validUntil} (sivusto piilottaa linkin) — etsi uusi osoite: ${e.url}`);
  }
}

let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < checks.length) {
    const { label, url, kind, entry: e } = checks[i++];
    process.stdout.write('.');
    if (isExpired(e.validUntil, TODAY)) continue; // raportoitu jo yllä
    const p = await probe(url);
    if (!p.ok) {
      const what = p.status ? `HTTP ${p.status}` : p.errorCode;
      if (isBotBlock(p)) {
        const ok = validBrowserCheck(browserChecks, url, TODAY);
        if (ok) browserOk.push(`${label}: ${what} (bottiesto), selaimella tarkistettu ${ok} — ${url}`);
        else browserNeeded.push(`${label}: ${what} (bottiesto) — ${url}`);
      } else {
        rot.push(`${label}: ${what} — ${url}`);
      }
      continue;
    }
    // Moni sivusto ohjaa poistetun sivun etusivulle 200-koodilla.
    if (redirectedToFrontPage(url, p.finalUrl)) {
      rot.push(`${label}: ohjautuu nyt etusivulle — ${url} -> ${p.finalUrl}`);
      continue;
    }
    if (kind === 'pdf') {
      // PDF:n sisaltoa ei voi lukea, riittaa etta se vastaa. Ilman .pdf-paatetta
      // (Scandicin GetMenufile) otsakkeen on silti sanottava PDF: muuten palvelu
      // on alkanut antaa virhesivua 200-koodilla.
      const ct = p.res.headers.get('content-type') ?? '';
      await p.res.body?.cancel();
      if (classifyKind(url) !== 'pdf' && !/pdf/i.test(ct)) {
        rot.push(`${label}: ei enaa PDF (content-type ${ct || 'puuttuu'}) — ${url}`);
      }
      continue;
    }
    const body = await p.res.text();
    const ev = countPriceTokens(strip(body));
    const min = typeof e.evidenceMin === 'number' ? e.evidenceMin : EVIDENCE_MIN;
    // Sivu kelpaa jos hinnat loytyvat TAI otsikko yha sanoo ruokalista
    // (JS-renderoidyt sivut eivat koskaan naytaneet hintoja staattisesti).
    if (ev < min && !titleLooksLikeMenu(titleOf(body)) && !titleLooksLikeMenu(p.finalUrl)) {
      rot.push(`${label}: ei enaa ruokalista (${ev} hintaa, raja ${min}, oli ${e.evidence}) — ${p.finalUrl}`);
    }
  }
}));
process.stdout.write('\n');

console.log(`Tarkistettu ${checks.length} ruokalistaosoitetta (${Object.values(reg).filter((e) => e.url).length} ravintolaa, englanninkieliset mukaan lukien).`);
if (browserOk.length) {
  console.log(`\n${browserOk.length} estaa koneen, mutta toimi selaimessa (kirjaus vanhenee ${BROWSER_CHECK_MAX_DAYS} paivassa):`);
  browserOk.forEach((b) => console.log('  ' + b));
}
if (browserNeeded.length) {
  console.error(`\n${browserNeeded.length} estaa koneen eika selaintarkistusta ole (tai se on vanhentunut).`);
  console.error('Avaa selaimessa ja kirjaa scripts/selaintarkistukset.json:iin, tai korjaa linkki:');
  browserNeeded.forEach((b) => console.error('  ' + b));
}
if (rot.length) {
  console.error(`\n${rot.length} vaatii huomiota:`);
  rot.forEach((r) => console.error('  ' + r));
}
if (rot.length || browserNeeded.length) process.exit(1);
console.log('\nKaikki linkit ovat yha ruokalistoja.');
