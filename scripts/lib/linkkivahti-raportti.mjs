/**
 * Ajastetun linkkivahdin (scripts/linkkivahti-ajo.mjs) puhdas logiikka: mitä
 * ilmoitetaan, milloin, ja millä sanoilla. Ei verkkoa eikä levyä, jotta
 * jokainen sääntö on testattavissa (linkkivahti-raportti.test.mjs).
 *
 * Miksi tämä on olemassa (14.11.2026): Giitun ja Nilin ruokalistanapit olivat
 * piilossa 1.–14.11., koska vahdit ajettiin vain käsin ja "1.11. hae uudet
 * osoitteet" jäi muistiinpanoksi. Vahti ajetaan nyt päivittäin, ja Vesa saa
 * viestin vain silloin, kun jokin vaatii tekoa.
 *
 * Säännöt:
 * - Verkosta mitattu vika (404, etusivulle ohjaus, ei enää ruokalista) pitää
 *   nähdä KAHTENA eri päivänä ennen ilmoitusta. Ravintolan sivu voi olla yhden
 *   yön alhaalla; se ei ole Vesan asia.
 * - Päivämäärästä johtuva löydös (voimassaolo päättyi tai päättyy, selaimella
 *   tehty tarkistus vanhenee) ilmoitetaan heti: se ei korjaannu itsestään.
 * - Ennakko: voimassaolon päättyminen 7 päivää ja selaintarkistuksen
 *   vanheneminen 14 päivää etukäteen, jotta linkki ehditään korjata ennen kuin
 *   kävijä näkee mitään.
 * - Sama avoin löydös muistutetaan kerran viikossa, ei joka päivä.
 */
import { BROWSER_CHECK_MAX_DAYS, daysBetween } from './link-watch.mjs';

/** Löydökset, jotka seuraavat kalenterista eivätkä verkon tilasta. */
export const PAIVAMAARALAJIT = new Set(['voimassaolo', 'voimassaolo-paattyy', 'selaintarkistus-vanhenee']);
/** Löydökset, jotka eivät vielä näy kävijälle (ennakkovaroitus). */
export const ENNAKKOLAJIT = new Set(['voimassaolo-paattyy', 'selaintarkistus-vanhenee']);

export const VOIMASSAOLO_ENNAKKO_PV = 7;
export const SELAIN_ENNAKKO_PV = 14;
export const MUISTUTUS_PV = 7;

const pad = (n) => String(n).padStart(2, '0');

/** YYYY-MM-DD + n päivää (UTC-laskenta: pelkkä kalenteripäivä, ei kellonaikaa). */
export function lisaaPaivia(iso, n) {
  const d = new Date(Date.parse(iso) + n * 86400000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** 2026-10-31 → 31.10.2026 */
export function fiPvm(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${m}.${y}`;
}

export function avain(l) {
  return [l.vahti, l.laji, l.slug, l.kieli ?? '', l.url].join('|');
}

/**
 * Ennakkovaroitukset rekisteristä ja selaintarkistuksista.
 *
 * - `validUntil` on tänään tai enintään 7 päivän päässä: nappi piiloutuu sen
 *   jälkeen itsestään (menuFor), joten uusi osoite haetaan ennen sitä.
 * - Selaintarkistus, johon vahti juuri nyt nojaa (estetytOk), vanhenee 14
 *   päivän sisällä. Tarkistus, jota ei enää tarvita (sivusto ei estä konetta),
 *   ei tuota varoitusta.
 */
export function ennakot({ rekisteri, estetyt, tanaan, maxDays = BROWSER_CHECK_MAX_DAYS }) {
  const out = [];
  for (const [slug, e] of Object.entries(rekisteri ?? {})) {
    if (!e?.url || !e.validUntil || !/^\d{4}-\d{2}-\d{2}$/.test(e.validUntil)) continue;
    const jaljella = daysBetween(tanaan, e.validUntil);
    if (jaljella >= 0 && jaljella <= VOIMASSAOLO_ENNAKKO_PV) {
      out.push({ vahti: 'ruokalistat', laji: 'voimassaolo-paattyy', slug, kieli: 'fi', url: e.url, validUntil: e.validUntil });
    }
  }
  for (const b of estetyt ?? []) {
    const vanhenee = lisaaPaivia(b.tarkistettu, maxDays);
    const jaljella = daysBetween(tanaan, vanhenee);
    if (jaljella >= 0 && jaljella <= SELAIN_ENNAKKO_PV) {
      out.push({ vahti: b.vahti, laji: 'selaintarkistus-vanhenee', slug: b.slug, kieli: b.kieli ?? null, url: b.url, vanhenee });
    }
  }
  return out;
}

/**
 * Onko ajo itse epäluotettava: kun iso osa osoitteista ei vastaa, vika on
 * todennäköisemmin tämän koneen verkossa kuin kymmenissä ravintoloissa.
 * Sellaista ajoa ei kirjata tilaan eikä siitä ilmoiteta.
 */
export function ajoEpaluotettava({ loydokset, tarkistettu, osuus = 0.2, vahintaan = 8 }) {
  const kuolleet = loydokset.filter((l) => l.laji === 'kuollut').length;
  return kuolleet >= vahintaan && kuolleet / Math.max(1, tarkistettu) >= osuus;
}

export function tyhjaTila() {
  return { versio: 1, loydokset: {}, viimeisinViesti: null };
}

/**
 * Yhdistää tämän ajon löydökset tilaan. Tilaan jäävät vain tänään nähdyt:
 * korjaantunut löydös putoaa pois, ja jos se palaa, laskenta alkaa alusta.
 *
 * Palauttaa { tila, vahvistetut, odottavat }. Vahvistetun löydöksen kentät
 * `ensin` (ensimmäinen havaintopäivä) ja `ilmoitettu` (päivä tai null) kulkevat
 * mukana viestiä varten.
 */
export function paivitaTila(vanha, loydokset, tanaan) {
  const edellinen = vanha?.loydokset ?? {};
  const uusi = { versio: 1, loydokset: {}, viimeisinViesti: vanha?.viimeisinViesti ?? null };
  const vahvistetut = [];
  const odottavat = [];
  for (const l of loydokset) {
    const k = avain(l);
    const p = edellinen[k];
    const rivi = { ensin: p?.ensin ?? tanaan, viimeksi: tanaan, ilmoitettu: p?.ilmoitettu ?? null };
    uusi.loydokset[k] = rivi;
    const vahva = PAIVAMAARALAJIT.has(l.laji) || rivi.ensin < tanaan;
    (vahva ? vahvistetut : odottavat).push({ ...l, avain: k, ensin: rivi.ensin, ilmoitettu: rivi.ilmoitettu });
  }
  return { tila: uusi, vahvistetut, odottavat };
}

/** 'uusi' = ilmoittamaton vahvistettu löydös · 'muistutus' = viikko edellisestä viestistä · null = ei viestiä. */
export function ilmoituksenSyy({ vahvistetut, tila, tanaan }) {
  if (!vahvistetut.length) return null;
  if (vahvistetut.some((l) => !l.ilmoitettu)) return 'uusi';
  if (!tila.viimeisinViesti || daysBetween(tila.viimeisinViesti, tanaan) >= MUISTUTUS_PV) return 'muistutus';
  return null;
}

/** Kirjaa viestin lähteneeksi: nämä löydökset on nyt ilmoitettu. */
export function kuittaa(tila, avaimet, tanaan) {
  const out = { ...tila, loydokset: { ...tila.loydokset }, viimeisinViesti: tanaan };
  for (const k of avaimet) {
    if (out.loydokset[k]) out.loydokset[k] = { ...out.loydokset[k], ilmoitettu: out.loydokset[k].ilmoitettu ?? tanaan };
  }
  return out;
}

/**
 * slug → { nimi, paikka } Maps-datasta ja gemseistä. Viestissä puhutaan
 * ravintolan nimellä, ei slugilla.
 */
export function nimikartta(mapsList, gemsSrc) {
  const out = new Map();
  for (const r of mapsList ?? []) {
    if (r?.slug && r.name) out.set(r.slug, { nimi: r.name, paikka: r.city ?? null });
  }
  const kentta = (osa, nimi) => {
    const m = osa.match(new RegExp(`\\b${nimi}:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`));
    return m ? m[2].replace(/\\(['"])/g, '$1') : null;
  };
  for (const osa of (gemsSrc ?? '').split(/\n {2}\{\r?\n/).slice(1)) {
    const slug = kentta(osa, 'slug');
    const nimi = kentta(osa, 'name');
    if (slug && nimi) out.set(slug, { nimi, paikka: kentta(osa, 'locality') ?? kentta(osa, 'city') });
  }
  return out;
}

function kuka(l, nimet) {
  const n = nimet.get(l.slug);
  if (!n) return l.slug;
  return n.paikka ? `${n.nimi} (${n.paikka})` : n.nimi;
}

/** HTTP-koodi tai verkkovirhe selkokielellä. */
function vikaSelko(tila) {
  const http = String(tila ?? '').match(/^HTTP (\d{3})$/);
  if (http) {
    const c = Number(http[1]);
    if (c === 404 || c === 410) return `virhe ${c}: sivua ei enää ole`;
    if (c === 401 || c === 403) return `virhe ${c}: sivu ei päästä sisään`;
    if (c >= 500) return `palvelinvirhe ${c}`;
    return `virhe ${c}`;
  }
  if (/ENOTFOUND|EAI_AGAIN/.test(tila)) return 'verkko-osoitetta ei löydy';
  if (/Timeout|ETIMEDOUT/i.test(tila)) return 'sivu ei vastannut 20 sekunnissa';
  if (/CERT|SSL|TLS/i.test(tila)) return 'sivuston varmenne on viallinen';
  return `yhteys ei onnistu (${tila})`;
}

/** Yksi löydös yhdeksi virkkeeksi: mitä kävijä näkee ja miksi. */
export function selitys(l) {
  const lista = l.kieli === 'en' ? 'englanninkielisen ruokalistan' : 'ruokalistan';
  const mika = l.vahti === 'verkkosivut' ? 'Kortin Nettisivut-linkki' : `${lista[0].toUpperCase()}${lista.slice(1)} linkki`;
  switch (l.laji) {
    case 'kuollut':
      return `${mika} ei toimi (${vikaSelko(l.tila)}).`;
    case 'etusivulle':
      return `${mika} vie nyt ravintolan etusivulle eikä ruokalistaan.`;
    case 'ei-ruokalista':
      return `${mika} aukeaa, mutta sivulla ei enää ole ruokalistaa.`;
    case 'ei-pdf':
      return `${mika} ei enää avaa PDF-tiedostoa.`;
    case 'voimassaolo':
      return `Ruokalistanappi on piilossa sivustolta, koska listan viimeinen voimassaolopäivä ${fiPvm(l.validUntil)} on mennyt.`;
    case 'voimassaolo-paattyy':
      return `Ruokalistanappi piiloutuu sivustolta, kun listan voimassaolo päättyy ${fiPvm(l.validUntil)}.`;
    case 'selaintarkistus':
      return `${mika} pitää avata selaimessa: sivusto estää koneellisen tarkistuksen, eikä voimassa olevaa selaintarkistusta ole.`;
    case 'selaintarkistus-vanhenee':
      return `${mika}: selaimella tehty tarkistus vanhenee ${fiPvm(l.vanhenee)}. Sivusto estää koneellisen tarkistuksen, joten sen jälkeen vahti ei tiedä, toimiiko linkki.`;
    default:
      return `${mika}: ${l.laji}.`;
  }
}

const linkkia = (n) => (n === 1 ? 'yksi linkki' : `${n} linkkiä`);

function nimilista(loydokset, nimet, max = 3) {
  const uniikit = [...new Set(loydokset.map((l) => nimet.get(l.slug)?.nimi ?? l.slug))];
  const alku = uniikit.slice(0, max).join(', ');
  return uniikit.length > max ? `${alku} + ${uniikit.length - max} muuta` : alku;
}

/**
 * Viesti Vesalle. Muoto on send_report_to_vesa.py:n: tyhjä rivi erottaa
 * kappaleet, "- " on luettelo, "## " väliotsikko.
 *
 * `tarkistettu` = { ruokalistat: n, verkkosivut: n }.
 */
export function viesti({ vahvistetut, syy, tanaan, nimet, tarkistettu }) {
  const rikki = vahvistetut.filter((l) => !ENNAKKOLAJIT.has(l.laji));
  const tulossa = vahvistetut.filter((l) => ENNAKKOLAJIT.has(l.laji));
  const uudet = rikki.filter((l) => !l.ilmoitettu);
  const vanhat = rikki.filter((l) => l.ilmoitettu);

  let otsikko;
  if (rikki.length) {
    const tila = syy === 'muistutus' ? 'yhä korjaamatta' : 'vaatii korjauksen';
    otsikko = `LaplandDining: ${linkkia(rikki.length)} ${tila} (${nimilista(rikki, nimet)})`;
  } else {
    otsikko = `LaplandDining: ${linkkia(tulossa.length)} menossa rikki (${nimilista(tulossa, nimet)})`;
  }

  const rivi = (l, lisa = '') => `- ${kuka(l, nimet)}. ${selitys(l)}${lisa} Osoite: ${l.url}`;
  const osat = [];

  if (rikki.length) {
    const alku = rikki.length === 1
      ? 'Laplanddining.comin ravintolakorteissa on yksi linkki, joka ei vie kävijää oikeaan paikkaan.'
      : `Laplanddining.comin ravintolakorteissa on ${rikki.length} linkkiä, jotka eivät vie kävijää oikeaan paikkaan.`;
    const lisa = tulossa.length ? ` Lisäksi ${linkkia(tulossa.length)} on menossa rikki lähipäivinä.` : '';
    osat.push(alku + lisa);
  } else {
    osat.push(tulossa.length === 1
      ? 'Laplanddining.comissa yksi linkki menee rikki lähipäivinä, jos sille ei tehdä mitään. Kävijä ei vielä näe vikaa.'
      : `Laplanddining.comissa ${tulossa.length} linkkiä menee rikki lähipäivinä, jos niille ei tehdä mitään. Kävijä ei vielä näe vikaa.`);
  }

  const ryhmia = [uudet, vanhat, tulossa].filter((r) => r.length).length;
  if (uudet.length) {
    if (ryhmia > 1) osat.push('## Uudet');
    osat.push(uudet.map((l) => rivi(l)).join('\n'));
  }
  if (vanhat.length) {
    if (ryhmia > 1) osat.push('## Yhä korjaamatta');
    osat.push(vanhat.map((l) => rivi(l, ` Ilmoitettu ensimmäisen kerran ${fiPvm(l.ilmoitettu)}.`)).join('\n'));
  }
  if (tulossa.length) {
    if (ryhmia > 1) osat.push('## Menossa rikki');
    osat.push(tulossa.map((l) => rivi(l)).join('\n'));
  }

  osat.push('## Mitä tehdä');
  osat.push('Korjaus on Clauden työ. Avaa laplandvibes-projektissa uusi keskustelu ja liitä siihen tämä lause: Korjaa laplanddiningin linkkivahdin löydökset.');
  osat.push('Claude hakee uudet osoitteet ravintoloiden omilta sivuilta, päivittää ne sivustolle ja julkaisee muutoksen.');

  const muut = tarkistettu
    ? `Tarkistettu ${fiPvm(tanaan)}: ${tarkistettu.ruokalistat} ruokalistalinkkiä ja ${tarkistettu.verkkosivut} verkkosivulinkkiä. Muut toimivat.`
    : `Tarkistettu ${fiPvm(tanaan)}.`;
  osat.push(`${muut} Vahti tarkistaa linkit joka päivä ja muistuttaa näistä viikon päästä, jos ne ovat yhä auki.`);

  return { otsikko, teksti: osat.join('\n\n') + '\n' };
}
