import { Fragment, type ReactNode } from 'react';

/* ── Otsikon rivit tietokoneella (Vesa 3.10.2026: "tehdään turhaan kolmirivisiä") ──────────────────────────────
 * Mitattu livenä 3.10. (scripts/audit_otsikkorivit.mjs, 12 kieltä × 1280/1536/1920): otsikon koko kasvaa näytön
 * mukana, palsta ei, joten pitkä kieli katkesi kolmelle riville tai jätti yhden sanan riville. Ratkaisu on sama
 * kuin hubin herossa (laplandvibes cadea06): rivit tulevat lauseen rakenteesta ja koko on pienempi kahdesta,
 * suunniteltu koko tai koko jolla pisin rivi mahtuu palstaan: min(--max, 100cqi / rivin leveys em-yksiköinä). */

const CJK = /[\u3000-\u30ff\u3400-\u9fff\uac00-\ud7af\uff00-\uffef]/;

/** Rivin leveysarvio em-yksiköinä Bebas Neuella. Merkkileveydet mitattu selaimessa 3.10.2026 (versaali 0,37–0,41 em,
 *  I 0,19, M/W 0,54–0,56, väli 0,16; CJK-varafontti 1,0 em); `tracking` = letter-spacing em-yksiköinä
 *  (tracking-wide 0.025, tracking-wider 0.05). Arvio on mittausta hieman suurempi, ettei rivi katkea arvion takia. */
export function bebasEm(s: string, tracking = 0): number {
  let w = 0;
  for (const ch of s) {
    w += tracking + (
      CJK.test(ch) ? 1.02
      : ch === ' ' ? 0.17
      : /[.,:;'’!¡]/.test(ch) ? 0.2
      : /[iíìIÍÌ]/.test(ch) ? 0.21
      : /[jJ]/.test(ch) ? 0.28
      : /[mM]/.test(ch) ? 0.55
      : /[wW]/.test(ch) ? 0.57
      : 0.415
    );
  }
  return w;
}

/** ja ja zh kirjoitetaan ilman välilyöntejä: ilman katkokohtia selain katkaisee rivin mistä tahansa merkistä. */
export const ilmanValeja = (lang: string) => lang === 'ja' || lang === 'zh-CN';

const segmentoija = (lang: string) => {
  try {
    return typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? new Intl.Segmenter(lang, { granularity: 'word' })
      : null;
  } catch {
    return null;
  }
};

/** ja/zh: teksti fraaseiksi. Sanojen rajat Intl.Segmenterilta; japanissa pelkät hiraganat (partikkelit,
 *  taivutuspäätteet) ja välimerkit liitetään edelliseen, jotta rivi ei ala "へ"- tai "。"-merkillä.
 *  Muilla kielillä ja ilman Segmenteriä teksti palaa yhtenä osana. */
export function fraasit(text: string, lang: string): string[] {
  const seg = ilmanValeja(lang) ? segmentoija(lang) : null;
  if (!seg) return [text];
  const osat: string[] = [];
  for (const { segment } of seg.segment(text)) {
    const liita = osat.length > 0 && (
      /^[\u3001\u3002\uff01\uff1f\uff0c\uff1a\uff1b)\uff09\u300d\u300f\u3011\u30fc]+$/.test(segment)
      || (lang === 'ja' && /^[\u3040-\u309f]+$/.test(segment))
    );
    if (liita) osat[osat.length - 1] += segment;
    else osat.push(segment);
  }
  return osat;
}

/** ja/zh: fraasien väliin <wbr>. Käytetään yhdessä `word-break: keep-all`:n kanssa, jolloin rivi katkeaa vain
 *  näistä kohdista eikä kesken sanan ("ラップ / ランド"). Muilla kielillä teksti sellaisenaan. */
export function Fraasit({ text, lang }: { text: string; lang: string }): ReactNode {
  const osat = fraasit(text, lang);
  if (osat.length < 2) return text;
  return osat.map((o, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {o}
    </Fragment>
  ));
}

/** Yksirivinen otsikko jakautuu kahdelle riville vasta kun se on tätä pidempi (em). Lyhyt otsikko ("Lapin parhaat
 *  ravintolat", 10 em) mahtuu tietokoneella yhdelle riville suunnitellulla koolla, ja kahdelle jaettuna siitä
 *  jäisi yhden sanan rivi. */
const YKSI_RIVI_EM = 11;

/** Otsikko yhdelle tai kahdelle riville lauseen rakenteesta, ei palstan leveydestä: kahdesta rivistä valitaan
 *  jako, jonka pidempi rivi on lyhin, eikä viimeiselle riville jätetä yhtä sanaa. ja/zh jaetaan fraasien
 *  välistä (ei kesken sanan), muut välilyönneistä. Palauttaa rivit ja pisimmän rivin leveyden em-yksiköinä. */
export function riveiksi(text: string, lang: string, em: (s: string) => number): { rivit: string[]; em: number } {
  const koko = em(text);
  const valit = !ilmanValeja(lang);
  const osat = valit ? text.split(/\s+/).filter(Boolean) : fraasit(text, lang);
  if (koko <= YKSI_RIVI_EM || osat.length < 2) return { rivit: [text], em: koko };
  let paras: { rivit: string[]; em: number } | null = null;
  for (let i = 1; i < osat.length; i++) {
    // Yhden sanan loppurivi kelpaa vain kielillä, joissa välilyöntiä ei ole tai se ei erota sanoja (ko on tavuittain).
    if (valit && lang !== 'ko' && osat.length - i === 1) continue;
    const r = [osat.slice(0, i).join(valit ? ' ' : ''), osat.slice(i).join(valit ? ' ' : '')];
    const m = Math.max(em(r[0]), em(r[1]));
    if (!paras || m < paras.em) paras = { rivit: r, em: m };
  }
  return paras ?? { rivit: [text], em: koko };
}

/** Lauseet omiksi osikseen: 。/！/？ jälkeen tai . ! ? jälkeen kun perässä on väli. */
export function lauseet(text: string): string[] {
  const osat = text.match(/.+?(?:[。！？]|[.!?](?=\s|$))\s*|.+$/gu);
  return osat ? osat.map((o) => o.trim()).filter(Boolean) : [text];
}
