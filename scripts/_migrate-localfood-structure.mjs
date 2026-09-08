#!/usr/bin/env node
/**
 * Kertaluontoinen migraatio: /local-food samaan lukurakenteeseen kuin
 * /food-history (2026-09-08).
 *
 * MIKSI: Vesa pyysi ruokahistorian ilmeen myös Paikalliseen ruokaan. Sivun
 * osiot olivat TÄSMÄLLEEN sama vanha kuvio: kuvakaista, ikonilaatikko +
 * 3xl-otsikko, kolme kappaletta leipätekstiä — neljä kertaa peräkkäin.
 *
 * MITÄ TÄMÄ TEKEE — rakenne, ei sanavalinnat. Teksti EI muutu, se siirretään:
 *   1. jokainen osio: p0:n yksi virke irti -> `quote` (nosto)
 *   2. jokainen osio: uusi `title` joka KERTOO asian eikä lupaa kertoa
 *   3. uusi `chaptersLabel` lukuhakemistolle (sama sanamuoto kuin ruokahistoria)
 *
 * 🔴 Nostot LEIKATAAN leipätekstistä, ei kopioida.
 *
 * 🔴 Jokainen otsikko väittää jotain mikä on SAMAN KIELEN omassa
 * leipätekstissä. Kaikki neljä väitettä tarkistettiin kieli kerrallaan
 * renderöimättömästä datasta ennen kirjoittamista — ei käännetty englannista.
 *
 * 🔴 Luvun 1 nosto on p0:n TOINEN virke, ei ensimmäinen. Ensimmäinen
 * ("loppukesän metsä on käytännössä ruokakauppa") on lähes sama lause kuin
 * ruokahistorian luvun 4 nosto, ja kaksi peräkkäistä alasivua näyttäisi saman
 * lauseen isolla. Toinen virke ("jokainen suomalainen oppii poimimaan ennen
 * kuin oppii ajamaan") on omaleimaisempi ja se on kaikissa 12 kielessä.
 *
 * Aja kerran: node scripts/_migrate-localfood-structure.mjs [--write]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');
const LOCALES = ['en', 'fi', 'sv', 'de', 'fr', 'es', 'it', 'nl', 'pt-BR', 'ja', 'ko', 'zh-CN'];
const CJK = ['ja', 'zh-CN'];

/** Neljä otsikkoa per kieli. Väite, ei nimilappu. */
const TITLES = {
  en: [
    'Anyone may pick anywhere, whoever owns the land',
    'Nets in the morning, soup on the table by evening',
    'No grain-fed animal comes close',
    'A wild bilberry carries 3–4× the anthocyanins of a cultivated one',
  ],
  fi: [
    'Kuka tahansa saa poimia missä tahansa, omisti maan kuka hyvänsä',
    'Verkot aamulla, keitto pöydässä illalla',
    'Mikään viljalla ruokittu eläin ei pääse lähellekään',
    'Villimustikassa on 3–4 kertaa enemmän antosyaaneja kuin viljellyssä',
  ],
  sv: [
    'Vem som helst får plocka var som helst, oavsett vem som äger marken',
    'Nät på morgonen, soppa på bordet till kvällen',
    'Inget spannmålsuppfött djur kommer i närheten',
    'Ett vilt blåbär har 3–4 gånger mer antocyaniner än ett odlat',
  ],
  de: [
    'Jede Person darf überall sammeln, egal wem das Land gehört',
    'Netze am Morgen, Suppe am Abend',
    'Kein getreidegefüttertes Tier kommt da heran',
    'Eine Wildheidelbeere hat drei- bis viermal mehr Anthocyane als eine kultivierte',
  ],
  fr: [
    'Chacun peut cueillir partout, quel que soit le propriétaire',
    'Filets le matin, soupe sur la table le soir',
    "Aucun animal nourri au grain n'en approche",
    'Une myrtille sauvage contient 3 à 4 fois plus d’anthocyanes qu’une cultivée',
  ],
  es: [
    'Cualquiera puede recolectar en cualquier lugar, sea de quien sea la tierra',
    'Las redes por la mañana, la sopa en la mesa al anochecer',
    'Ningún animal alimentado con grano se le acerca',
    'Un arándano silvestre tiene de 3 a 4 veces más antocianinas que uno cultivado',
  ],
  it: [
    'Chiunque può raccogliere ovunque, chiunque sia il proprietario',
    'Reti al mattino, zuppa in tavola entro sera',
    'Nessun animale alimentato a granaglie le si avvicina',
    'Un mirtillo selvatico ha 3–4 volte più antociani di uno coltivato',
  ],
  nl: [
    'Iedereen mag overal plukken, wie de grond ook bezit',
    "Netten 's ochtends, soep 's avonds op tafel",
    'Geen graangevoerd dier komt in de buurt',
    'Een wilde bosbes bevat 3–4 keer meer anthocyanen dan een gekweekte',
  ],
  'pt-BR': [
    'Qualquer pessoa pode colher em qualquer lugar, seja de quem for a terra',
    'As redes pela manhã, a sopa na mesa ao anoitecer',
    'Nenhum animal alimentado com grão chega perto',
    'Um mirtilo silvestre tem de 3 a 4 vezes mais antocianinas que um cultivado',
  ],
  ja: [
    '土地の所有者に関わらず、誰でもどこでも摘める',
    '朝に網を投げ、夕方には食卓にスープ',
    '穀物飼育の家畜では到底及ばない',
    '野生のビルベリーは栽培ブルーベリーの3〜4倍のアントシアニン',
  ],
  ko: [
    '땅 주인이 누구든, 누구나 어디서나 딸 수 있다',
    '아침에 그물을 내리고, 저녁에 수프가 식탁에 오른다',
    '곡물 사료를 먹은 가축은 근처에도 미치지 못한다',
    '야생 빌베리는 재배 블루베리보다 안토시아닌이 3–4배 많다',
  ],
  'zh-CN': [
    '不论土地属于谁，人人都可以采摘',
    '清晨下网，傍晚汤已上桌',
    '谷饲牲畜无从相比',
    '野生越橘的花青素是栽培蓝莓的 3 到 4 倍',
  ],
};

/** Monesko virke p0:sta nostetaan. Luku 1 = toinen virke, muut = ensimmäinen. */
const QUOTE_SENTENCE = [2, 1, 1, 1];

function splitSentences(text, locale) {
  if (CJK.includes(locale)) {
    const parts = text.split('。').filter((s) => s.trim());
    return parts.map((s, i) => (i < parts.length ? s.trim() + '。' : s.trim()));
  }
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

let failed = 0;
for (const locale of LOCALES) {
  const file = resolve(ROOT, 'src/locales', locale, 'pages.json');
  const raw = readFileSync(file, 'utf8');
  const crlf = raw.includes('\r\n');
  const json = JSON.parse(raw);
  const lf = json.localFood;

  if (lf.chaptersLabel) {
    console.log(`[${locale}] jo migroitu — ohitetaan`);
    continue;
  }
  if (!Array.isArray(lf.sections) || lf.sections.length !== 4) {
    console.error(`[${locale}] odotettiin 4 osiota, löytyi ${lf.sections?.length}`);
    failed++;
    continue;
  }

  // sama sanamuoto kuin ruokahistoriassa — ei uutta käännöstä
  lf.chaptersLabel = json.foodHistory?.chaptersLabel;
  if (!lf.chaptersLabel) {
    console.error(`[${locale}] foodHistory.chaptersLabel puuttuu — aja ruokahistorian migraatio ensin`);
    failed++;
    continue;
  }

  console.log(`\n======== ${locale} ========`);
  lf.sections.forEach((s, i) => {
    s.title = TITLES[locale][i];
    const sentences = splitSentences(s.paragraphs[0], locale);
    const idx = QUOTE_SENTENCE[i] - 1;
    if (sentences.length <= idx) {
      console.error(`  [${locale}] osio ${i}: virkettä ${idx + 1} ei ole`);
      failed++;
      return;
    }
    s.quote = sentences[idx];
    s.paragraphs[0] = sentences.filter((_, n) => n !== idx).join(CJK.includes(locale) ? '' : ' ');
    console.log(`  ${i + 1} ${s.title}`);
    console.log(`     nosto:  ${s.quote}`);
    console.log(`     p0 jää: ${s.paragraphs[0].slice(0, 90)}…`);
  });

  if (WRITE) {
    let out = JSON.stringify(json, null, 2) + '\n';
    if (crlf) out = out.replace(/\n/g, '\r\n');
    writeFileSync(file, out, 'utf8');
  }
}

if (failed) {
  console.error(`\n${failed} virhettä`);
  process.exit(1);
}
console.log(WRITE ? '\nKirjoitettu.' : '\nKuivaharjoitus — aja --write kun tulos näyttää oikealta.');
