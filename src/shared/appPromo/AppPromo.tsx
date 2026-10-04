/**
 * Verkoston appimainos — shared/appPromo/. Kanoninen lv-opsissa; jokaisella sivustolla tavu tavulta sama vendoroitu
 * kopio src/shared/appPromo/ (gate:apppromo-kopiot). Sivuston oma src/components/AppPromo.tsx on ohut kääre, joka
 * valitsee aiheen (focus) — sivustokohtainen koodi kuuluu sinne, ei tähän tiedostoon.
 *
 *  AppPromoHero   etusivun kiinteä lohko.
 *  AppPromoNudge  muualla: ilmestyy vasta kun lukija on sitoutunut (puolet sivusta, 45 s tai osoitin kohti välilehtipalkkia),
 *                 kerran per kävijä, alanurkkaan ankkuroituna. 🔴 Ei välisivua: Google rankaisee mobiilisivua, jonka sisällön
 *                 ponnahdus peittää saapuessa, ja hakuliikenne on verkoston moottori (Vesa 1.8.2026 pyysi ponnahdusta joka
 *                 sivulle, sopi tähän).
 *
 * ── TAITTO (Vesa 1.10.2026: "tilaa ei käytetä tarpeeksi hyödyksi ja ei ole mietitty miksi mikäkin on ja missä") ──
 * Jokainen hyöty on appin oikea näkymä: otsake = appin välilehden nimi, rivi = mitä siellä on, linkki = syvälinkki juuri
 * siihen näkymään (oma Umami-pinta promo_<näkymä>, eli klikit mittautuvat hyödyittäin).
 *
 * 🔴🔴 KORTIN LEVEYS RATKAISEE, EI IKKUNAN (Vesa 4.10.2026 stayinlaplandilla ~2560 px:n näytöllä: *"tuo qr koodi ei ole
 * tasapainossa ja aivan liian pienellä … kasvattaa puhelimien näyttöjä jotta niiden kuvien navit näkyisi"* ja *"vieläkään
 * ole optimoinut mainosta joka näytölle"*). Kortti istuu sivustoilla eri levyisissä konteissa (max-w-5xl hubilla ja
 * blogissa, 7xl muualla), joten ikkunan leveys ei kertonut, paljonko tilaa kortissa on: 900 px:n ikkunassa näkymät olivat
 * 251 × 290 -laatikoita ja 1216 px:n kortissa 592 px näkymiä + 510 px:n palsta, jonka alaosa oli tyhjä. Nyt .lvap on
 * container-kysely (container-type: inline-size) ja jokainen raja on kortin leveys.
 *  - Näkymä on KOKO appiruutu kuvasuhteessaan 480 × 1039 puhelinkehyksessä, myös appin alapalkki (Etusivu, Lähellä …).
 *    Ennen kuva rajattiin kiinteään korkeuteen (184 × 360) ja alaosa häivytettiin, joten alapalkki ei näkynyt millään leveydellä.
 *  - kortti < 560 px (puhelin): ensimmäinen näkymä ja kolme hyötyä sen vieressä pystykeskitettynä, nappi koko leveydeltä.
 *    Näkymän leveys = kortti − 212 px (hyödyille jää ≥ 156 px), 96–176 px; alle 320 px:n kortissa 84–120 px.
 *  - kortti 560–899 px (tabletti, kapea ikkuna): kolme näkymää rinnakkain, enintään 224 px, reunat tekstin linjassa;
 *    nappi vasemmalla ja QR-paneeli oikealla (alle 720 px:n kortissa QR:n teksti alla, muuten vieressä).
 *  - kortti ≥ 900 px (tietokone): logo ja otsikko koko kortin levyisinä (Vesa 3.10.: *"ihan kauhea"*, kun otsikko oli
 *    318 px:n palstassa neljällä rivillä), alla vasen palsta ja kolme näkymää. Näkymä = (kortti − 492 px) / 3, 150–224 px,
 *    joten palstalle jää ≥ 340 px. Palstan kolme osaa jaetaan näkymien korkeudelle: ingressi ylös, nappi keskelle,
 *    QR-paneeli alas näkymien kuvatekstien linjaan (ei enää tyhjää aluetta pienen QR:n alla).
 *  - QR omana paneelinaan (koodi 104–152 px + "Skannaa ja avaa puhelimessa" vieressä); oli 96 px ja 11 px:n teksti.
 *  - Otsikko katkeaa ensisijaisesti kysymyksen jälkeen (Lauseet: kumpikin lause oma inline-block), ei keskeltä lausetta.
 *  - QR vain hiiriruudulla (pointer: fine) ja vähintään 560 px:n kortissa: Vesan ~720 px:n selainpaneeli saa sen yhä
 *    (3.8.2026), mutta kosketustabletti ei, koska appi avautuu tabletilla suoraan (appin deviceTarget.ts päästää tabletit).
 *  - Nurkkakortti (AppPromoNudge, Vesa 4.10.2026 laplanddealsilla: *"itse laplandvibes app on liian pienellä suhteessa
 *    muihin fontteihin … jotenkin tosi epäselvä eikä kuva näy"*). Mitattu: kuva oli 64 × 88 px:n pala näkymän yläreunasta
 *    (appin välilehtinapit, joista ei erottanut mitään) ja sanamerkki 16 px, kortin pienin teksti 24 px:n otsikon rinnalla.
 *    Nyt koko appinäkymä samassa puhelinkehyksessä kuin lohkossa (alapalkki näkyy), 84 px puhelimella ja 116 px
 *    leveämmällä; sanamerkki 24 / 30 px eli otsikkoa (19 / 22 px) suurempi; 640 px:stä alkaen otsikon alla aiheen kolme
 *    näkymää nimeltä (mitä appissa on), ja nappi samassa palstassa. Sulje-nappi kortin kulmassa, logo väistää sitä.
 *    Alle 360 px:n näytöllä näkymä 64 px, sanamerkki 20 px ja asennusrivi pois: 320 px:llä sanamerkki rivittyi
 *    ("…VIBES / APP") ja kortti vei 42 % ruudusta (mitattu 4.10. 320 × 640).
 *  - Yhden näkymän yksiköt (laplandvisitin aurora/emergency): kuva ja QR sivupalstassa vasta 680 px:n kortista (560 px:llä
 *    otsikko jäi kolmelle riville). 🔴 Puhelinkomponentin inline-tyyli display:block ohitti piilotussäännön, joten näissä
 *    yksiköissä sama näkymä näkyi tabletilla ja tietokoneella KAHDESTI (mitattu livenä 4.10.) — inline-tyyli poistettu.
 *
 * Poistettu tietoisesti: UUTTA-pilleri (harvennettu versaali, eikä appi ole enää uusi), 2×2-luvut 31/211/105/478 (appin
 * varastolukuja, joista rinteet ja hissit eivät kuulu kelkka- tai majoitussivulle; luku näkyy nyt vain siellä missä se
 * kertoo jotain: hiihtoaiheen rivillä), 7 kohdan yleislista ja vihreä "Ota koko pohjoinen taskuusi" -rivi.
 * "Everything Lapland." kulkee logon mukana englanniksi (brändiohje §1), otsikko on kokonaan sivun kielellä.
 *
 * 🔴 TYYLIT OVAT TÄSSÄ TIEDOSTOSSA, EI TAILWINDISSA. Kortti renderöidään 28 sivustolla, joista neljä on Tailwind v3:lla
 * (pointer-fine-varianttia ei ole), ja jaettujen kansioiden arbitrary-luokat ovat jääneet emittoimatta ennenkin (26.7.2026).
 * Kortti ei lue yhdenkään sivuston tokeneita, fontteja eikä utilityjä — siksi se ei voi rikkoutua sivustoittain
 * (kids ja gifts julkaisivat 2.8. värittömän napin, koska --color-vibe-pink puuttui niiltä). Luokat lvap-etuliitteellä.
 *
 * 🔴 KUVAT: /images/app-promo/<näkymä>-<kieli>.webp = appin oikea näkymä lukijan kielellä (lv-ops
 * scripts/app_promo_shots.mjs). Vanha app-screenshot.webp oli englanniksi kaikilla 12 kielellä.
 * Luvut tulevat ../appStats.ts:stä (laskettu appin datamoduuleista), ei käännöksestä.
 */
import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Download, X } from 'lucide-react';
import APP_STATS from '../appStats';
import { COPY, UNIT_COPY, type Copy, type TextFocus } from './copy';
import { FOCUS_SCREENS, SCREEN_TAB, shotSrc, type Focus, type Screen } from './screens';

export type { Focus } from './screens';

/** Kieli suoraan URL:sta, jotta tiedosto toimii jokaisella sivustolla ilman sivuston i18n-apureita. /br = pt-BR, /cn = zh-CN. */
const SEGMENT_LOCALE: Record<string, string> = {
  fi: 'fi', sv: 'sv', de: 'de', fr: 'fr', it: 'it', nl: 'nl',
  es: 'es', br: 'pt-BR', cn: 'zh-CN', ja: 'ja', ko: 'ko', kr: 'ko',
};
const localeFromPath = (pathname: string): string =>
  SEGMENT_LOCALE[pathname.split('/').filter(Boolean)[0] ?? ''] ?? 'en';
const isFrontPage = (pathname: string): boolean => {
  const segs = pathname.split('/').filter(Boolean);
  return segs.length === 0 || (segs.length === 1 && segs[0] in SEGMENT_LOCALE);
};
const CJK = new Set(['ja', 'ko', 'zh-CN']);

/** ?install=1 avaa appin suoraan asennustarjoukseen; tab= vie hyödyn näkymään. Sivusto ei voi asentaa toisen originin
 *  sovellusta, joten tämä on lyhin rehellinen polku napista appiin (Vesa 1.8.2026). */
const appUrl = (tab: string, content: string): string =>
  `https://app.laplandvibes.com/?install=1${tab ? `&tab=${tab}` : ''}&utm_source=web&utm_medium=promo&utm_content=${content}`;
const QR_SRC = '/images/app-qr.svg';
const SEEN_KEY = 'lv_app_promo_seen';

const copyFor = (locale: string): Copy => COPY[locale] ?? COPY.en;
const plain = (s: string): string => s.split('|').join('');
/** CJK-fraasirajat: | ⇒ <wbr>, ja otsikolle keep-all (cjk_otsikot_rivitys_20260927). Muilla kielillä | ei esiinny. */
function Phr({ text }: { text: string }) {
  const osat = text.split('|');
  return <>{osat.map((o, i) => <Fragment key={i}>{i > 0 && <wbr />}{o}</Fragment>)}</>;
}
/** Otsikko kahtena lauseena: kysymys | vastaus. Kumpikin on oma inline-block, joten rivi katkeaa ensin lauseiden välistä
 *  ("PERILLÄ LAPISSA? / KAIKKI TARPEELLINEN TASKUSSA.") ja vasta sitten lauseen sisältä. Raja = ensimmäinen ? ？ 、 tai ，
 *  (ja/zh-otsikoissa kysymyksen paikalla on joskus pilkku). Ilman rajaa (revontuli- ja hätäyksiköt) yksi lause. */
const LAUSERAJA = /^(.+?[?？、，])\s*(\S.*)$/;
function Lauseet({ text }: { text: string }) {
  const m = LAUSERAJA.exec(text);
  if (!m) return <Phr text={text} />;
  const [eka, toka] = [m[1].replace(/\|$/, ''), m[2].replace(/^\|/, '')];
  // ja/zh: ei välilyöntiä lauseiden väliin, vain katkokohta (sama kuin | ⇒ <wbr>).
  const raja = /[？、，]$/.test(eka) ? <wbr /> : ' ';
  return <><span className="lvap-s"><Phr text={eka} /></span>{raja}<span className="lvap-s"><Phr text={toka} /></span></>;
}
const fill = (s: string): string =>
  s.replace('{slopes}', String(APP_STATS.slopes)).replace('{lifts}', String(APP_STATS.lifts)).replace('{resorts}', String(APP_STATS.skiResorts));

function track(placement: string) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'app_promo_click', { placement });
  } catch {
    /* analytiikka ei saa koskaan rikkoa linkkiä */
  }
}

const CSS = `
.lvap{width:100%;margin:32px 0;font-family:'DM Sans',system-ui,sans-serif;color:#F9FAFB;container-type:inline-size}
.lvap *{box-sizing:border-box}
.lvap-card{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(236,72,153,.4);background:linear-gradient(to bottom right,#4a1236,#241a3f,#123152);padding:20px}
.lvap-glow{pointer-events:none;position:absolute;top:-96px;right:-64px;width:224px;height:224px;border-radius:9999px;background:rgba(236,72,153,.25);filter:blur(64px)}
.lvap-in{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:20px}
.lvap-title,.lvap-lead,.lvap-lab,.lvap-line,.lvap-feat{overflow-wrap:break-word}
.lvap-lockup{margin:0;display:flex;flex-wrap:wrap;align-items:baseline;column-gap:10px;row-gap:2px}
.lvap-wm{font-family:'Bebas Neue','Arial Narrow',sans-serif;font-size:22px;line-height:1;letter-spacing:.025em;color:#F9FAFB}
.lvap-wm b{font-weight:400;color:#EC4899}
.lvap-slogan{font-size:13px;color:rgba(249,250,251,.7)}
.lvap-title{margin:12px 0 0;font-family:'Bebas Neue','Arial Narrow',sans-serif;font-weight:400;font-size:31px;line-height:.98;letter-spacing:.025em;color:#F9FAFB;text-wrap:balance;text-transform:none}
.lvap-cjk .lvap-title,.lvap-cjk .lvap-lab{word-break:keep-all;overflow-wrap:anywhere;letter-spacing:0;line-height:1.15;font-weight:700}
.lvap-cjk .lvap-title{font-size:26px}
.lvap-s{display:inline-block}
.lvap-col{min-width:0}
.lvap-lead{margin:12px 0 0;max-width:60ch;font-size:15px;line-height:1.6;color:rgba(249,250,251,.85);text-wrap:pretty}
.lvap-phone{position:relative;flex-shrink:0;display:block;padding:4px;border-radius:15%/7%;border:1px solid rgba(255,255,255,.22);background:#05080F;box-shadow:0 22px 44px -14px rgba(0,0,0,.8)}
.lvap-phone img{display:block;width:100%;height:auto;aspect-ratio:480/1039;border-radius:12.5%/6%;margin:0;max-width:none}
.lvap-a{display:flex;align-items:center;gap:16px}
.lvap-a .lvap-phone{width:146px;width:clamp(96px,calc(100cqi - 212px),176px)}
.lvap-list{margin:0;padding:0;list-style:none;min-width:0;flex:1}
.lvap-list li{margin:0;padding:0;border-top:1px solid rgba(255,255,255,.1)}
.lvap-list li:last-child{border-bottom:1px solid rgba(255,255,255,.1)}
.lvap-row{display:flex;align-items:flex-start;gap:8px;min-height:44px;padding:12px 0;color:#F9FAFB;text-decoration:none}
.lvap-row:hover .lvap-chev{transform:translateX(2px)}
.lvap .lvap-row:hover,.lvap .lvap-b a:hover{color:#F9FAFB}
.lvap-txt{min-width:0;flex:1}
.lvap-lab{display:block;font-family:'Bebas Neue','Arial Narrow',sans-serif;font-size:20px;line-height:1;letter-spacing:.025em;color:#F9FAFB}
.lvap-line{display:block;margin-top:4px;font-size:13px;line-height:1.4;color:rgba(249,250,251,.75);text-wrap:pretty}
.lvap-feat{display:block;padding:12px 0;font-size:14px;line-height:1.45;color:rgba(249,250,251,.85)}
.lvap-chev{flex-shrink:0;width:16px;height:16px;margin-top:2px;color:#EC4899;transition:transform .2s cubic-bezier(.22,1,.36,1)}
.lvap-b{display:none;margin:0;padding:0;list-style:none}
.lvap-b li{margin:0;padding:0;min-width:0}
.lvap-b a{display:block;color:#F9FAFB;text-decoration:none}
.lvap-b .lvap-phone{width:100%}
.lvap-b .lvap-lab{margin-top:14px;display:flex;align-items:center;gap:4px}
.lvap-side{display:none}
.lvap-act{display:grid;gap:16px}
.lvap-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;border-radius:9999px;background:#DB2777;padding:14px 28px;font-family:'DM Sans',system-ui,sans-serif;font-size:16px;font-weight:700;line-height:1.2;color:#fff;text-decoration:none;box-shadow:0 10px 30px -8px rgba(219,39,119,.7);transition:transform .15s ease,background-color .15s ease}
.lvap-cta:hover{background:#BE185D;color:#fff}
.lvap-cta:active{transform:scale(.98)}
.lvap-cta svg{width:20px;height:20px;flex-shrink:0}
.lvap-note{margin:10px 0 0;font-size:12px;line-height:1.45;color:rgba(249,250,251,.6);text-wrap:pretty}
.lvap-qr{display:none;align-items:center;gap:16px;flex-shrink:0;padding:12px 20px 12px 12px;border-radius:22px;border:1px solid rgba(255,255,255,.14);background:rgba(15,23,42,.4)}
.lvap-qr img{display:block;flex-shrink:0;width:120px;height:120px;border-radius:14px;background:#fff;padding:9px;box-shadow:0 12px 24px -8px rgba(0,0,0,.5);margin:0}
.lvap-qr span{max-width:156px;font-size:14px;font-weight:600;line-height:1.4;color:rgba(249,250,251,.88);text-wrap:pretty}
.lvap-wide{display:none}
.lvap a:focus-visible{outline:2px solid #F9A8D4;outline-offset:3px;border-radius:12px}
@container (max-width:319.98px){
 .lvap-card{padding:16px}
 .lvap-title{font-size:27px}
 .lvap-a{gap:12px}
 .lvap-a .lvap-phone{width:clamp(84px,calc(100cqi - 192px),120px)}
 .lvap-lab{font-size:17px}
}
@container (min-width:560px){
 .lvap-card{padding:28px}
 .lvap-title{font-size:38px}
 .lvap-cjk .lvap-title{font-size:32px}
 .lvap-in{gap:24px}
 .lvap-three .lvap-a{display:none}
 .lvap-three .lvap-b{display:grid;grid-template-columns:repeat(3,minmax(0,224px));justify-content:space-between;gap:20px}
 .lvap-act{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px}
 .lvap-act .lvap-ctaw{flex:1 1 260px;min-width:0}
 .lvap-act .lvap-qr{flex-direction:column;gap:10px;padding:12px;text-align:center}
 .lvap-act .lvap-qr img{width:104px;height:104px;padding:8px}
 .lvap-act .lvap-qr span{max-width:128px;font-size:13px}
 .lvap-cta{width:auto;font-size:18px;white-space:nowrap}
}
@container (min-width:680px){
 .lvap-title{font-size:42px}
 .lvap-cjk .lvap-title{font-size:34px}
 .lvap-one .lvap-in{grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:32px}
 .lvap-one .lvap-a .lvap-phone{display:none}
 .lvap-one .lvap-side{display:flex;flex-direction:column;align-items:center;gap:20px;grid-row:1/span 3;grid-column:2}
 .lvap-one .lvap-side .lvap-phone{width:196px}
 .lvap-one .lvap-side .lvap-qr{flex-direction:column;padding:12px;text-align:center}
 .lvap-one .lvap-side .lvap-qr span{max-width:144px}
 .lvap-one .lvap-act{justify-content:flex-start}
}
@container (min-width:720px){
 .lvap-act .lvap-qr{flex-direction:row;gap:16px;padding:12px 20px 12px 12px;text-align:left}
 .lvap-act .lvap-qr img{width:120px;height:120px;padding:9px}
 .lvap-act .lvap-qr span{max-width:156px;font-size:14px}
}
@media (pointer:fine){@container (min-width:560px){.lvap-qr{display:flex}}}
@container (min-width:900px){
 .lvap-card{padding:36px}
 .lvap-title{font-size:40px}
 .lvap-lead{font-size:16px}
 .lvap-three .lvap-in{grid-template-columns:minmax(0,1fr) auto;column-gap:40px;row-gap:0}
 .lvap-three .lvap-txt0{display:contents}
 .lvap-three .lvap-lockup,.lvap-three .lvap-title{grid-column:1/-1}
 .lvap-three .lvap-col{grid-column:1;grid-row:3;margin-top:28px;display:flex;flex-direction:column}
 .lvap-three .lvap-lead{margin-top:0}
 .lvap-three .lvap-b{grid-column:2;grid-row:3;margin-top:28px;grid-template-columns:repeat(3,clamp(150px,calc((100cqi - 492px) / 3),224px));justify-content:start;gap:20px}
 .lvap-three .lvap-narrow{display:none}
 .lvap-three .lvap-col{justify-content:space-between;align-items:flex-start;gap:28px}
 .lvap-three .lvap-wide{display:contents}
 .lvap-one .lvap-side{flex-direction:row}
 .lvap-one .lvap-side .lvap-phone{width:220px}
 .lvap-qr img{width:140px;height:140px;padding:10px}
}
@container (min-width:1100px){
 .lvap-title{font-size:48px}
 .lvap-lead{font-size:18px}
 .lvap-qr img{width:152px;height:152px}
 .lvap-qr span{font-size:15px}
}
@media (prefers-reduced-motion:reduce){.lvap-chev,.lvap-cta{transition:none}}
.lvap-nudge{position:fixed;left:0;right:0;bottom:0;z-index:40;padding:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));animation:lvSlideUp .45s cubic-bezier(.22,1,.36,1);font-family:'DM Sans',system-ui,sans-serif;color:#F9FAFB}
.lvap-nudge *{box-sizing:border-box}
.lvap-ncard{position:relative;margin:0 auto;max-width:672px;overflow:hidden;border-radius:18px;border:1px solid rgba(255,255,255,.15);background:#0F172A;box-shadow:0 24px 60px -16px rgba(0,0,0,.75),0 0 0 1px rgba(236,72,153,.28)}
.lvap-naur{pointer-events:none;position:absolute;inset:0;background:radial-gradient(80% 120% at 100% 0%,rgba(236,72,153,.32),transparent 60%),radial-gradient(70% 100% at 0% 100%,rgba(34,211,238,.2),transparent 60%)}
.lvap-nrow{position:relative;display:flex;align-items:center;gap:14px;padding:14px}
.lvap-nudge .lvap-phone{width:84px;padding:3px}
.lvap-ntxt{min-width:0;flex:1}
.lvap-nudge .lvap-lockup{padding-right:40px}
.lvap-nudge .lvap-wm{font-size:24px}
.lvap-nudge .lvap-slogan{font-size:12px}
.lvap-ntitle{margin:6px 0 0;font-family:'Bebas Neue','Arial Narrow',sans-serif;font-weight:400;font-size:19px;line-height:1.02;letter-spacing:.025em;color:#F9FAFB;text-wrap:balance}
.lvap-nudge.lvap-cjk .lvap-ntitle{font-size:16px;line-height:1.25;letter-spacing:0;font-weight:700;word-break:keep-all;overflow-wrap:anywhere}
.lvap-nfeat{display:none;flex-wrap:wrap;gap:6px;margin:10px 0 0;padding:0;list-style:none}
.lvap-nfeat li{margin:0;padding:4px 10px;border-radius:9999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);font-size:12px;line-height:1.35;color:rgba(249,250,251,.92);white-space:nowrap}
.lvap-nclose{position:absolute;top:6px;right:6px;z-index:1;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:9999px;border:1px solid rgba(255,255,255,.4);background:rgba(15,23,42,.6);color:#fff;cursor:pointer;padding:0}
.lvap-nclose:hover{background:rgba(255,255,255,.3)}
.lvap-nclose svg{width:20px;height:20px}
.lvap-ncta{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 0 0;min-height:44px;border-radius:9999px;background:#DB2777;padding:11px 16px;font-size:14px;font-weight:700;line-height:1.25;text-align:center;color:#fff;text-decoration:none;box-shadow:0 12px 28px -10px rgba(236,72,153,.9)}
.lvap-ncta:hover{background:#BE185D;color:#fff}
.lvap-ncta svg{width:16px;height:16px;flex-shrink:0}
.lvap-nnote{position:relative;margin:6px 0 0;text-align:center;font-size:11px;line-height:1.35;color:rgba(249,250,251,.6);text-wrap:pretty}
@media (max-width:359px){
 .lvap-nrow{gap:10px;padding:12px}
 .lvap-nudge .lvap-phone{width:64px}
 .lvap-nudge .lvap-wm{font-size:20px}
 .lvap-nnote{display:none}
}
@media (min-width:640px){
 .lvap-nudge{left:auto;width:35rem;max-width:calc(100vw - 2rem);padding:16px}
 .lvap-ncard{margin:0;max-width:none}
 .lvap-nrow{gap:18px;padding:16px}
 .lvap-nudge .lvap-phone{width:116px;padding:4px}
 .lvap-nudge .lvap-wm{font-size:30px}
 .lvap-nudge .lvap-slogan{font-size:13px}
 .lvap-ntitle{margin-top:8px;font-size:22px}
 .lvap-nudge.lvap-cjk .lvap-ntitle{font-size:18px}
 .lvap-nfeat{display:flex}
}
@keyframes lvSlideUp{from{transform:translateY(110%);opacity:0}to{transform:translateY(0);opacity:1}}
@media (prefers-reduced-motion:reduce){.lvap-nudge{animation:none}}
`;

function Lockup() {
  return (
    <p className="lvap-lockup">
      <span className="lvap-wm"><b>#</b>LAPLAND<b>VIBES</b> APP</span>
      <span lang="en" className="lvap-slogan">Everything Lapland.</span>
    </p>
  );
}

function Phone({ screen, lang, alt }: { screen: Screen; lang: string; alt: string }) {
  return (
    <span className="lvap-phone">
      <img src={shotSrc(screen, lang)} alt={alt} width={480} height={1039} loading="lazy" decoding="async" />
    </span>
  );
}

function Qr({ c }: { c: Copy }) {
  return (
    <div className="lvap-qr">
      <img src={QR_SRC} alt="" width={144} height={144} loading="lazy" />
      <span>{c.scan}</span>
    </div>
  );
}

type Props = { focus: Focus; placement?: string };

/* ──────────────────────────────────────────────────────────────────────────
   Etusivun kiinteä lohko (ja laplandvisitin sää- ja hätäsivujen yksiköt: focus aurora / emergency).
   ────────────────────────────────────────────────────────────────────────── */
export function AppPromoHero({ focus, placement = 'hero' }: Props) {
  const { pathname } = useLocation();
  const lang = localeFromPath(pathname);
  const c = copyFor(lang);
  const screens = FOCUS_SCREENS[focus];
  const unit = focus === 'aurora' || focus === 'emergency' ? (UNIT_COPY[focus][lang] ?? UNIT_COPY[focus].en) : null;
  const title = unit ? unit.title : c.title[focus as TextFocus];
  const lead = unit ? unit.lead : c.lead;
  const note = unit ? `${c.note} ${unit.note}` : c.note;
  const surface = unit ? focus : 'promo';
  const label = (s: Screen) => (s === 'aurora' ? (unit?.title ?? '') : plain(c.screens[s][0]));
  const one = screens.length === 1;

  const cta = (
    <div className="lvap-ctaw">
      <a href={appUrl(unit ? SCREEN_TAB[screens[0]] : '', 'cta')} data-umami-event="app_cta" data-umami-event-surface={surface} onClick={() => track(placement)} className="lvap-cta">
        <Download aria-hidden />
        {c.cta}
      </a>
      <p className="lvap-note">{note}</p>
    </div>
  );

  // Hyödyt: kolmen näkymän aiheessa jokainen on syvälinkki näkymäänsä; yksikössä (aurora/emergency) tekstiä.
  const rows = unit
    ? unit.features.map((f) => (
        <li key={f}><span className="lvap-feat">{f}</span></li>
      ))
    : screens.map((s) => (
        <li key={s}>
          <a href={appUrl(SCREEN_TAB[s], s)} data-umami-event="app_cta" data-umami-event-surface={`promo_${s}`} onClick={() => track(`${placement}_${s}`)} className="lvap-row">
            <span className="lvap-txt">
              <span className="lvap-lab"><Phr text={c.screens[s as Exclude<Screen, 'aurora'>][0]} /></span>
              <span className="lvap-line">{fill(c.screens[s as Exclude<Screen, 'aurora'>][1])}</span>
            </span>
            <ChevronRight aria-hidden className="lvap-chev" />
          </a>
        </li>
      ));

  return (
    <section className={`lvap not-prose ${one ? 'lvap-one' : 'lvap-three'}${CJK.has(lang) ? ' lvap-cjk' : ''}`} aria-label={plain(title)}>
      <style>{CSS}</style>
      <div className="lvap-card">
        <div aria-hidden className="lvap-glow" />
        <div className="lvap-in">
          <div className="lvap-txt0" style={{ minWidth: 0 }}>
            <Lockup />
            <h2 className="lvap-title"><Lauseet text={title} /></h2>
            <div className="lvap-col">
              <p className="lvap-lead">{lead}</p>
              {!one && (
                <div className="lvap-wide">
                  {cta}
                  <Qr c={c} />
                </div>
              )}
            </div>
          </div>

          {/* Puhelin: ensimmäinen näkymä isona ja hyödyt sen vieressä. Yksikössä sama myös leveämmällä, kuva sivupalstassa. */}
          <div className="lvap-a">
            <Phone screen={screens[0]} lang={lang} alt={`${c.alt}: ${label(screens[0])}`} />
            <ul className="lvap-list">{rows}</ul>
          </div>

          {!one && (
            <ul className="lvap-b">
              {screens.map((s) => (
                <li key={s}>
                  <a href={appUrl(SCREEN_TAB[s], s)} data-umami-event="app_cta" data-umami-event-surface={`promo_${s}`} onClick={() => track(`${placement}_${s}`)}>
                    <Phone screen={s} lang={lang} alt={`${c.alt}: ${label(s)}`} />
                    <span className="lvap-lab">
                      <Phr text={c.screens[s as Exclude<Screen, 'aurora'>][0]} />
                      <ChevronRight aria-hidden className="lvap-chev" />
                    </span>
                    <span className="lvap-line">{fill(c.screens[s as Exclude<Screen, 'aurora'>][1])}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {one && (
            <div className="lvap-side">
              <Phone screen={screens[0]} lang={lang} alt={`${c.alt}: ${label(screens[0])}`} />
              <Qr c={c} />
            </div>
          )}

          <div className={`lvap-act${one ? '' : ' lvap-narrow'}`}>
            {cta}
            {!one && <Qr c={c} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Muualla: sitoutumisen jälkeen ilmestyvä kortti.
   ────────────────────────────────────────────────────────────────────────── */
export function AppPromoNudge({ focus }: Props) {
  const location = useLocation();
  const lang = localeFromPath(location.pathname);
  const c = copyFor(lang);
  const textFocus: TextFocus = focus === 'aurora' || focus === 'emergency' ? 'general' : focus;
  const first = FOCUS_SCREENS[textFocus][0];
  const [show, setShow] = useState(false);
  // Etusivulla on jo kiinteä lohko: kaksi pyyntöä samalla ruudulla näyttää siltä, että lohko epäonnistui.
  const onFrontPage = isFrontPage(location.pathname);

  useEffect(() => {
    if (onFrontPage) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // yksityinen tila: ei koskaan, ennemmin kuin joka sivulla
    }
    let done = false;
    let retry = 0;
    // 🔴 Ei koskaan kahta pyyntöä yhtä aikaa: uutiskirjepopup on oikea modaali (60 s / 60 %), tämä laukeaa aiemmin.
    const modalUp = () => Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
    const fire = () => {
      if (done) return;
      if (modalUp()) {
        if (retry++ > 20) return cleanup();
        window.setTimeout(fire, 6_000);
        return;
      }
      done = true;
      setShow(true);
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) fire();
    };
    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };
    const timer = window.setTimeout(fire, 45_000);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onExit);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onExit);
    }
    return cleanup;
  }, [onFrontPage]);

  // 🔴 Väistä modaalia myös jälkikäteen (laplandvisit 9.9.2026): kortti oli jo ruudussa, kun uutiskirjemodaali nousi sen
  // päälle. Kortti piiloutuu modaalin ajaksi ja palaa sen jälkeen; nähdyksi sitä ei merkitä, koska sitä ei nähty.
  const [modalUp, setModalUp] = useState(false);
  useEffect(() => {
    if (!show) return;
    const check = () => setModalUp(Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [show]);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* */
    }
  };

  // 🔴 Etusivutarkistus myös tässä: efekti päättää aloittamisesta, mutta ei piilota jo näkyvää korttia, kun lukija siirtyy
  // etusivulle (Vesa 1.8.2026: "se tulee itse asiassa laplandvibes sivulle myös nyt").
  if (!show || onFrontPage || modalUp) return null;
  const title = c.title[textFocus];

  return (
    <div role="complementary" aria-label={plain(title)} className={`lvap-nudge${CJK.has(lang) ? ' lvap-cjk' : ''}`}>
      <style>{CSS}</style>
      <div className="lvap-ncard">
        <div aria-hidden className="lvap-naur" />
        <button type="button" onClick={close} aria-label={c.dismiss} className="lvap-nclose">
          <X aria-hidden strokeWidth={2.5} />
        </button>
        <div className="lvap-nrow">
          <Phone screen={first} lang={lang} alt={first === 'aurora' ? '' : plain(c.screens[first][0])} />
          <div className="lvap-ntxt">
            <Lockup />
            <p className="lvap-ntitle"><Phr text={title} /></p>
            <ul className="lvap-nfeat">
              {FOCUS_SCREENS[textFocus].map((s) => (s === 'aurora' ? null : <li key={s}>{plain(c.screens[s][0])}</li>))}
            </ul>
            <a href={appUrl('', 'nudge')} data-umami-event="app_cta" data-umami-event-surface="promo_nudge" onClick={() => { track('nudge'); close(); }} className="lvap-ncta">
              <Download aria-hidden />
              {c.cta}
            </a>
            <p className="lvap-nnote">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
