import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreCandidate, countPriceTokens, classifyKind, sameHost, EVIDENCE_MIN,
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
