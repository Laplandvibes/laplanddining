import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreCandidate, countPriceTokens, classifyKind, sameHost, titleLooksLikeMenu, isFrontPage, EVIDENCE_MIN,
} from './menu-detect.mjs';

test('kotimainen termi voittaa yleisen sanan menu', () => {
  assert.ok(scoreCandidate('/ruokalista', 'Ruokalista') > scoreCandidate('/menu', 'Menu'));
});

test('a la carte ja speisekarte tunnistetaan', () => {
  assert.ok(scoreCandidate('/a-la-carte/', 'A la carte') > 0);
  assert.ok(scoreCandidate('/speisekarte', 'Speisekarte') > 0);
});

test('navigaatiovimpain ei ole ruokalista', () => {
  assert.equal(scoreCandidate('#', 'Menu'), 0);
  assert.equal(scoreCandidate('/x', 'nav-menu toggle'), 0);
  assert.equal(scoreCandidate('/js/mobile-menu.js', ''), 0);
});

test('taysin osumaton linkki saa nollan', () => {
  assert.equal(scoreCandidate('/yhteystiedot', 'Yhteystiedot'), 0);
});

test('hintamerkinnat lasketaan suomalaisesta ja kansainvalisesta muodosta', () => {
  assert.equal(countPriceTokens('Poronkaristys 24,50 € ja lohta 29,00 € seka kahvi 4,50 €'), 3);
  assert.equal(countPriceTokens('Menu EUR 12.50 / EUR 18.00'), 2);
  assert.equal(countPriceTokens('Tervetuloa! Avoinna 11-21. Hinnat alkaen 10 euroa.'), 0);
});

// Aidosta datasta 10.8.2026: restaurantaanaar.fi/a-la-carte listaa 13 hintaa
// muodossa "KAMMI L,G (D) 18€". Ensimmainen versio vaati kaksi desimaalia ja
// hylkasi koko sivun, jolloin 33 oikeaa ruokalistaa putosi heikoiksi.
test('kokonaiseurot ovat hintoja — suomalainen ruokalista kirjoittaa 18€', () => {
  assert.equal(countPriceTokens('KAMMI L,G (D) 18€ Juutuan yo L,G 18€ vihulainen d,g,v 16€'), 3);
  assert.equal(countPriceTokens('Poronkaristys 24 € Lohi 29 €'), 2);
  assert.equal(countPriceTokens('€18 / €22'), 2);
});

test('vuosiluku ei ole hinta', () => {
  assert.equal(countPriceTokens('Perustettu 1997. Kausi 2026 €-alueella.'), 0);
});

test('sekamuodot lasketaan yhdessa', () => {
  assert.equal(countPriceTokens('Alku 12,50 € · paa 28€ · jalki EUR 9.00'), 3);
});

// Nili ja Kammi renderoivat ruokalistan JS:lla: staattisessa HTML:ssa ei ole
// yhtaan euromerkkia, mutta <title> kertoo tyypin. Sama koskee PDF-listoja,
// joiden tavuvirta on pakattu eika siita voi laskea hintoja.
test('otsikko paljastaa ruokalistan kun hintoja ei saada luettua', () => {
  assert.ok(titleLooksLikeMenu('Menu - Ravintola Nili'));
  assert.ok(titleLooksLikeMenu('Ruokalista | Gastropub Giitu'));
  assert.ok(titleLooksLikeMenu('À la carte | Restaurant Aanaar'));
  assert.ok(!titleLooksLikeMenu('Etusivu - Ravintola Nili'));
  assert.ok(!titleLooksLikeMenu('Yhteystiedot'));
  assert.ok(!titleLooksLikeMenu(''));
  assert.ok(!titleLooksLikeMenu(undefined));
});

// Koko hankkeen syy on se, etta kortti linkkasi ravintolan ETUSIVULLE.
// arcticrestaurant.fi:n etusivulla on 7 hintaa ja se lapaisi todisteportin,
// mutta "Ruokalista"-nappi joka vie etusivulle toistaisi alkuperaisen vian.
test('etusivu ei kelpaa ruokalistalinkiksi', () => {
  assert.ok(isFrontPage('https://www.arcticrestaurant.fi/'));
  assert.ok(isFrontPage('https://www.arcticrestaurant.fi'));
  assert.ok(isFrontPage('https://x.fi/?lang=fi'));
  assert.ok(!isFrontPage('https://x.fi/ruokalista'));
  assert.ok(!isFrontPage('https://x.fi/fi/menu'));
  // Ankkuri osioon on kelvollinen: se hyppaa ruokalistaan, ei sivun alkuun.
  assert.ok(!isFrontPage('https://www.arcticrestaurant.fi/#menu'));
  assert.ok(isFrontPage('https://x.fi/#'));
});

test('EVIDENCE_MIN on kolme', () => {
  assert.equal(EVIDENCE_MIN, 3);
});

test('tiedostotyyppi luokitellaan paatteesta', () => {
  assert.equal(classifyKind('https://x.fi/menu.pdf'), 'pdf');
  assert.equal(classifyKind('https://x.fi/menu.PDF?v=2'), 'pdf');
  assert.equal(classifyKind('https://x.fi/wp-content/ammila-alacarte2.jpg'), 'image');
  assert.equal(classifyKind('https://x.fi/ruokalista'), 'page');
});

test('sameHost sivuuttaa www-etuliitteen', () => {
  assert.ok(sameHost('http://www.nili.fi/', 'https://nili.fi/ruokalista'));
  assert.ok(!sameHost('https://ravintolamori.fi/', 'https://www.ruokalistasivut.fi/'));
});
