/**
 * HomeAdSlots — etusivun myytävät mainospaikat (LV Media -inventaari).
 *
 * MAINOSMALLI v3 (Vesa 2026-07-12):
 *   1. <SponsorStrip>   — PÄÄKUMPPANI: ohut nauha navin alla JOKA SIVULLA
 *      (oma tiedosto shared/SponsorStrip.tsx; mount App-tasolla). Sivuston
 *      näkyvin tuote, mobiilissa samanarvoinen kuin desktopissa. Kaupanpäällisenä
 *      hubin vasen sivurraili; oikea raili = LV:n omat affiliate-nostot.
 *   2. <HomeAdSlots>    — ETUSIVUN KORTIT A + B: kaksi tasavertaista korttia,
 *      myydään ERIKSEEN kahdelle yrittäjälle. Desktop: A vasen, B oikea
 *      (ostettu puoli pysyy). Mobiili (~80 % kävijöistä): molemmat aina
 *      näkyvissä pinottuna JA ykköspaikka vuorottelee päivittäin tasan 50/50.
 *   3. <PremiumSpotGrid> (erillinen) — PREMIUM-LISTANOSTO listaussivujen
 *      kärkeen (esim. ravintolalistan top-6), ei enää etusivulla.
 *
 * Tyhjät paikat renderöivät house-adin → LV Media -portaali + GA4-event.
 *
 * Integraatio per sivusto:
 *   import SponsorStrip from '../../../shared/SponsorStrip';   // App.tsx, navin alle
 *   import HomeAdSlots from '../../../shared/HomeAdSlots';     // Home.tsx
 *   import { AD_SLOTS } from '../data/adSlots';
 *   <SponsorStrip partner={AD_SLOTS.mainPartner} siteSlug={AD_SLOTS.siteSlug} showHouseAd locale={locale} />
 *   <HomeAdSlots config={AD_SLOTS} locale={locale} />
 *
 * Config src/data/adSlots.ts:
 *   export const AD_SLOTS: HomeAdSlotsConfig = {
 *     siteSlug: 'laplanddining',
 *     mainPartner: null,          // pääkumppani (nauha + vasen raili)
 *     cards: [null, null],        // [0]=A(vasen), [1]=B(oikea) — myydään erikseen
 *     spots: DEFAULT_PREMIUM_SPOTS,  // premium-listanosto (listaussivut)
 *   };
 *
 * Vaaleat sivustot: surface="light". Myyntiprosessi: kauppa → täytä config →
 * build → deploy --branch=main.
 */

import PartnerSlot, { type Partner } from './PartnerSlot';
import { type PremiumSpot } from './PremiumSpotGrid';
import { adSlotsCopy, adLocaleEnabled } from './adSlotsCopy';

export type HomeAdSlotsConfig = {
  /** LV Median sivuslug (lv_sites.slug) — house-adit linkittävät tänne */
  siteSlug: string;
  /** Pääkumppani: nauha (SponsorStrip) + hubin vasen raili */
  mainPartner?: Partner | null;
  /** Etusivun kortit: [0]=A (vasen), [1]=B (oikea) — myydään erikseen */
  cards?: (Partner | null)[];
  /** Premium-listanosto (listaussivut) — 6 kohde-/lista-paikkaa */
  spots: PremiumSpot[];
  /** LEGACY (v2, muut sivustot ennen v3-rollausta): [0]=banneri, [1]=kortti */
  sponsors?: (Partner | null)[];
};

type SurfaceProps = {
  config: HomeAdSlotsConfig;
  locale?: string;
  surface?: 'dark' | 'light';
  /** House-adin äänenvoimakkuus per sivusto — ks. PartnerSlot.houseAdTone. */
  houseAdTone?: 'loud' | 'subtle';
  className?: string;
};

/** Etusivun kortit A/B configista (uusi `cards` tai legacy `sponsors`). */
function homeCards(config: HomeAdSlotsConfig): (Partner | null)[] {
  const src = config.cards ?? config.sponsors ?? [];
  return [src[0] ?? null, src[1] ?? null];
}

/**
 * LEGACY: v2-pääkumppanibanneri heron alle. Korvattu v3:ssa SponsorStripilla.
 * Jätetty exportiksi ettei v2-sivustojen buildit rikkoudu ennen rollausta.
 */
export function MainPartnerBanner({ config, locale, surface = 'dark', houseAdTone = 'loud', className }: SurfaceProps) {
  // Mainospaikat vain fi/en (Vesa 2026-07-13).
  if (!adLocaleEnabled(locale)) return null;
  const t = adSlotsCopy(locale);
  const partner = config.mainPartner ?? config.sponsors?.[0] ?? null;
  return (
    <section data-lv-main-partner className={['px-6 md:px-12 lg:px-20 py-4', className].filter(Boolean).join(' ')}>
      {/* 🔴 This band was handed `bg-deep-night` — the exact page colour — so
          the best-paid placement on the site had no edge and read as page furniture
          (Vesa 2026-08-01: "miksi kaytatte edelleen mainoksissa samaa pohjavaria kun
          sivun tausta on? ei mitaan kontrastia"). A slot we sell has to LOOK like a
          slot, or the buyer is paying for camouflage. Keyed to `surface` so the
          light-themed sites in the network get the same separation inverted. */}
      <div
        className={[
          'max-w-6xl mx-auto rounded-2xl border p-3 sm:p-4',
          houseAdTone === 'subtle' && !partner
            ? 'bg-white/[0.02] border-white/10'
            : surface === 'light' ? 'bg-vibe-pink/[0.05] border-vibe-pink/20' : 'bg-vibe-pink/[0.07] border-vibe-pink/25',
        ].join(' ')}
      >
        <PartnerSlot
          variant="banner"
          partner={partner}
          locale={locale}
          surface={surface}
          houseAdTone={houseAdTone}
          placeholder={{
            siteSlug: config.siteSlug,
            slotId: 'main_partner_1',
            level: 'sponsor',
            label: `${t.mainPartnerOne} · ${t.slotOpen}`,
          }}
        />
      </div>
    </section>
  );
}

export type HomeAdSlotsProps = SurfaceProps & {
  /** Korttien lisäluokat (vaaleiden sivujen pinnat, kun myyty) */
  cardClassName?: string;
};

/**
 * Etusivun kortit A + B. Desktop: A vasen, B oikea (ostettu puoli pysyy).
 * Mobiili: pinottuna, ykköspaikka vuorottelee päivittäin (deterministinen,
 * ei arvontaa — parillinen päivä A ylin, pariton B ylin → tasan 50/50).
 */
export default function HomeAdSlots({ config, locale, surface = 'dark', houseAdTone = 'loud', className, cardClassName }: HomeAdSlotsProps) {
  // Kaksijakoinen kielisääntö (Vesa 2026-07-30, Bear-palaute):
  //   MYYTY kortti näkyy KAIKILLA 12 kielellä — kumppani maksoi näkyvyydestä,
  //   ja Partner.i18n kantaa käännetyt tekstit (PartnerSlot).
  //   HOUSE-AD ("Haluatko mainoksesi tähän?") pysyy fi/en/sv-rajattuna
  //   (Vesa 2026-07-13: mainostilan OSTAJAT asioivat näillä kielillä).
  // Ei myytyä eikä myyntikieltä → koko osio pois.
  const salesLocale = adLocaleEnabled(locale);
  const [a, b] = homeCards(config);
  // 🔴 Vesa 2026-09-04: "poistaa hieman niitä vapaita mainospaikka juttuja".
  // Measured on laplandbars.com/fi: an unsold front page carried a 223 px
  // banner AND a 435 px card both saying "Haluatko mainoksesi tähän?" — 658 px
  // of begging on 20+ sites. One "for sale" sign is honest inventory; two is
  // dead space where a real product rail could earn. The MainPartnerBanner
  // stays as the single sales sign; the empty CARD now renders nothing until
  // it is actually sold. Sold cards are untouched — they render on all 12
  // locales exactly as before.
  if (!a && !b) return null;
  if (!salesLocale && !a && !b) return null;

  const t = adSlotsCopy(locale);
  const light = surface === 'light';

  // Mobiilivuorottelu: pariton päivä → B ylimmäksi vain kapealla (max-sm).
  // Desktopissa (sm+) DOM-järjestys voittaa → A aina vasen, B oikea.
  // Selaimessa `new Date()` on turvallinen (body renderöityy client-sidessä);
  // SSR/prerenderissä oletus = A ylin (ei hydraatiomismatchia meta-only-shellissä).
  //
  // 🔴 VAIN kun MOLEMMAT paikat on myyty (Vesa 2026-07-27). Vuorottelu on
  // reiluussääntö kahden maksavan kumppanin välillä. Jos vain toinen on myyty,
  // vuorottelu nosti joka toinen päivä TYHJÄN "haluatko mainoksesi tähän"
  // -paikan maksavan asiakkaan yläpuolelle mobiilissa — eli asiakas maksoi
  // ykköspaikasta ja sai kakkospaikan puolet ajasta.
  const flipMobile =
    a !== null && b !== null && typeof window !== 'undefined' && new Date().getDate() % 2 === 1;

  // Kumpaakaan paikkaa ei ole myyty → YKSI house-ad, ei kahta identtistä.
  // Auditti 4.8.: tyhjällä sivustolla "Haluatko mainoksesi tähän?" renderöityi
  // kahtena tavulleen samana korttina peräkkäin (mobiilissa päällekkäin) ja
  // kolmantena vielä heron alla MainPartnerBannerissa. Toisto ei myy toista
  // paikkaa — se lukee rikkinäisenä käyttöliittymänä. Kun toinen paikka ON
  // myyty, tyhjä pari säilyy: silloin se on aito kutsu jäljellä olevaan paikkaan.
  const bothEmpty = !a && !b;
  // Vain toinen paikka myyty: kortti B renderöi tyhjää (house-ad vain
  // pääkumppanibannerissa, sääntö 4.9.) ⇒ kaksipalstainen ruudukko jätti
  // oikealle tyhjän aukon (gifts/Keloa, Vesa 5.9.). Yksi myyty kortti saa
  // yhden palstan ja rajatun leveyden — ei aukkoa eikä venytettyä korttia.
  const single = (a !== null && b === null) || (a === null && b !== null);

  return (
    <section
      data-lv-ad-slots
      className={['py-12 sm:py-16 px-6 md:px-12 lg:px-20', className].filter(Boolean).join(' ')}
    >
      <div className="max-w-6xl mx-auto">
        {/* Kävijälle vain neutraali "Kumppanit" — tier-nimet ovat myyntikieltä
            (elävät vain house-adien pitchissä + LV Media -portaalissa). */}
        {!single && (
        <p
          className={[
            'text-xs uppercase tracking-[0.2em] font-semibold mb-5',
            light ? 'text-gray-500' : 'text-[#F9FAFB]/75',
          ].join(' ')}
        >
          {t.partners}
        </p>
        )}

        <div className={[
          'grid grid-cols-1 gap-4 sm:gap-5 items-stretch',
          bothEmpty || single ? '' : 'sm:grid-cols-2',
          // 62rem = sama sisäleveys kuin tuoteriveillä (max-w-5xl − px-4).
          single ? 'max-w-[62rem] mx-auto' : '',
        ].filter(Boolean).join(' ')}>
          {/* Kortti A (vasen desktopissa). House-ad-placeholder vain
              myyntikielillä — muilla lokaaleilla tyhjä paikka ei renderöidy. */}
          <div className="flex">
            <PartnerSlot
              variant="card"
              partner={a}
              locale={locale}
              surface={surface}
              houseAdTone={houseAdTone}
              layout={single ? 'wide' : 'stack'}
              className={['w-full', cardClassName].filter(Boolean).join(' ')}
              placeholder={salesLocale ? { siteSlug: config.siteSlug, slotId: 'card_a', level: 'card' } : undefined}
            />
          </div>
          {/* Kortti B (oikea desktopissa; parittomana päivänä ylin mobiilissa).
              Jätetään pois kun kumpaakaan ei ole myyty — ks. bothEmpty. */}
          {!bothEmpty && !single && (
            <div className={['flex', flipMobile ? 'max-sm:order-first' : ''].filter(Boolean).join(' ')}>
              <PartnerSlot
                variant="card"
                partner={b}
                locale={locale}
                surface={surface}
                houseAdTone={houseAdTone}
                className={['w-full', cardClassName].filter(Boolean).join(' ')}
                placeholder={salesLocale ? { siteSlug: config.siteSlug, slotId: 'card_b', level: 'card' } : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Premium-listanosto (PremiumSpotGrid) importoidaan suoraan
// '../../../shared/PremiumSpotGrid':stä listaussivuille — ks. Restaurants-pilotti.
