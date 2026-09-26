/**
 * Uutisosio — tietomalli (kopioitu laplandflights.fi:n mallista 24.9.2026).
 *
 * Kaksi tiedostotyyppiä per juttu, ei koskaan tekstiä koodissa:
 *   articles/<slug>/meta.json   kieliriippumaton: päivä, kuva + lisenssikuitti, lähteet, upotukset
 *   articles/<slug>/<lang>.json yksi kieli: otsikko, metakuvaus, ingressi, runko
 * Sivuston oma käyttöliittymäteksti: i18n/<lang>.json.
 *
 * Miksi JSON eikä TS: (1) build-skripti scripts/news-prerender.mjs lukee samat
 * tiedostot Nodella (metat, reitit, sivukartta, portit) ilman kääntäjää, ja (2)
 * esirenderin ryömittävä runko (`harvestRecord` + `mode: 'jsonFile'`) poimii
 * kielitiedoston tekstit sellaisenaan ⇒ robotti ja lukija näkevät saman tekstin.
 * 🔴 Kielitiedostoon vain lukijalle näkyvää tekstiä: kaikki ≥40 merkin merkkijonot
 * päätyvät ryömittävään runkoon. URLit, kuvapolut ja lähteiden alkuperäiskieliset
 * otsikot kuuluvat meta.jsoniin.
 */
import type { Lang } from '../i18n/useLang';

export type NewsLang = Lang;

/** Rungon lohko. Rakenne (t + id) on identtinen kaikissa 12 kielessä — portti tarkistaa. */
export type NewsBlock =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'note'; text: string }
  /** Kappale + sisäinen linkki sivuston omalle sivulle. Linkki omana kenttänään eikä
   *  tekstin sisällä: ryömittävä runko poimii tekstin sellaisenaan, ja markdown-merkit
   *  ("[..](..)") näkyisivät siellä raakana. `href` ilman kieliprefiksiä. */
  | { t: 'link'; text: string; label: string; href: string }
  /** Sivuston oma komponentti (tässä: aitakuva). Kieliriippumaton data meta.jsonin
   *  `embeds[id]`:ssä, kielikohtaiset tekstit tässä lohkossa.
   *  🔴 `items` on laplandnaturen lisäys flightsin malliin (24.9.2026): kuvan selitteet
   *  ovat lukijalle näkyvää tekstiä, ja `items`-nimisenä ne kulkevat portin läpi
   *  samoilla tarkistuksilla kuin listan kohdat (rakenne, luvut, välimerkit) ilman
   *  riviäkään uutta porttikoodia. */
  | { t: 'embed'; id: string; title?: string; text?: string; items?: string[] };

export interface NewsText {
  /** Sivun H1 ja kortin otsikko. */
  title: string;
  /** Hakutuloksen otsikko, jos se eroaa H1:stä (≤60 merkkiä). */
  seoTitle?: string;
  /** Metakuvaus 70–160 merkkiä. */
  description: string;
  /** Ingressi H1:n alla ja kortissa. Ei toista otsikon lukua (11-artikkelin-viimeistely §4d). */
  dek: string;
  heroAlt: string;
  heroCaption?: string;
  body: NewsBlock[];
}

export interface PhotoCredit {
  author: string;
  license: string;
  licenseUrl: string;
  /** Kuvan sivu lähteessä (Commons-tiedostosivu tms.). */
  sourceUrl: string;
  /** Kuitti: tiedoston tunniste lähteessä. */
  assetId: string;
  /** Lähde näytettävänä (esim. "Wikimedia Commons"). */
  sourceName: string;
  taken?: string;
  retrieved: string;
}

export interface NewsSource {
  publisher: string;
  /** Lähteen oma otsikko alkuperäiskielellä. */
  title: string;
  url: string;
  /** Julkaisupäivä ISO. */
  date?: string;
  /** Kun sivulla ei ole julkaisupäivää (reittisivu): milloin luettiin, ISO. */
  read?: string;
  /** Sama lähde lukijan kielellä, jos julkaisija tarjoaa sen (Finavian fi/en). */
  localized?: Partial<Record<NewsLang, { title: string; url: string }>>;
}

export interface NewsHero {
  /** Suurin versio (1600 px), polku public/-juuresta. */
  src: string;
  /** Pieni versio kortteihin (800 px). */
  srcSmall: string;
  width: number;
  height: number;
  /** object-position 16:9-kehyksessä, kun kuva on eri kuvasuhteessa (vain näyttö, tiedostoa ei rajata). */
  position?: string;
  credit: PhotoCredit;
}

export interface NewsMeta {
  slug: string;
  /** Julkaisupäivä ISO. */
  date: string;
  updated?: string;
  hero: NewsHero;
  sources: NewsSource[];
  /** Upotusten asetukset id:n mukaan; sivustokohtainen tulkinta src/news/embeds.tsx. */
  embeds?: Record<string, Record<string, unknown>>;
  /** Kontekstuaalinen mainosruudukko jutun alla (sivustokohtainen). */
  ads?: Record<string, unknown>;
}

export interface NewsUi {
  section: string;
  nav: string;
  index: {
    seoTitle: string;
    description: string;
    h1: string;
    lead: string;
    aboutTitle: string;
    aboutText: string;
    allRoutes: string;
  };
  ui: {
    home: string;
    readMore: string;
    published: string;
    updated: string;
    byline: string;
    sources: string;
    source: string;
    read: string;
    photo: string;
    latest: string;
    allNews: string;
    moreNews: string;
  };
}
