/**
 * Yhteiset palat linkkivahdeille (check-menu-links.mjs, check-website-links.mjs).
 *
 * Miksi tama on olemassa (20.10.2026): kuukausivahdit raportoivat 16
 * "rikkinaista" linkkia, ja niista vain osa oli oikeasti rikki.
 *
 * - Bottiesto naytti vialta. raflaamo.fi ja laplandhotels.com vastaavat
 *   koneelle 429, muotkanruoktu.fi Cloudflaren 520, ja fieno.fi seka
 *   skisaariselka.com katkaisevat TLS-yhteyden kesken. Kaikki viisi aukesivat
 *   selaimessa normaalisti. Estetty vastaus ei kerro sivusta mitaan, joten se
 *   ei ole vika eika kunnossa: se on "tarkista selaimella".
 * - Piilotettu ravintola (permanentlyClosed) oli yha listalla, koska vahti ei
 *   lukenut lippua.
 * - Overrides-merkinta jossa on sisakkainen objekti (curatedDescription) luettiin
 *   `[^}]*`-lausekkeella, joka pysahtyi ensimmaiseen `}`-merkkiin. Sataman
 *   Krouwin `website: undefined` jai lukematta ja vahti tarkisti linkin jota
 *   sivulla ei ole.
 */
import fs from 'node:fs';

export const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Selaintarkistus vanhenee, koska sivu voi kuolla sen jalkeen. */
export const BROWSER_CHECK_MAX_DAYS = 92;

/**
 * Overrides-tiedoston merkinnat lohkorajoilla, ei `[^}]*?`:lla.
 * Sama jako kuin check-city-copy.mjs:ssa: merkinta alkaa rivin alusta kahden
 * valilyonnin sisennyksella ja Place ID:lla.
 *
 * Palauttaa Map: placeId -> { closed, hasWebsite, website }.
 * `hasWebsite` erottaa "ei koskettu" (Maps-arvo jaa voimaan) ja
 * "website: undefined" (linkki poistettu).
 */
export function parseOverrides(src) {
  const out = new Map();
  for (const osa of src.split(/\n {2}'(?=[A-Za-z0-9_-]{20,}':)/)) {
    const id = osa.match(/^([A-Za-z0-9_-]{20,})':/);
    if (!id) continue;
    // Merkinta paattyy seuraavaan sisentamattomaan kommenttiriviin tai
    // tiedoston loppuun; seuraavan merkinnan Place ID on jo jaettu pois.
    const body = osa.split(/\n {2}\/\/|\n};/)[0];
    const closed = /\bpermanentlyClosed:\s*true\b/.test(body);
    let hasWebsite = false;
    let website = null;
    if (/\bwebsite:\s*undefined\b/.test(body)) hasWebsite = true;
    else {
      const m = body.match(/\bwebsite:\s*'([^']+)'/);
      if (m) { hasWebsite = true; website = m[1]; }
    }
    out.set(id[1], { closed, hasWebsite, website });
  }
  return out;
}

/** Gemsien (kasin kuratoidut, restaurant-gems.ts) slug + website. */
export function parseGems(src) {
  const out = [];
  for (const osa of src.split(/\n {2}\{\r?\n/).slice(1)) {
    const slug = osa.match(/\bslug:\s*'([^']+)'/);
    const website = osa.match(/\bwebsite:\s*'([^']+)'/);
    if (slug) out.push({ slug: slug[1], url: website?.[1] ?? null });
  }
  return out;
}

/**
 * Onko vastaus bottiesto eika tieto sivusta.
 *
 * 429 = liikaa pyyntoja / bottisuoja. 520–530 = Cloudflaren alkuperapalvelin-
 * virheet, joita mitattiin 20.10.2026 vain koneelle (selain sai sivun).
 * Yhteys joka katkeaa TLS-kattelyssa (UND_ERR_SOCKET, ECONNRESET) on fieno.fi:n
 * ja skisaariselka.com:n tapa torjua kone.
 *
 * EI bottiestoa: 404, 410, DNS-virhe (ENOTFOUND). Ne kertovat sivusta.
 */
export function isBotBlock({ status, errorCode } = {}) {
  if (status === 429) return true;
  if (status >= 520 && status <= 530) return true;
  if (errorCode && /^(UND_ERR_SOCKET|ECONNRESET|EPIPE)$/.test(errorCode)) return true;
  return false;
}

/**
 * Hakee osoitteen. Yksi uusinta verkkovirheelle ja palvelinvirheelle
 * (500–504): 20.10.2026 ajossa kymmenen toimivaa sivua antoi TypeErrorin
 * samaan aikaan kun koneella ajettiin npm ci, ja eatlappi.fi vastasi kerran
 * 503. Kaikki vastasivat heti uudelleen. Toistuva virhe raportoidaan.
 */
export async function probe(url) {
  let last = { ok: false, status: 0, errorCode: 'UNKNOWN' };
  for (let yritys = 0; yritys < 2; yritys++) {
    if (yritys > 0) await new Promise((r) => setTimeout(r, 3000));
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'fi,en;q=0.8' },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
      });
      last = { ok: res.ok, status: res.status, finalUrl: res.url, res };
      if (res.status >= 500 && res.status <= 504 && yritys === 0) {
        await res.body?.cancel();
        continue;
      }
      return last;
    } catch (err) {
      last = { ok: false, status: 0, errorCode: err.cause?.code ?? err.name };
    }
  }
  return last;
}

/** Selaimella tarkistetut osoitteet: url -> { checked: 'YYYY-MM-DD', note }. */
export function readBrowserChecks(file) {
  if (!fs.existsSync(file)) return {};
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return raw.urls ?? {};
}

export function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

/**
 * Kelpaako selaintarkistus viela. Palauttaa tarkistuspaivan tai null.
 * Kirjaus koskee vain tasmalleen samaa osoitetta: toisen sivun tarkistus
 * samalla domainilla ei todista tasta mitaan.
 */
export function validBrowserCheck(checks, url, today, maxDays = BROWSER_CHECK_MAX_DAYS) {
  const c = checks[url];
  if (!c?.checked || !/^\d{4}-\d{2}-\d{2}$/.test(c.checked)) return null;
  const age = daysBetween(c.checked, today);
  return age >= 0 && age <= maxDays ? c.checked : null;
}

/** Paikallinen paiva muodossa YYYY-MM-DD (ei UTC: Suomessa vuorokausi vaihtuu 2–3 h aiemmin). */
export function todayIso(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Onko rekisterin `validUntil` (viimeinen voimassaolopaiva) ohitettu. */
export function isExpired(validUntil, today) {
  return Boolean(validUntil) && today > validUntil;
}
