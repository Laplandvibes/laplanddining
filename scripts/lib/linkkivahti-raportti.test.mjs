import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  avain, ennakot, ajoEpaluotettava, tyhjaTila, paivitaTila, ilmoituksenSyy, kuittaa, nimikartta, viesti, selitys,
  lisaaPaivia, fiPvm,
} from './linkkivahti-raportti.mjs';

const kuollut = { vahti: 'ruokalistat', laji: 'kuollut', slug: 'rovaniemi-arctic-river-resort', kieli: 'fi', url: 'https://arr.example/menu.pdf', tila: 'HTTP 404' };
const vanhentunut = { vahti: 'ruokalistat', laji: 'voimassaolo', slug: 'inari-giitu', kieli: 'fi', url: 'https://giitu.example/lokakuu', validUntil: '2026-10-31' };
const nimet = new Map([
  ['rovaniemi-arctic-river-resort', { nimi: 'Arctic River Resort', paikka: 'Rovaniemi' }],
  ['inari-giitu', { nimi: 'Giitu', paikka: 'Inari' }],
]);

test('verkosta mitattu vika ilmoitetaan vasta toisena päivänä', () => {
  const eka = paivitaTila(tyhjaTila(), [kuollut], '2026-11-13');
  assert.equal(eka.vahvistetut.length, 0);
  assert.equal(eka.odottavat.length, 1);
  assert.equal(ilmoituksenSyy({ vahvistetut: eka.vahvistetut, tila: eka.tila, tanaan: '2026-11-13' }), null);

  const toka = paivitaTila(eka.tila, [kuollut], '2026-11-14');
  assert.equal(toka.vahvistetut.length, 1);
  assert.equal(toka.vahvistetut[0].ensin, '2026-11-13');
  assert.equal(ilmoituksenSyy({ vahvistetut: toka.vahvistetut, tila: toka.tila, tanaan: '2026-11-14' }), 'uusi');
});

test('kaksi ajoa samana päivänä ei vahvista vikaa', () => {
  const eka = paivitaTila(tyhjaTila(), [kuollut], '2026-11-13');
  const toka = paivitaTila(eka.tila, [kuollut], '2026-11-13');
  assert.equal(toka.vahvistetut.length, 0);
});

test('yhden yön katko ei tuota viestiä: korjaantunut löydös putoaa tilasta ja laskenta alkaa alusta', () => {
  const eka = paivitaTila(tyhjaTila(), [kuollut], '2026-11-13');
  const toka = paivitaTila(eka.tila, [], '2026-11-14');
  assert.deepEqual(toka.tila.loydokset, {});
  const kolmas = paivitaTila(toka.tila, [kuollut], '2026-11-15');
  assert.equal(kolmas.vahvistetut.length, 0);
});

test('päivämäärästä johtuva löydös ilmoitetaan heti', () => {
  const r = paivitaTila(tyhjaTila(), [vanhentunut], '2026-11-01');
  assert.equal(r.vahvistetut.length, 1);
  assert.equal(ilmoituksenSyy({ vahvistetut: r.vahvistetut, tila: r.tila, tanaan: '2026-11-01' }), 'uusi');
});

test('ilmoitetusta muistutetaan viikon päästä, ei joka päivä; uusi löydös ilmoitetaan heti', () => {
  let { tila, vahvistetut } = paivitaTila(tyhjaTila(), [vanhentunut], '2026-11-01');
  tila = kuittaa(tila, vahvistetut.map((l) => l.avain), '2026-11-01');
  assert.equal(tila.viimeisinViesti, '2026-11-01');

  for (const paiva of ['2026-11-02', '2026-11-05', '2026-11-07']) {
    const r = paivitaTila(tila, [vanhentunut], paiva);
    assert.equal(ilmoituksenSyy({ vahvistetut: r.vahvistetut, tila: r.tila, tanaan: paiva }), null, paiva);
    tila = r.tila;
  }
  const viikko = paivitaTila(tila, [vanhentunut], '2026-11-08');
  assert.equal(ilmoituksenSyy({ vahvistetut: viikko.vahvistetut, tila: viikko.tila, tanaan: '2026-11-08' }), 'muistutus');
  assert.equal(viikko.vahvistetut[0].ilmoitettu, '2026-11-01');

  const uusiVika = paivitaTila(paivitaTila(tila, [vanhentunut, kuollut], '2026-11-03').tila, [vanhentunut, kuollut], '2026-11-04');
  assert.equal(ilmoituksenSyy({ vahvistetut: uusiVika.vahvistetut, tila: uusiVika.tila, tanaan: '2026-11-04' }), 'uusi');
});

test('kuittaus ei siirrä ensimmäistä ilmoituspäivää', () => {
  let { tila, vahvistetut } = paivitaTila(tyhjaTila(), [vanhentunut], '2026-11-01');
  tila = kuittaa(tila, vahvistetut.map((l) => l.avain), '2026-11-01');
  tila = kuittaa(tila, [avain(vanhentunut)], '2026-11-08');
  assert.equal(tila.loydokset[avain(vanhentunut)].ilmoitettu, '2026-11-01');
  assert.equal(tila.viimeisinViesti, '2026-11-08');
});

test('ennakko: voimassaolo 7 päivää etukäteen, ei aiemmin eikä päättymisen jälkeen', () => {
  const rekisteri = { 'inari-giitu': { url: 'https://giitu.example/lokakuu', validUntil: '2026-10-31' } };
  assert.equal(ennakot({ rekisteri, estetyt: [], tanaan: '2026-10-23' }).length, 0);
  const e = ennakot({ rekisteri, estetyt: [], tanaan: '2026-10-24' });
  assert.equal(e.length, 1);
  assert.equal(e[0].laji, 'voimassaolo-paattyy');
  assert.equal(ennakot({ rekisteri, estetyt: [], tanaan: '2026-10-31' }).length, 1);
  assert.equal(ennakot({ rekisteri, estetyt: [], tanaan: '2026-11-01' }).length, 0); // nyt vahdin oma "voimassaolo"
});

test('ennakko: selaintarkistus 14 päivää ennen vanhenemista, vain tarkistuksille joihin vahti nojaa', () => {
  const estetyt = [{ vahti: 'verkkosivut', slug: 'saariselka-fieno', kieli: null, url: 'https://fieno.fi/', tila: 'UND_ERR_SOCKET', tarkistettu: '2026-10-20' }];
  assert.equal(lisaaPaivia('2026-10-20', 92), '2027-01-20');
  assert.equal(ennakot({ rekisteri: {}, estetyt, tanaan: '2027-01-05' }).length, 0);
  const e = ennakot({ rekisteri: {}, estetyt, tanaan: '2027-01-06' });
  assert.equal(e.length, 1);
  assert.equal(e[0].vanhenee, '2027-01-20');
  assert.equal(ennakot({ rekisteri: {}, estetyt: [], tanaan: '2027-01-10' }).length, 0);
});

test('epäluotettava ajo: iso osa osoitteista ei vastaa', () => {
  const monta = Array.from({ length: 40 }, (_, i) => ({ ...kuollut, url: `https://x.example/${i}`, tila: 'ENOTFOUND' }));
  assert.equal(ajoEpaluotettava({ loydokset: monta, tarkistettu: 155 }), true);
  assert.equal(ajoEpaluotettava({ loydokset: monta.slice(0, 7), tarkistettu: 155 }), false);
  assert.equal(ajoEpaluotettava({ loydokset: [vanhentunut, vanhentunut], tarkistettu: 4 }), false);
});

test('nimikartta lukee Maps-datan ja gemsit, myös heittomerkin nimessä ja locality-kentän', () => {
  const gems = [
    'export const gems = [',
    '  {',
    "    name: 'O\\'Learys Kuusamo',",
    "    city: 'Kuusamo',",
    "    slug: 'kuusamo-olearys',",
    '  },',
    '  {',
    '    name: "Riipisen Riistaravintola",',
    "    city: 'Kuusamo',",
    "    locality: 'Ruka',",
    "    slug: 'ruka-riipisen',",
    '  },',
    '];',
  ].join('\r\n');
  const m = nimikartta([{ slug: 'inari-giitu', name: 'Giitu', city: 'Inari' }], gems);
  assert.deepEqual(m.get('inari-giitu'), { nimi: 'Giitu', paikka: 'Inari' });
  assert.deepEqual(m.get('kuusamo-olearys'), { nimi: "O'Learys Kuusamo", paikka: 'Kuusamo' });
  assert.deepEqual(m.get('ruka-riipisen'), { nimi: 'Riipisen Riistaravintola', paikka: 'Ruka' });
});

test('viesti puhuu ravintolan nimellä, kertoo mitä tehdä ja käyttää oikeita kirjaimia', () => {
  const vahvistetut = [
    { ...vanhentunut, avain: avain(vanhentunut), ensin: '2026-11-01', ilmoitettu: null },
    { ...kuollut, avain: avain(kuollut), ensin: '2026-11-13', ilmoitettu: null },
  ];
  const v = viesti({ vahvistetut, syy: 'uusi', tanaan: '2026-11-14', nimet, tarkistettu: { ruokalistat: 73, verkkosivut: 82 } });
  assert.equal(v.otsikko, 'LaplandDining: 2 linkkiä vaatii korjauksen (Giitu, Arctic River Resort)');
  assert.match(v.teksti, /- Giitu \(Inari\)\. Ruokalistanappi on piilossa sivustolta, koska listan viimeinen voimassaolopäivä 31\.10\.2026 on mennyt\. Osoite: https:\/\/giitu\.example\/lokakuu/);
  assert.match(v.teksti, /- Arctic River Resort \(Rovaniemi\)\. Ruokalistan linkki ei toimi \(virhe 404: sivua ei enää ole\)\./);
  assert.match(v.teksti, /## Mitä tehdä/);
  assert.match(v.teksti, /Korjaa laplanddiningin linkkivahdin löydökset\./);
  assert.match(v.teksti, /73 ruokalistalinkkiä ja 82 verkkosivulinkkiä/);
  assert.doesNotMatch(v.teksti, /inari-giitu|rovaniemi-arctic-river-resort/); // ei slugeja
  assert.doesNotMatch(v.teksti, /## Uudet/); // yksi ryhmä ei tarvitse väliotsikkoa
  assert.doesNotMatch(v.teksti, /\bpaattyi|\bloydos|\bestaa\b/); // ei ääkkösetöntä suomea
  assert.doesNotMatch(v.teksti, /\|/); // pystyviiva muuttuisi sähköpostissa taulukoksi
});

test('muistutus erottaa uudet, jo ilmoitetut ja ennakot', () => {
  const tulossa = { vahti: 'verkkosivut', laji: 'selaintarkistus-vanhenee', slug: 'saariselka-fieno', kieli: null, url: 'https://fieno.fi/', vanhenee: '2027-01-20' };
  const vahvistetut = [
    { ...vanhentunut, avain: avain(vanhentunut), ensin: '2026-11-01', ilmoitettu: '2026-11-01' },
    { ...kuollut, avain: avain(kuollut), ensin: '2026-11-13', ilmoitettu: null },
    { ...tulossa, avain: avain(tulossa), ensin: '2026-11-14', ilmoitettu: null },
  ];
  const v = viesti({ vahvistetut, syy: 'uusi', tanaan: '2026-11-14', nimet, tarkistettu: { ruokalistat: 73, verkkosivut: 82 } });
  assert.match(v.teksti, /## Uudet\n\n- Arctic River Resort/);
  assert.match(v.teksti, /## Yhä korjaamatta\n\n- Giitu \(Inari\)\..*Ilmoitettu ensimmäisen kerran 1\.11\.2026\./);
  assert.match(v.teksti, /## Menossa rikki\n\n- saariselka-fieno\. Kortin Nettisivut-linkki: selaimella tehty tarkistus vanhenee 20\.1\.2027/);
  assert.match(v.teksti, /Lisäksi yksi linkki on menossa rikki lähipäivinä\./);

  const pelkkaMuistutus = viesti({ vahvistetut: [vahvistetut[0]], syy: 'muistutus', tanaan: '2026-11-08', nimet, tarkistettu: null });
  assert.equal(pelkkaMuistutus.otsikko, 'LaplandDining: yksi linkki yhä korjaamatta (Giitu)');

  const pelkkaEnnakko = viesti({ vahvistetut: [vahvistetut[2]], syy: 'uusi', tanaan: '2027-01-06', nimet, tarkistettu: null });
  assert.equal(pelkkaEnnakko.otsikko, 'LaplandDining: yksi linkki menossa rikki (saariselka-fieno)');
  assert.match(pelkkaEnnakko.teksti, /Kävijä ei vielä näe vikaa\./);
});

test('selitys kattaa jokaisen lajin, jonka vahdit tuottavat', () => {
  const p = { vahti: 'ruokalistat', slug: 's', kieli: 'en', url: 'https://x.example/' };
  assert.match(selitys({ ...p, laji: 'kuollut', tila: 'ENOTFOUND' }), /^Englanninkielisen ruokalistan linkki ei toimi \(verkko-osoitetta ei löydy\)\.$/);
  assert.match(selitys({ ...p, laji: 'kuollut', tila: 'TimeoutError' }), /ei vastannut 20 sekunnissa/);
  assert.match(selitys({ ...p, laji: 'kuollut', tila: 'HTTP 503' }), /palvelinvirhe 503/);
  assert.match(selitys({ ...p, laji: 'etusivulle', finalUrl: 'https://x.example/' }), /vie nyt ravintolan etusivulle/);
  assert.match(selitys({ ...p, laji: 'ei-ruokalista', hintoja: 0, raja: 3 }), /ei enää ole ruokalistaa/);
  assert.match(selitys({ ...p, laji: 'ei-pdf', tila: 'text/html' }), /PDF-tiedostoa/);
  assert.match(selitys({ ...p, laji: 'selaintarkistus', tila: 'HTTP 429' }), /pitää avata selaimessa/);
  assert.match(selitys({ ...p, laji: 'voimassaolo-paattyy', validUntil: '2026-12-25' }), /päättyy 25\.12\.2026/);
  assert.match(selitys({ vahti: 'verkkosivut', slug: 's', kieli: null, url: 'u', laji: 'kuollut', tila: 'HTTP 404' }), /^Kortin Nettisivut-linkki ei toimi/);
  assert.equal(fiPvm('2026-01-05'), '5.1.2026');
});
