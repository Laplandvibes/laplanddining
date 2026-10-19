/**
 * Otsikon CJK-tekstiin <wbr>-katkokohdat fraasirajoille (fraasit.ts). Käyttäjät:
 * - cjkJsxRuntime.ts / cjkJsxDevRuntime.ts: jokaisen h1–h6:n merkkijonolapset ja sen sisäisten tekstielementtien
 *   (span, a, em, strong …) merkkijonot automaattisesti;
 * - fraasiLapset() suoraan, kun otsikon teksti on komponentin sisällä (<h2><Link>{otsikko}</Link></h2>).
 * Katkokohdat vaikuttavat vain CJK_CSS:n kautta (cjkOtsikotPlugin.ts: keep-all elementille, jolla on <wbr>-lapsia).
 */
import { cloneElement, isValidElement, type ReactNode } from 'react';
import { Fragment, jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { CJK, katakanaPalat, katkokohdat } from './fraasit';

const OTSIKKO = /^h[1-6]$/;
const valimuisti = new Map<string, string[] | null>();

function palat(teksti: string): string[] | null {
  let p = valimuisti.get(teksti);
  if (p !== undefined) return p;
  const k = katkokohdat(teksti);
  if (k.length) {
    const cps = [...teksti];
    p = [];
    let prev = 0;
    for (const i of k) { p.push(cps.slice(prev, i).join('')); prev = i; }
    p.push(cps.slice(prev).join(''));
  } else p = null;
  if (valimuisti.size > 1000) valimuisti.clear();
  valimuisti.set(teksti, p);
  return p;
}

/** Teksti, jonka fraasirajoilla on <wbr>. Ei-CJK tai ilman katkokohtia = sama merkkijono. */
export function fraasiLapset(teksti: string, key?: string): ReactNode {
  if (!CJK.test(teksti)) return teksti;
  const p = palat(teksti);
  if (!p) return teksti;
  const lapset: ReactNode[] = [];
  p.forEach((osa, n) => {
    if (n > 0) lapset.push(reactJsx('wbr', {}, `w${n}`));
    lapset.push(...pitkaFraasi(osa, n));
  });
  return reactJsxs(Fragment, { children: lapset }, key);
}

// ei rivin loppuun: avaavat sulkeet ja lainausmerkit (sama joukko kuin fraasit.ts EI_LOPPUUN)
const AVAAVA = /[(（[［{｛「『【〔〈《“‘]/u;

/**
 * Fraasi, jossa on pitkä katakanasana: sanan alusta fraasin loppuun omaan elementtiinsä (CJK_CSS [data-cjk-pitka]).
 * Elementti on inline-block, joten balance ei voi katkaista sitä, ja sen sisällä selaimen oma rivitys + strict-kinsoku
 * pätee vain kun se yksin on riviä pidempi. Fraasin LOPPUUN asti: inline-blockin reunat ovat katkokohtia, ja fraasin
 * loppu on jo <wbr>-kohta (pelkän sanan perästä tuli スモークサウナ / ・キャビン). Sanan ALUSTA: edeltävä yhdyssanan
 * osa jää ulos ja sen perään tulee katkokohta (地域別 / スノーモービル; koko fraasi inline-blockina katkesi sisältä
 * 地域別スノーモー / ビル, laplandsnowmobile /ja/destinations/ 19.10.2026). Yksimerkkinen etuliite (新, ご) ja avaava
 * sulje jäävät sanan kanssa samaan elementtiin.
 */
function pitkaFraasi(osa: string, n: number): ReactNode[] {
  const k = katakanaPalat(osa);
  if (!k) return [osa];
  const cps = [...osa];
  let alku = 0;
  for (const x of k) { if (x.pitka) break; alku += [...x.teksti].length; }
  while (alku > 0 && AVAAVA.test(cps[alku - 1])) alku--;
  if (alku < 2) alku = 0;
  const span = reactJsx('span', { 'data-cjk-pitka': '', children: cps.slice(alku).join('') }, `p${n}`);
  return alku ? [cps.slice(0, alku).join(''), span] : [span];
}

// Otsikon sisäiset tekstielementit (esim. <h1>{otsikko}<span className="block">{alaotsikko}</span></h1>) käsitellään
// myös. Komponentteihin (Link ym.) ei kosketa: ne voivat käyttää lapsitekstiä muuhunkin kuin näkyvään tekstiin.
// Fragmentti (<>{a}<br />{b}</>) on DOMissa näkymätön, joten sen tekstit ovat otsikon omia lapsia: hero-komponentti
// saa otsikon usein propsina muodossa title={<>…</>} (laplandwork /ja/employers/ jäi 8.10.2026 ilman katkokohtia).
const TEKSTIELEMENTTI = /^(span|a|em|strong|b|i|small|mark|u|s|q|cite|abbr|time|bdi|bdo|sup|sub)$/;
const SYVYYS = 3;

function kasitteleElementti(x: unknown, syvyys: number): unknown {
  if (syvyys <= 0 || !isValidElement(x)) return x;
  if (x.type !== Fragment && (typeof x.type !== 'string' || !TEKSTIELEMENTTI.test(x.type))) return x;
  const lapset = (x.props as { children?: unknown }).children;
  if (lapset == null) return x;
  let uudet = kasitteleLapset(lapset, syvyys - 1);
  // Yksifraasinen CJK-teksti tekstielementissä (<em>ラップランド</em>) jäi ilman omaa <wbr>-lasta, jolloin CJK_CSS antoi
  // sille word-break: normal ja balance katkaisi paikannimen (ラップラン / ド行きの, laplandflights /ja/ 19.10.2026).
  // Loppuun <wbr>: elementti saa keep-allin, ja katkokohta osuu sen loppuun eli fraasirajalle.
  if (uudet === lapset && x.type !== Fragment && cjkTeksti(lapset)) uudet = [lapset, reactJsx('wbr', {}, 'e')];
  if (uudet === lapset) return x;
  return cloneElement(x, undefined, ...((Array.isArray(uudet) ? uudet : [uudet]) as ReactNode[]));
}

// CJK-tekstin ja tekstielementin raja on fraasiraja (<h1>{'フィンランドの'}<span>{'アルペンリゾート30か所'}</span></h1>):
// sinne <wbr>. Ilman sitä yksifraasinen teksti jäi ilman katkokohtia, otsikolla ei ollut omaa <wbr>-lasta eikä siis
// keep-allia, ja balance katkaisi tekstin minne sattui (フィンランド / のアルペン, laplandskiresorts /ja/resorts/
// 19.10.2026). Vain tekstielementti, fragmentti tai <br>: ikonin (komponentti, svg) viereen ei, koska flex-otsikon
// yksifraasinen teksti olisi silloin keep-all ja katkeaisi kapeassa kortissa hätäkatkona.
const rajaElementti = (x: unknown) =>
  isValidElement(x) && (x.type === Fragment || (typeof x.type === 'string' && (x.type === 'br' || TEKSTIELEMENTTI.test(x.type))));
const cjkTeksti = (x: unknown) => typeof x === 'string' && CJK.test(x);
const tyhja = (x: unknown) => x == null || x === false || x === true || (typeof x === 'string' && x.trim() === '');

function naapuri(c: unknown[], i: number, suunta: 1 | -1): unknown {
  for (let j = i + suunta; j >= 0 && j < c.length; j += suunta) if (!tyhja(c[j])) return c[j];
  return null;
}

function kasitteleLapset(c: unknown, syvyys: number): unknown {
  if (typeof c === 'string') return fraasiLapset(c);
  if (Array.isArray(c)) {
    let muuttui = false;
    const uusi: unknown[] = [];
    c.forEach((x, i) => {
      const raja = cjkTeksti(x);
      if (raja && rajaElementti(naapuri(c, i, -1))) { uusi.push(reactJsx('wbr', {}, `r${i}`)); muuttui = true; }
      const y = typeof x === 'string' ? fraasiLapset(x, `cjk${i}`) : kasitteleElementti(x, syvyys);
      if (y !== x) muuttui = true;
      uusi.push(y);
      if (raja && rajaElementti(naapuri(c, i, 1))) { uusi.push(reactJsx('wbr', {}, `s${i}`)); muuttui = true; }
    });
    return muuttui ? uusi : c;
  }
  return kasitteleElementti(c, syvyys);
}

/** h1–h6:n propsit, joissa CJK-tekstiin on lisätty katkokohdat (myös otsikon sisäisiin tekstielementteihin). */
export function otsikonPropsit<P>(type: unknown, props: P): P {
  if (typeof type !== 'string' || !OTSIKKO.test(type) || props == null || typeof props !== 'object') return props;
  const c = (props as { children?: unknown }).children;
  if (c == null) return props;
  const uusi = kasitteleLapset(c, SYVYYS);
  return uusi === c ? props : { ...props, children: uusi };
}
