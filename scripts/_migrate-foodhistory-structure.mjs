#!/usr/bin/env node
/**
 * Kertaluontoinen migraatio: /food-history tekstiseinästä luvuiksi (2026-09-07).
 *
 * MIKSI (Vesa 7.9.2026): *"en tykkää tästä kun listauksena on asioita näin. en
 * usko että tänä päivänä moni jaksa lukea."* Sivu oli kuusi identtistä lohkoa,
 * joissa kussakin 3–4 kappaletta leipätekstiä. GSC 3 kk: 494 näyttöä, 4 klikkiä.
 *
 * MITÄ TÄMÄ TEKEE — rakenne, ei sanavalinnat. Teksti EI muutu, se siirretään:
 *   1. luku 0: kaksi ensimmäistä virkettä irti p0:sta -> `figures` (8 kk, -40 C)
 *   2. luku 1: koko lukukappale p1 pois -> `figures` (6 lukua)
 *   3. luvut 2-5: p0:n ensimmäinen virke irti -> `quote` (nosto)
 *   4. kaikki luvut: uusi `title` joka KERTOO asian eikä lupaa kertoa
 *   5. uusi `chaptersLabel` lukuhakemistolle
 *
 * 🔴 Nostot LEIKATAAN leipätekstistä, ei kopioida. Muuten sama virke lukisi
 * kahdesti ja sivu pitenisi juuri siitä syystä josta Vesa valitti.
 *
 * 🔴 Jokainen uusi otsikko väittää jotain mikä on SAMAN KIELEN omassa
 * leipätekstissä. Luvun 2 otsikko ei voi olla "kalastusoikeus periytyi suvussa",
 * koska saksankielisestä versiosta se virke puuttuu kokonaan — siksi otsikko on
 * kaikilla kielillä "elävät perinteet, ei rekonstruktio", joka on kaikissa 12:ssa.
 * Samasta syystä luvun 3 otsikko sanoo saksaksi ja ranskaksi "muutama viikko",
 * muilla "kaksi viikkoa": kumpikin on se, mitä oma leipäteksti sanoo.
 *
 * Aja kerran: node scripts/_migrate-foodhistory-structure.mjs [--write]
 * Ilman --write tulostaa vain, mitä tekisi.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');

const LOCALES = ['en', 'fi', 'sv', 'de', 'fr', 'es', 'it', 'nl', 'pt-BR', 'ja', 'ko', 'zh-CN'];
const CJK_PERIOD = ['ja', 'zh-CN'];

/** Kuusi otsikkoa per kieli. Väite, ei lupaus. */
const TITLES = {
  en: [
    'Farming never worked here. Hunting, fishing and gathering did.',
    'The reindeer was never just meat',
    'These are living traditions, not re-enactments',
    "The Arctic's gold ripens for two weeks a year",
    'Noma changed how Lapland saw its own backyard',
    'For centuries the kota was home, kitchen and meeting place',
  ],
  fi: [
    'Maanviljely ei toiminut täällä. Metsästys, kalastus ja keräily toimivat.',
    'Poro ei ollut koskaan pelkkää lihaa',
    'Nämä ovat eläviä perinteitä, eivät rekonstruktioita',
    'Arktinen kulta kypsyy kaksi viikkoa vuodessa',
    'Noma muutti sen, miten Lappi katsoi omaa takapihaansa',
    'Kota oli vuosisatoja koti, keittiö ja kokoontumispaikka',
  ],
  sv: [
    'Jordbruk fungerade aldrig här. Jakt, fiske och insamling gjorde det.',
    'Renen var aldrig bara kött',
    'Det här är levande traditioner, inte rekonstruktioner',
    'Arktis guld mognar ett par veckor om året',
    'Noma ändrade hur Lappland såg på sin egen bakgård',
    'I århundraden var kåtan hem, kök och samlingsplats',
  ],
  de: [
    'Ackerbau funktionierte hier nie. Jagen, Fischen und Sammeln schon.',
    'Das Rentier war nie nur Fleisch',
    'Das sind lebendige Traditionen, keine Nachstellungen',
    'Das Gold der Arktis reift nur wenige Wochen im Jahr',
    'Noma veränderte den Blick Lapplands auf den eigenen Hinterhof',
    'Jahrhundertelang war die Kota Heim, Küche und Versammlungsort',
  ],
  fr: [
    "L'agriculture n'a jamais marché ici. La chasse, la pêche et la cueillette, oui.",
    "Le renne n'a jamais été seulement de la viande",
    'Ce sont des traditions vivantes, pas des reconstitutions',
    "L'or de l'Arctique ne mûrit que quelques semaines par an",
    "Noma a changé le regard de la Laponie sur sa propre arrière-cour",
    'Pendant des siècles, le kota fut maison, cuisine et lieu de rassemblement',
  ],
  es: [
    'La agricultura nunca funcionó aquí. La caza, la pesca y la recolección sí.',
    'El reno nunca fue solo carne',
    'Son tradiciones vivas, no recreaciones',
    'El oro del Ártico madura un par de semanas al año',
    'Noma cambió la mirada de Laponia sobre su propio patio',
    'Durante siglos el kota fue hogar, cocina y lugar de reunión',
  ],
  it: [
    "L'agricoltura qui non ha mai funzionato. La caccia, la pesca e la raccolta sì.",
    'La renna non è mai stata solo carne',
    'Sono tradizioni vive, non ricostruzioni',
    "L'oro dell'Artico matura un paio di settimane all'anno",
    'Noma ha cambiato lo sguardo della Lapponia sul proprio cortile',
    'Per secoli la kota fu casa, cucina e luogo di ritrovo',
  ],
  nl: [
    'Landbouw werkte hier nooit. Jagen, vissen en verzamelen wel.',
    'Het rendier was nooit alleen vlees',
    'Dit zijn levende tradities, geen reconstructies',
    'Het goud van de Arctis rijpt een paar weken per jaar',
    'Noma veranderde hoe Lapland naar zijn eigen achtertuin keek',
    'Eeuwenlang was de kota huis, keuken en ontmoetingsplek',
  ],
  'pt-BR': [
    'A agricultura nunca funcionou aqui. A caça, a pesca e a coleta, sim.',
    'A rena nunca foi só carne',
    'São tradições vivas, não recriações',
    'O ouro do Ártico amadurece por duas semanas no ano',
    'O Noma mudou o olhar da Lapônia sobre o próprio quintal',
    'Por séculos o kota foi lar, cozinha e ponto de encontro',
  ],
  ja: [
    '農業は成り立たなかった。狩りと漁と採集が成り立った',
    'トナカイは肉だけではなかった',
    'これは再現ではなく、生きた伝統',
    '北極圏の金は、年に二週間しか熟さない',
    'ノーマがラップランドに自分の裏庭を見直させた',
    'コタは何世紀も家であり台所であり集いの場だった',
  ],
  ko: [
    '농사는 이곳에서 통하지 않았다. 사냥과 어로와 채집이 통했다',
    '순록은 고기만이 아니었다',
    '이것은 재현이 아니라 살아 있는 전통이다',
    '북극의 황금은 1년에 두 주만 익는다',
    '노마가 라플란드에 제 뒷마당을 다시 보게 했다',
    '코타는 수 세기 동안 집이자 부엌이자 모임의 자리였다',
  ],
  'zh-CN': [
    '农耕在这里从不奏效，狩猎、捕鱼与采集才行',
    '驯鹿从来不只是肉',
    '这些不是复刻，而是活着的传统',
    '北极之金，一年只熟两周',
    'Noma 让拉普兰重新看见自家后院',
    '数百年来，kota 既是家，也是厨房和聚会之所',
  ],
};

/** Lukuhakemiston otsikko. */
const CHAPTERS_LABEL = {
  en: 'In this story',
  fi: 'Tässä tarinassa',
  sv: 'I den här berättelsen',
  de: 'In dieser Geschichte',
  fr: 'Dans ce récit',
  es: 'En esta historia',
  it: 'In questa storia',
  nl: 'In dit verhaal',
  'pt-BR': 'Nesta história',
  ja: 'この記事の内容',
  ko: '이 이야기의 구성',
  'zh-CN': '本文脉络',
};

/**
 * Luvut. `value` on kirjoitettu kunkin kielen omalla tuhaterottimella —
 * sama muoto kuin siinä leipätekstissä josta luku on nostettu.
 */
const FIGURES = {
  en: {
    0: [
      { value: '8', label: 'months of winter' },
      { value: '-40 °C', label: 'at its coldest' },
    ],
    1: [
      { value: '5,600', label: 'reindeer herders' },
      { value: '200,000', label: 'reindeer' },
      { value: '54', label: 'herding cooperatives' },
      { value: '1/3', label: 'of Finland' },
      { value: '2m kg', label: 'of meat a year' },
      { value: '€60m', label: 'a year in value' },
    ],
  },
  fi: {
    0: [
      { value: '8', label: 'kuukautta talvea' },
      { value: '-40 °C', label: 'kylmimmillään' },
    ],
    1: [
      { value: '5 600', label: 'poronhoitajaa' },
      { value: '200 000', label: 'poroa' },
      { value: '54', label: 'paliskuntaa' },
      { value: '1/3', label: 'Suomen pinta-alasta' },
      { value: '2 milj. kg', label: 'lihaa vuodessa' },
      { value: '60 M€', label: 'elinkeinon arvo vuodessa' },
    ],
  },
  sv: {
    0: [
      { value: '8', label: 'månader vinter' },
      { value: '-40 °C', label: 'som kallast' },
    ],
    1: [
      { value: '5 600', label: 'renskötare' },
      { value: '200 000', label: 'renar' },
      { value: '54', label: 'renbeteslag' },
      { value: '1/3', label: 'av Finlands yta' },
      { value: '2 milj. kg', label: 'kött per år' },
      { value: '60 mn €', label: 'i värde per år' },
    ],
  },
  de: {
    0: [
      { value: '8', label: 'Monate Winter' },
      { value: '-40 °C', label: 'an den kältesten Tagen' },
    ],
    1: [
      { value: '5.600', label: 'Rentierhalter' },
      { value: '200.000', label: 'Rentiere' },
      { value: '54', label: 'Hegegebiete' },
      { value: '1/3', label: 'der Fläche Finnlands' },
      { value: '2 Mio. kg', label: 'Fleisch pro Jahr' },
      { value: '60 Mio. €', label: 'Wert pro Jahr' },
    ],
  },
  fr: {
    0: [
      { value: '8', label: "mois d'hiver" },
      { value: '-40 °C', label: 'au plus froid' },
    ],
    1: [
      { value: '5 600', label: 'éleveurs de rennes' },
      { value: '200 000', label: 'rennes' },
      { value: '54', label: "coopératives d'élevage" },
      { value: '1/3', label: 'de la Finlande' },
      { value: '2 M kg', label: 'de viande par an' },
      { value: '60 M€', label: 'de valeur par an' },
    ],
  },
  es: {
    0: [
      { value: '8', label: 'meses de invierno' },
      { value: '-40 °C', label: 'en lo más frío' },
    ],
    1: [
      { value: '5.600', label: 'pastores de renos' },
      { value: '200.000', label: 'renos' },
      { value: '54', label: 'cooperativas de pastoreo' },
      { value: '1/3', label: 'de Finlandia' },
      { value: '2 M kg', label: 'de carne al año' },
      { value: '60 M€', label: 'de valor al año' },
    ],
  },
  it: {
    0: [
      { value: '8', label: 'mesi di inverno' },
      { value: '-40 °C', label: 'nei giorni più freddi' },
    ],
    1: [
      { value: '5.600', label: 'pastori di renne' },
      { value: '200.000', label: 'renne' },
      { value: '54', label: 'cooperative di allevamento' },
      { value: '1/3', label: 'della Finlandia' },
      { value: '2 mln kg', label: 'di carne all’anno' },
      { value: '60 mln €', label: 'di valore all’anno' },
    ],
  },
  nl: {
    0: [
      { value: '8', label: 'maanden winter' },
      { value: '-40 °C', label: 'op het koudst' },
    ],
    1: [
      { value: '5.600', label: 'rendierherders' },
      { value: '200.000', label: 'rendieren' },
      { value: '54', label: 'herderscoöperaties' },
      { value: '1/3', label: 'van Finland' },
      { value: '2 mln kg', label: 'vlees per jaar' },
      { value: '60 mln €', label: 'waarde per jaar' },
    ],
  },
  'pt-BR': {
    0: [
      { value: '8', label: 'meses de inverno' },
      { value: '-40 °C', label: 'no auge do frio' },
    ],
    1: [
      { value: '5.600', label: 'pastores de renas' },
      { value: '200.000', label: 'renas' },
      { value: '54', label: 'cooperativas de pastoreio' },
      { value: '1/3', label: 'da Finlândia' },
      { value: '2 mi kg', label: 'de carne por ano' },
      { value: '€60 mi', label: 'de valor por ano' },
    ],
  },
  ja: {
    0: [
      { value: '8', label: 'か月の冬' },
      { value: '-40 °C', label: '最も寒い日' },
    ],
    1: [
      { value: '5,600', label: '人のトナカイ放牧者' },
      { value: '200,000', label: '頭のトナカイ' },
      { value: '54', label: 'の放牧協同組合' },
      { value: '1/3', label: 'フィンランドの国土' },
      { value: '200万kg', label: 'の肉を毎年' },
      { value: '6,000万€', label: '産業の年間規模' },
    ],
  },
  ko: {
    0: [
      { value: '8', label: '개월의 겨울' },
      { value: '-40 °C', label: '가장 추울 때' },
    ],
    1: [
      { value: '5,600', label: '명의 순록 목축업자' },
      { value: '20만', label: '마리의 순록' },
      { value: '54', label: '개의 협동조합' },
      { value: '1/3', label: '핀란드 국토' },
      { value: '200만 kg', label: '연간 고기 생산량' },
      { value: '6,000만 €', label: '연간 산업 가치' },
    ],
  },
  'zh-CN': {
    0: [
      { value: '8', label: '个月的冬天' },
      { value: '-40 °C', label: '最冷时' },
    ],
    1: [
      { value: '5,600', label: '名驯鹿牧人' },
      { value: '200,000', label: '头驯鹿' },
      { value: '54', label: '个放牧合作社' },
      { value: '1/3', label: '芬兰国土' },
      { value: '200万公斤', label: '每年产肉' },
      { value: '6,000万欧元', label: '产业年产值' },
    ],
  },
};

/** Luvut, joiden nosto on p0:n ensimmäinen virke. */
const QUOTE_SECTIONS = [2, 3, 4, 5];

/** Palauttaa [ensimmäinen virke, loput]. */
function splitFirstSentence(text, locale) {
  if (CJK_PERIOD.includes(locale)) {
    const i = text.indexOf('。');
    if (i < 0) throw new Error(`ei virkerajaa (${locale}): ${text.slice(0, 40)}`);
    return [text.slice(0, i + 1).trim(), text.slice(i + 1).trim()];
  }
  const m = /[.!?]\s+/.exec(text);
  if (!m) throw new Error(`ei virkerajaa (${locale}): ${text.slice(0, 40)}`);
  const cut = m.index + m[0].length;
  return [text.slice(0, m.index + 1).trim(), text.slice(cut).trim()];
}

let failed = 0;
for (const locale of LOCALES) {
  const file = resolve(ROOT, 'src/locales', locale, 'pages.json');
  const raw = readFileSync(file, 'utf8');
  const crlf = raw.includes('\r\n');
  const json = JSON.parse(raw);
  const fh = json.foodHistory;

  if (fh.chaptersLabel) {
    console.log(`[${locale}] jo migroitu — ohitetaan`);
    continue;
  }
  if (!Array.isArray(fh.sections) || fh.sections.length !== 6) {
    console.error(`[${locale}] odotettiin 6 lukua, löytyi ${fh.sections?.length}`);
    failed++;
    continue;
  }

  console.log(`\n======== ${locale} ========`);
  fh.chaptersLabel = CHAPTERS_LABEL[locale];

  fh.sections.forEach((s, i) => {
    s.title = TITLES[locale][i];
    console.log(`  ${String(i + 1).padStart(2, '0')} ${s.title}`);
  });

  // Luku 0: kaksi ensimmäistä virkettä -> figures
  {
    const s = fh.sections[0];
    const [s1, rest1] = splitFirstSentence(s.paragraphs[0], locale);
    const [s2, rest2] = splitFirstSentence(rest1, locale);
    s.paragraphs[0] = rest2;
    s.figures = FIGURES[locale][0];
    console.log(`     luvuiksi: "${s1}" + "${s2}"`);
    console.log(`     p0 jää:   ${rest2}`);
  }

  // Luku 1: koko lukukappale p1 -> figures
  {
    const s = fh.sections[1];
    const dropped = s.paragraphs.splice(1, 1)[0];
    s.figures = FIGURES[locale][1];
    console.log(`     luvuiksi: ${dropped}`);
  }

  // Luvut 2-5: p0:n ensimmäinen virke -> quote
  for (const i of QUOTE_SECTIONS) {
    const s = fh.sections[i];
    const [first, rest] = splitFirstSentence(s.paragraphs[0], locale);
    s.quote = first;
    s.paragraphs[0] = rest;
    console.log(`     nosto ${i}: ${first}`);
    console.log(`     p0 jää:   ${rest.slice(0, 90)}…`);
  }

  if (WRITE) {
    let out = JSON.stringify(json, null, 2) + '\n';
    if (crlf) out = out.replace(/\n/g, '\r\n');
    writeFileSync(file, out, 'utf8');
  }
}

if (failed) {
  console.error(`\n${failed} kieltä epäonnistui`);
  process.exit(1);
}
console.log(WRITE ? '\nKirjoitettu.' : '\nKuivaharjoitus — aja --write kun tulos näyttää oikealta.');
