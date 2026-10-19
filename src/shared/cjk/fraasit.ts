/**
 * CJK-otsikoiden fraasirajat: mihin kohtiin kiinan/japanin otsikko saa katketa riviltä toiselle.
 *
 * Miksi: kiinan ja japanin rivitys saa katketa minkä tahansa kahden merkin välistä, ja otsikoiden
 * `text-wrap: balance` jakaa rivit tasan pituuden mukaan. Tulos oli 375 px:llä mm. "真實的拉普 / 蘭"
 * ja "プライバシ / ーポリシー". Pelkkä CSS ei korjaa tätä (mitattu Chromium + WebKit): `keep-all`
 * tekee välimerkittömästä kiinasta yhden katkeamattoman sanan, joka ylivuotaa ja katkeaa mihin sattuu,
 * ja `word-break: auto-phrase` toimii vain Chromiumissa ja vain japanille.
 *
 * Siksi otsikon tekstiin lisätään <wbr>-katkokohdat (cjkJsxRuntime.ts) ja CSS (CJK_CSS, cjkOtsikotPlugin.ts) sallii
 * katkon vain niissä. Teksti ei muutu: <wbr> on elementti, ei merkki (textContent, haku ja kopiointi ennallaan).
 *
 * Kanoninen lähde: lv-ops shared/cjk/. Sivustot vendoroivat kansion src/shared/cjk/:ksi tavu tavulta
 * (scripts/rollout_cjk_otsikot.mjs --write; --check vertaa jokaisen sivuston origin/mainia tähän).
 *
 * Jako = selaimen oma Intl.Segmenter (ICU) + säännöt. ICU pirstoo translitteroidut paikannimet
 * (拉|普|蘭, 羅|瓦|涅|米) ja taivutukset (待|って|く|れ|ない), joten paikannimet suojataan listalla ja
 * kieliopilliset palat liitetään naapuriinsa. Selain ilman Intl.Segmenteria = ei katkokohtia = vanha käytös.
 */

// Paikannimet, joiden sisällä ei koskaan katkea: yksinkertaistettu kiina (verkoston /cn/), perinteinen
// kiina (laplandstaysin /cn/) ja japani. Muodot on poimittu sivustojen omista käännöksistä. Tavallinen
// taulukko eikä zh-avain: laplandstaysin zh-hant.mjs lukee vain zh-alipuut, joten lista ei kaada sitä.
const PAIKAT = [
  '拉普兰', '芬兰', '罗瓦涅米', '萨利色尔卡', '萨里塞尔卡', '伊纳里', '莱维', '列维', '于拉斯', '于莱斯', '赫尔辛基',
  '托尔尼奥', '萨米', '库萨莫', '鲁卡', '基蒂莱', '凯米', '奥卢', '基尔皮斯耶尔维', '圣诞老人村', '圣诞老人', '皮哈',
  '帕拉斯', '伊瓦洛', '卢奥斯托', '萨拉', '索丹屈莱', '阿卡斯隆波洛', '穆奥尼奥', '科拉里', '拉努阿',
  // muu translitteraatio, jonka ICU pilkkoo merkeittäin (哈|士|奇): ilman tätä 您的哈士奇 oli yksi pala ja
  // laplandhuskysafarisin /cn/-otsikko jäi 1280 px:llä kolmelle riville (19.10.2026)
  '哈士奇',
  '拉普蘭', '芬蘭', '於拉斯', '伊納里', '羅瓦涅米', '薩利色爾卡', '赫爾辛基', '薩米', '伊瓦洛', '基蒂萊',
  '聖誕老人村', '聖誕老人', '魯卡', '庫薩莫', '皮哈', '凱米', '盧奧斯托', '列維', '萊維', '托爾尼奧',
  'ラップランド', 'フィンランド', 'ロヴァニエミ', 'レヴィ', 'ユッラス', 'サーリセルカ', 'ヘルシンキ', 'イナリ',
  'トルニオ', 'サーミ', 'キッティラ', 'イヴァロ', 'クーサモ', 'サンタクロース村', 'サンタクロース', 'オウル',
  'ルオスト', 'ピュハ', 'ソダンキュラ', 'キルピスヤルヴィ', 'ムオニオ', 'ケミ', 'ルカ',
];

const HAN = /\p{Script=Han}/u;
const HIRA = /\p{Script=Hiragana}/u;
const KATA = /[\p{Script=Katakana}ー]/u;
const KANA = /[\p{Script=Hiragana}\p{Script=Katakana}]/u;
const HANGUL = /\p{Script=Hangul}/u;
export const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const KIRJAIN = /[\p{L}\p{N}]/u;
const NUMERO = /[0-9０-９]/u;
// ei rivin alkuun (kinsoku): välimerkit, sulkevat sulkeet, pienet kanat, pidennysmerkki
const EI_ALKUUN = /^[、。，．,.!！?？:：;；)）\]］}｝」』】〕〉》”’…‥・·ー–—〜~ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ％%]/u;
// ei rivin loppuun: avaavat sulkeet ja lainausmerkit
const EI_LOPPUUN = /[(（[［{｛「『【〔〈《“‘]$/u;
// kiinan rakennepartikkelit kuuluvat edelliseen sanaan
const ZH_EDELLISEEN = /^[的地得了们們着著过過之]$/u;
// japanin kunniaetuliite kuuluu seuraavaan sanaan
const JA_ETULIITE = /^[ごお御]$/u;
// japanin partikkeli, jonka JÄLKEEN on lauseenosaraja
const JA_PARTIKKELI = /^[のはがをにへとでもやて]$/u;
// monimerkkinen partikkeli, pääte tai apuverbi, joka ei irtoa edeltävästä katakanasanasta (ロヴァニエミ|から, オーロラ|という)
const JA_PARTIKKELI_PITKA = /^(から|まで|より|など|だけ|しか|ほど|くらい|ぐらい|ずつ|とか|って|では|には|とは|へは|でも|にも|との|への|での|ので|のに|けど|ながら|こそ|なら|とい|ごと|まま|よう|みた|らし|ぶり|がち|につ|とし|によ|にお|です|でし|ます|まし|だっ|だろ|でき|させ|され)/u;
// leveysyksikköä (CJK-merkki = 1): pidempään yksikköön palautetaan pehmeät rajat
const RAJA = 6;

type Luokka = 'kova' | 'pehmea' | 'ok';

// Oma minimityyppi Intl.Segmenterille: osa sivustoista kääntää tsconfigin lib-asetuksella, jonka tyypeissä Segmenteria
// ei ole (ES2022:sta alkaen), ja tsc kaatoi buildin (hoteldeals + work 1.10.2026, TS2694). Ajonaikana tarkistetaan erikseen.
interface Segmentoija { segment(teksti: string): Iterable<{ segment: string }> }
type SegmentoijaLuokka = new (kieli: string, optiot: { granularity: 'word' }) => Segmentoija;

let segmentoijat: { ja: Segmentoija; zh: Segmentoija } | null | undefined;
function segmentoija(ja: boolean): Segmentoija | null {
  if (segmentoijat === undefined) {
    const Luokka = typeof Intl !== 'undefined' ? (Intl as unknown as { Segmenter?: SegmentoijaLuokka }).Segmenter : undefined;
    segmentoijat = typeof Luokka === 'function'
      ? { ja: new Luokka('ja', { granularity: 'word' }), zh: new Luokka('zh', { granularity: 'word' }) }
      : null;
  }
  return segmentoijat ? (ja ? segmentoijat.ja : segmentoijat.zh) : null;
}

/** Katkokohdat koodipisteindekseinä ([...teksti]-taulukossa), nousevassa järjestyksessä. */
export function katkokohdat(teksti: string): number[] {
  if (!CJK.test(teksti) || HANGUL.test(teksti)) return [];
  const ja = KANA.test(teksti);
  const seg = segmentoija(ja);
  if (!seg) return [];
  const cps = [...teksti];
  const osat: string[][] = [];
  for (const s of seg.segment(teksti)) osat.push([...s.segment]);
  const alku: number[] = [];
  let pos = 0;
  for (const o of osat) { alku.push(pos); pos += o.length; }

  const suojattu = new Array<boolean>(cps.length + 1).fill(false);
  const nimenAlku = new Array<boolean>(cps.length + 1).fill(false);
  for (const p of PAIKAT) {
    const pc = [...p];
    for (let i = 0; i + pc.length <= cps.length; i++) {
      let osuu = true;
      for (let j = 0; j < pc.length; j++) if (cps[i + j] !== pc[j]) { osuu = false; break; }
      if (osuu) { nimenAlku[i] = true; for (let j = 1; j < pc.length; j++) suojattu[i + j] = true; }
    }
  }

  const luokka = new Map<number, Luokka>();
  for (let k = 1; k < osat.length; k++) {
    const i = alku[k];
    const ed = osat[k - 1], nyt = osat[k];
    const a = cps[i - 1], b = cps[i];
    const edTeksti = ed.join(''), nytTeksti = nyt.join('');
    const ennenEd = alku[k - 1] > 0 ? cps[alku[k - 1] - 1] : '';
    const edLauseenAlussa = !ennenEd || (!CJK.test(ennenEd) && !NUMERO.test(ennenEd)); // 4|個 ei ole lauseenalku
    let l: Luokka = 'ok';
    if (suojattu[i]) l = 'kova';
    else if (/\s/u.test(a) || /\s/u.test(b)) l = 'kova'; // välilyönti on jo katkokohta
    else if (!CJK.test(a) && !CJK.test(b)) l = 'kova'; // latinalaisen tekstin sisään ei <wbr>ää
    else if (EI_ALKUUN.test(b) || EI_LOPPUUN.test(a)) l = 'kova';
    else if (NUMERO.test(a) && CJK.test(b)) l = 'kova'; // luku ja sen yksikkö: 4つ, 6月, 4種
    else if (CJK.test(a) && NUMERO.test(b)) l = /[第約约每毎共計计近逾]/u.test(a) ? 'kova' : 'pehmea'; // 第6條; 6月から|7月
    else if (ja) {
      if (JA_ETULIITE.test(edTeksti)) l = 'kova'; // ご|期待
      else if (ed.length === 1 && HAN.test(a) && KATA.test(b)) l = 'kova'; // etuliite: 当|サイト
      else if (nyt.length === 1 && HAN.test(b) && KATA.test(a)) l = 'kova'; // pääte: イグルー|泊
      // Kunniaetuliitteellä alkava sana (お知らせ, ご予約) on uusi lauseenosa, ei edellisen taivutusta: pehmeä raja.
      // Ilman tätä 求人が出たらお知らせします oli yksi 10 merkin yksikkö, joka keep-allilla levitti flex-rivin
      // otsikon vanhempaansa leveämmäksi (laplandwork /ja/jobs/ 360 px, 8.10.2026).
      else if (/^[ごお]\p{Script=Han}/u.test(nytTeksti) && KIRJAIN.test(a)) l = 'pehmea'; // 出たら|お知らせ
      else if (HIRA.test(b) && KIRJAIN.test(a) && !JA_ETULIITE.test(nytTeksti)) {
        // Partikkeli ja okurigana kuuluvat edelliseen. Pehmeä (vain pitkässä yksikössä) on apuverbi tai
        // muodollinen substantiivi (いただける, こと) sekä partikkelin JÄLKEINEN raja (空が|こたえて):
        // ICU:n muut hiraganapalat ovat usein taivutuksen osia (計画|しま|しょう), joiden väliin ei katketa.
        const apuverbi = [...nytTeksti].every((c) => HIRA.test(c)) && /^(いただ|いた|いる|いく|くださ|くれ|こと)/u.test(nytTeksti);
        // Katakanasanan jälkeinen hiraganasana (ハスキー|そり, スキー|したい) on oma sanansa, ei taivutusta: pehmeä.
        // Ilman sitä ハスキーそり・ oli 7 merkin yksikkö, joka katkesi hätäkatkona ・:n eteen (hubi 768 px, 8.10.2026).
        const katakananJalkeen = KATA.test(a) && nyt.length >= 2 && [...nytTeksti].every((c) => HIRA.test(c)) && !JA_PARTIKKELI_PITKA.test(nytTeksti);
        // Kaksi partikkelia peräkkäin on yksi yhdyspartikkeli (へ|の, に|は, で|も): ei katkoa niiden väliin. ICU antaa
        // ラップランドへの muodossa ラップランド|へ|の, ja ilman tätä otsikko katkesi "ラップランドへ / の行き方" (hubi 16.10.2026).
        const partikkeliJono = JA_PARTIKKELI.test(nytTeksti); // vain yksimerkkinen: PITKA-listassa on myös でき/です (が|できます saa katketa)
        // ICU antaa yhdyspartikkelin yhtenä palana (ひとつ|では|ありま|せん): sen JÄLKEEN on sama lauseenosaraja kuin
        // yksimerkkisen partikkelin jälkeen. Ilman tätä ひとつではありません。 oli 10 merkin yksikkö, joka katkesi
        // hätäkatkona ひとつではありま / せん。 (laplandnightlife, laplandwellness /ja/ 360–412 px, 19.10.2026).
        const yhdysPartikkeli = /^(では|には|とは|へは|でも|にも|からは|までは)$/u.test(edTeksti);
        l = apuverbi || katakananJalkeen || ((JA_PARTIKKELI.test(edTeksti) || yhdysPartikkeli) && !partikkeliJono) ? 'pehmea' : 'kova';
      } else if (HAN.test(a) && HAN.test(b)) l = ed.length >= 2 && nyt.length >= 2 ? 'pehmea' : 'kova'; // kanjiyhdyssana
      else if (KATA.test(a) && KATA.test(b) && (ed.length <= 2 || nyt.length <= 2)) {
        // ICU pilkkoo tuntemattoman vierassanan ≤ 2 merkin paloiksi (ハス|キー), joiden väliin ei katketa. Pidennysmerkkiin
        // ー päättyvä vähintään 4 merkin katakanajono + vähintään 3 merkin sana on kuitenkin yhdyssanan raja (ハスキー|サファリ,
        // ウィンター|スポーツ): pehmeä. Ilman sitä ハスキーサファリを oli 9 merkin yksikkö, joka katkesi hätäkatkona pienen
        // kanan eteen (hubi /ja/husky-safaris/ 360 px, 8.10.2026). Ehto ー rajaa pois ICU:n virhepalat (ベースレ|イヤー):
        // korpuksessa 4 027 otsikkoa ー-ehdolla 31 muutosta, kaikki oikeita; ilman sitä 79, joista 8 sanan keskeltä.
        let jono = 0;
        for (let j = i - 1; j >= 0 && KATA.test(cps[j]); j--) jono++;
        l = a === 'ー' && nyt.length >= 3 && jono >= 4 ? 'pehmea' : 'kova';
      }
    } else {
      if (ZH_EDELLISEEN.test(nytTeksti)) l = 'kova'; // 的 edelliseen
      else if (nyt.length === 1 && HAN.test(b) && HAN.test(a) && !nimenAlku[i]) l = 'kova'; // yksittäinen merkki edelliseen
      else if (ed.length === 1 && HAN.test(a) && edLauseenAlussa) l = 'kova'; // lauseenalun yksittäinen merkki seuraavaan
    }
    luokka.set(i, l);
  }

  // leveys välilyöntien välistä (välilyönti on jo katkokohta): CJK ja kokoleveä = 1, muu = 0,55
  const leveys = (x: number, y: number) => {
    let w = 0, max = 0;
    for (let j = x; j < y; j++) {
      const c = cps[j];
      if (/\s/u.test(c)) { max = Math.max(max, w); w = 0; continue; }
      w += CJK.test(c) || /[\u3000-\u303f\uff00-\uffef]/u.test(c) ? 1 : 0.55;
    }
    return Math.max(max, w);
  };
  const ensisijaiset = [...luokka].filter(([, l]) => l === 'ok').map(([i]) => i);
  const rajat = [0, ...ensisijaiset, cps.length];
  const tulos = new Set(ensisijaiset);
  for (let r = 0; r + 1 < rajat.length; r++) {
    const x = rajat[r], y = rajat[r + 1];
    if (leveys(x, y) <= RAJA) continue;
    for (const [i, l] of luokka) if (l === 'pehmea' && i > x && i < y) tulos.add(i);
  }
  return [...tulos].sort((p, q) => p - q);
}

/**
 * Pitkät katakanasanat (vähintään 7 merkkiä, ei paikannimeä): アクティビティ, アイスフィッシング. keep-allin alla riviä
 * pidemmän sanan ainoa katko on hätäkatko viimeiseen mahtuvaan merkkiin, joka ei tunne kinsokua: 18 px:n korttiotsikko
 * 124 px:n laatikossa antoi 夏の / アクティビテ / ィ (laplandactivities /ja/ 360 px, 8.10.2026; ennen 夏のアク / ティビティ).
 * otsikko.ts käärii sanan sisältävän fraasin inline-block-elementtiin, joka katkeaa vain jos fraasi ei mahdu riville, ja
 * silloin selaimen omalla rivityksellä ja strict-kinsokulla (CJK_CSS [data-cjk-pitka]).
 * Vain katakanasana: sekapalassa (お考えですか？, 知りたいですか？) sisäiset katkot antoivat balancen jakaa palan, vaikka
 * se olisi mahtunut riville (laplandwork /ja/ 360–412 px: 採用をお考 / えですか？). Paikannimi ei katkea (サンタクロース).
 * → null jos palassa ei ole pitkää katakanasanaa, muuten palat järjestyksessä.
 */
export function katakanaPalat(osa: string): { teksti: string; pitka: boolean }[] | null {
  const cps = [...osa];
  const out: { teksti: string; pitka: boolean }[] = [];
  let i = 0, alku = 0, loytyi = false;
  while (i < cps.length) {
    if (!KATA.test(cps[i])) { i++; continue; }
    let j = i;
    while (j < cps.length && KATA.test(cps[j])) j++;
    const sana = cps.slice(i, j).join('');
    if (j - i > RAJA && !PAIKAT.some((p) => sana.includes(p))) {
      if (i > alku) out.push({ teksti: cps.slice(alku, i).join(''), pitka: false });
      out.push({ teksti: sana, pitka: true });
      alku = j;
      loytyi = true;
    }
    i = j;
  }
  if (!loytyi) return null;
  if (alku < cps.length) out.push({ teksti: cps.slice(alku).join(''), pitka: false });
  return out;
}

/** Teksti fraaseiksi katkokohtien kohdalta (testeille ja mittareille). */
export function fraasit(teksti: string): string[] {
  const cps = [...teksti];
  const out: string[] = [];
  let prev = 0;
  for (const i of katkokohdat(teksti)) { out.push(cps.slice(prev, i).join('')); prev = i; }
  out.push(cps.slice(prev).join(''));
  return out;
}
