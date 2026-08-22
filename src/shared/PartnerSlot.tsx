/**
 * PartnerSlot, shared kumppanikortti/-banneri/-listaus
 *
 * Käyttö kaikissa LaplandVibes-ekosysteemisivustoissa.
 *
 * SURFACE-TYYLI -huomio:
 *   Perusrakenne käyttää Tailwind-utilityja jotka toimivat dark-sivustoilla
 *   (hub, skiresorts, husky, dining…). Kevyet/lämpimät teemat (laplandchristmas,
 *   laplandstays) voivat ylikirjoittaa pintatyylit `className`-propilla, 
 *   esim. className="bg-white border-black/10 text-gray-900".
 *   Oletuspinta: bg-white/5 backdrop-blur-sm border border-white/15
 *   (toimii dark-sivustoilla; light-sivustot ohittavat className:lla).
 *
 * DOM-tunniste: jokainen renderöity slot saa data-partner-slot-attribuutin.
 *   Tyhjä paikka ILMAN placeholder-propsia ei tuota DOM:ia lainkaan;
 *   placeholder-propsilla tyhjä paikka renderöi house-adin
 *   (data-partner-slot="house-ad") joka linkittää LV Media -portaaliin.
 *
 * Affiliate-huomio: maksetun mainospaikan linkki käyttää AINA
 *   rel="sponsored nofollow noopener" — samaa LV-speciä kuin shared/ads/AdUnit.
 *   Dofollow-arvo jonka kumppani osti asuu esittelyartikkelin linkeissä, EI
 *   mainos-CTA:ssa (ks. shared/ads/advertisers/bearkuusamo.ts). noreferrer ei
 *   kuulu mihinkään: Worker-reititetty kumppanilinkki lukee Refererin
 *   klikkilokiin, ja suoralle linkille se on tarpeeton.
 */

import { adSlotsCopy, mediaSiteUrl, fireAdvertiseHereClick, normalizeAdLocale } from './adSlotsCopy';

export type Partner = {
  name: string;
  tagline?: string;
  taglineEn?: string;
  /** Swedish tagline for /sv rails (falls back to taglineEn → tagline). */
  taglineSv?: string;
  url: string;
  /**
   * Suomenkielisen sivun linkkikohde, jos kumppanin oma sivusto on kieliversioitu
   * (Niina/Bear 2026-07-30: linkin pitää viedä oikeaan kieliversioon, ei
   * EN-etusivulle). Fallback: `url`. Kortit näkyvät vain fi/en/sv-lokaaleilla,
   * joten fi riittää — sv-versiota kumppaneilla ei toistaiseksi ole.
   */
  urlFi?: string;
  imageSrc?: string;
  /** Lifestyle/mood photo for ad units that show both a photo and the logo. */
  photoSrc?: string;
  /**
   * Kumppanin oma logo, näytetään kortin kuvan oikeassa yläkulmassa valkoisella
   * chipillä (Vesa 2026-07-29).
   *
   * 🔴 MIKSI TÄMÄ ON OLEMASSA: kortti näytti kuvan, nimen ja CTA:n mutta EI
   * kumppanin logoa, vaikka logot olivat jo sivustojen `public/images/partners/`
   * -kansiossa ja `shared/ads/AdUnit.tsx` renderöi ne alasivujen mainoksissa.
   * Maksava kumppani näkyi siis brändinään alasivulla mutta ei etusivulla.
   *
   * Polku on kuluttajasivuston `public/`-juuresta, esim.
   * `/images/partners/bearkuusamo.png`. Käytä TUMMAA/värillistä logoversiota:
   * chip on aina valkoinen, koska logo istuu valokuvan päällä eikä kortin
   * pinnalla — valkoinen tausta takaa kontrastin sekä vaaleilla että tummilla
   * sivustoilla ja millä tahansa kuvalla. Älä siis anna tähän `-white.png`-
   * versiota (se katoaisi chippiin).
   */
  logoSrc?: string;
  /** Logon alt-teksti. Oletus: "{name} logo". Anna jos brändinimi eroaa. */
  logoAlt?: string;
  badgeLabel?: string;
  /**
   * CTA-napin teksti (perusmuoto = fi). 🔴 ANNA TÄMÄ AINA myydylle paikalle.
   * Ilman sitä kortti jää pelkäksi kuvaksi ja nimeksi, jolloin viereinen tyhjä
   * "Varaa mainospaikka" -house-ad näyttää houkuttelevammalta kuin maksava
   * asiakas (Vesa 2026-07-27). Käytä kumppanin hyväksymää CTA-tekstiä.
   */
  ctaLabel?: string;
  ctaLabelEn?: string;
  ctaLabelSv?: string;
  /** Kumppanin brändiväri CTA-napissa. Oletus: LV vibe-pink. */
  accent?: string;
  /**
   * Pidempi kuvaus. Näytetään VAIN sm-koosta ylöspäin: desktopissa korttiin
   * mahtuu enemmän tekstiä, mobiilissa se veisi kortin liian pitkäksi
   * (Vesa 2026-07-27). Käytä kumppanin hyväksymää copya.
   */
  description?: string;
  descriptionEn?: string;
  descriptionSv?: string;
  /**
   * Linkki kumppanin esittelyartikkeliin (LaplandVibes-blogin `Kumppanit`-tagi).
   * 🔴 Kuuluu myytyyn tuotteeseen: mainoksesta pitää päästä myös artikkeliin,
   * ei pelkästään kumppanin omalle sivulle (Vesa 2026-07-27). Tämä on
   * TOIMITUKSELLINEN linkki → ei `sponsored`, ei Worker-reititystä.
   */
  articleUrl?: string;
  articleUrlEn?: string;
  articleUrlSv?: string;
  articleLabel?: string;
  articleLabelEn?: string;
  articleLabelSv?: string;
  /**
   * Käännökset lopuille kielille, avaimena normalizeAdLocale-koodi
   * (de/fr/it/es/pt/nl/ja/ko/zh). 🔴 MYYTY kortti näkyy KAIKILLA 12 kielellä
   * (Vesa 2026-07-30, Bear-palaute) — kumppani maksoi näkyvyydestä, joten
   * pelkät en/fi/sv-kentät eivät riitä. `url` tässä ohittaa myös linkin
   * (esim. Worker-dest kumppanin omaan kieliversioon). Puuttuva kieli
   * putoaa en-fallbackiin.
   */
  i18n?: Partial<Record<string, {
    tagline?: string;
    description?: string;
    cta?: string;
    articleLabel?: string;
    articleUrl?: string;
    url?: string;
  }>>;
};

/**
 * House-ad-konfiguraatio tyhjälle paikalle. Kun partner === null JA tämä on
 * annettu, slotti renderöi "Haluatko mainoksesi tähän?" -house-adin joka
 * linkittää LV Media -portaaliin. Ilman tätä tyhjä paikka ei renderöidy
 * lainkaan (vanha käytös säilyy).
 */
export type SlotPlaceholder = {
  /** LV Median sivuslug (lv_sites.slug), esim. 'laplandstays' */
  siteSlug: string;
  /** GA4-tunniste, esim. 'sponsor_1' */
  slotId: string;
  /** Tekstin kohdennus: pääsponsori-paikka vai premium-paikka */
  level?: 'sponsor' | 'premium' | 'card';
  /** Pieni yläkulmalabel, esim. "Pääkumppani" — oletus adSlotsCopy.slotOpen */
  label?: string;
};

export type PartnerSlotProps = {
  partner: Partner | null;
  variant: 'card' | 'banner' | 'listing';
  locale?: string;
  className?: string;
  /** Tyhjän paikan house-ad — ks. SlotPlaceholder */
  placeholder?: SlotPlaceholder;
  /**
   * House-adin äänenvoimakkuus per sivusto (Vesa 2026-08-16, huskysafaris:
   * "mainospaikat vie liikaa huomiota tällä sivulla"). 'loud' = nykyinen
   * lumipinta + hehku (oletus, verkoston standardi); 'subtle' = tumma lasi,
   * ei hehkua, outline-CTA — paikka näkyy muttei kilpaile sisällön kanssa.
   * Koskee VAIN house-adia; myyty kumppanikortti renderöityy aina samoin.
   */
  houseAdTone?: 'loud' | 'subtle';
  /** Vaaleat sivustot (christmas/stays/hoteldeals/nature): 'light' säätää house-adin värit */
  surface?: 'dark' | 'light';
};

function getBadgeLabel(partner: Partner, locale?: string): string {
  if (partner.badgeLabel) return partner.badgeLabel;
  return adSlotsCopy(locale).badge;
}

/**
 * Locale-valinta kumppanikentille. `base` on perusmuoto (fi), `en`/`sv` ovat
 * ohitukset. Ennen 2026-07-27 kortti ja banneri lukivat `partner.tagline`n
 * raakana, joten suomenkielinen tagline näkyi sellaisenaan /en- ja /sv-sivuilla
 * vaikka tyyppi määritteli ohituskentät. Mainospaikat on portitettu fi/en/sv:hen,
 * joten vain nämä kolme merkitsevät.
 */
function pickLocalized(
  locale: string | undefined,
  base?: string,
  en?: string,
  sv?: string,
): string | undefined {
  const lang = (locale || '').slice(0, 2).toLowerCase();
  if (lang === 'sv') return sv ?? en ?? base;
  if (lang === 'fi') return base ?? en;
  return en ?? base;
}

export default function PartnerSlot({ partner, variant, locale, className, placeholder, surface = 'dark', houseAdTone = 'loud' }: PartnerSlotProps) {
  // Tyhjä paikka: house-ad jos placeholder annettu, muuten ei DOM:ia lainkaan
  if (partner === null) {
    if (!placeholder) return null;
    const t = adSlotsCopy(locale);
    const light = surface === 'light';
    const sub =
      placeholder.level === 'premium' ? t.premiumOpen
      : placeholder.level === 'card' ? t.cardSub
      : t.sponsorSub;
    const topLabel = placeholder.label || t.slotOpen;

    // 🔴 HOUSE-AD KÄÄNTYY PINNAN MUKAAN (Vesa 2026-08-02: "haluatko mainoksesi
    // tähän -osio on vaalea vaaleaa vasten").
    //
    // Paikka oli aiemmin AINA vaalea (`bg-[#F9FAFB]`) riippumatta pinnasta.
    // Tummilla sivustoilla se toimii, mutta vaaleilla (gifts, nature, stays,
    // christmas, hoteldeals) kortti oli lähes sama väri kuin sivu:
    // mitattuna #F9FAFB vs laplandgiftsin #FBF9F5 = 1.01:1, eli ero on
    // olematon. Ainoa erottava tekijä oli katkoviivareunus.
    //
    // Vaaleilla pinnoilla kortti on nyt tumma: #0F172A vs #FBF9F5 = 16.98:1.
    // Väri on verkoston oma deep-night, joten myyntipaikka näyttää
    // tarkoitukselliselta eikä tyhjältä alueelta. Kokeilin myös pinkkejä
    // täyttöjä, mutta ne jäivät 1.31–1.72:1 eli eivät ratkaisseet ongelmaa.
    //
    // Tummilla pinnoilla mikään ei muutu.
    const subtle = houseAdTone === 'subtle';
    const houseFill = subtle
      ? 'bg-white/[0.04] border-white/20 hover:border-[#EC4899]/60'
      : light
      ? 'bg-[#0F172A] border-[#EC4899]/55 hover:border-[#EC4899]'
      : 'bg-[#F9FAFB] border-[#EC4899]/45 hover:border-[#EC4899]';
    const houseTitle = subtle ? 'text-[#F9FAFB]/90' : light ? 'text-[#F9FAFB]' : 'text-[#0F172A]';
    const houseLabel = subtle ? 'text-[#F9FAFB]/60' : light ? 'text-[#F9FAFB]/70' : 'text-[#0F172A]/55';
    const houseSub = subtle ? 'text-[#F9FAFB]/65' : light ? 'text-[#F9FAFB]/75' : 'text-[#0F172A]/65';
    const houseBorderW = subtle ? 'border border-dashed' : 'border-2 border-dashed';
    const houseGlow = subtle
      ? undefined
      : { boxShadow: light ? '0 8px 24px rgba(236,72,153,0.14)' : '0 12px 40px rgba(236,72,153,0.22)' };
    const houseCta = subtle
      ? 'border border-[#EC4899]/50 text-[#EC4899] bg-transparent group-hover:bg-[#EC4899] group-hover:text-white'
      : 'bg-[#EC4899] text-white shadow-sm group-hover:bg-[#DB2777]';

    // BANNER-variantin house-ad: kompakti vaakarivi (heron alle, ei työnnä sisältöä)
    if (variant === 'banner') {
      return (
        <a
          data-partner-slot="house-ad-banner"
          href={mediaSiteUrl(placeholder.siteSlug, locale)}
          onClick={() => fireAdvertiseHereClick(placeholder.siteSlug, placeholder.slotId)}
          className={[
            'group relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 w-full',
            // Vaalea lumipinta myyntipaikalle (Vesa 2026-07-24): erottuu sekä
            // tummilta että vaaleilta sivustoilta, dashed-pinkki = "vapaa paikka".
            'rounded-2xl px-5 py-4 sm:px-7 sm:py-5 transition-all duration-300',
            houseBorderW,
            houseFill,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          // Pinkki hehku inline-tyylinä, EI arbitrary `shadow-[...]`-luokkana:
          // Tailwind v4:n source-skannaus ei emitoi shared/-kansiossa esiintyviä
          // arbitrary-luokkia kaikissa repoissa (todettu 2026-07-26: nightlife
          // 0 kpl `shadow-[`-selektoria, wellness 7), joten hehku katosi
          // hiljaa osalta sivustoja. Arvot ovat samat kuin luokkaversiossa.
          style={houseGlow}
          aria-label={`${topLabel}: ${t.wantYourAd}`}
        >
          {/* Leima AINA otsikon YLLÄ, ei koskaan vieressä eikä katkaistuna.
              Vanha sm:flex-row pani katkaistun leiman ("MISSÄ YÖPYÄ S…")
              rivittyvän otsikon RINNALLE, jolloin kapeassa kontekstissa
              (esim. staysin kohdepaneelin puolikas palsta) leima, otsikko ja
              pilleri asettuivat kolmeen eri linjaan — "ei yhtään visuaalisesti
              nätti" (Vesa 2026-08-09). Pino on robusti joka leveydellä; leveällä
              bannerilla teksti vasemmalla + pilleri oikealla kuten ennenkin,
              ~20 px korkeampana. */}
          <span className="min-w-0 flex-1 basis-60">
            <span className="flex items-center gap-2 mb-1">
              <span aria-hidden="true" className="shrink-0 inline-block w-2 h-2 rounded-full bg-[#EC4899]" />
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${houseLabel}`}>
                {topLabel}
              </span>
            </span>
            <span className={`block font-heading text-xl sm:text-2xl tracking-wide leading-tight ${houseTitle}`}>
              {t.wantYourAd}
            </span>
          </span>
          <span className={`shrink-0 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold group-hover:translate-x-0.5 transition-all duration-200 ${houseCta}`}>
            {t.bookCta}
          </span>
        </a>
      );
    }

    return (
      <a
        data-partner-slot="house-ad"
        href={mediaSiteUrl(placeholder.siteSlug, locale)}
        onClick={() => fireAdvertiseHereClick(placeholder.siteSlug, placeholder.slotId)}
        className={[
          'group relative flex h-full flex-col items-center justify-center text-center gap-2.5',
          // Vaalea lumipinta myyntipaikalle (Vesa 2026-07-24): ks. banner-variantti.
          'rounded-2xl px-6 py-8 sm:py-10 transition-all duration-300',
          houseBorderW,
          houseFill,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        // Ks. banner-variantti: inline-hehku, koska arbitrary shadow ei emitoidu.
        style={houseGlow}
        aria-label={t.wantYourAd}
      >
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${houseLabel}`}>
          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-[#EC4899]" />
          {topLabel}
        </span>
        <p className={`font-heading text-2xl sm:text-3xl tracking-wide leading-tight ${houseTitle}`}>
          {t.wantYourAd}
        </p>
        <p className={`text-sm leading-snug max-w-xs ${houseSub}`}>
          {sub}
        </p>
        <span className={`mt-1.5 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold group-hover:translate-x-0.5 transition-all duration-200 ${houseCta}`}>
          {t.bookCta}
        </span>
      </a>
    );
  }

  const badge = getBadgeLabel(partner, locale);

  // Käännökset i18n-mapista (avain = normalisoitu kieli); en/fi/sv-kentät
  // toimivat fallbackina pickLocalized-polun kautta.
  const i18nLoc = partner.i18n?.[normalizeAdLocale(locale)];

  // Linkki kumppanin oman sivuston kieliversioon: i18n-mapin url ensin,
  // sitten fi-erikoiskenttä, sitten oletus-`url`. (Niina/Bear 2026-07-30.)
  const partnerHref =
    i18nLoc?.url ??
    ((locale || '').slice(0, 2).toLowerCase() === 'fi' && partner.urlFi ? partner.urlFi : partner.url);

  // Gradient-placeholder kuvattomille kumppaneille (LV brand-palette)
  const gradientBg = 'bg-gradient-to-br from-[#0d2818] via-[#0F172A] to-[#1e1b4b]';

  /** Pieni badge-pilleri, aina näkyvissä kuluttajansuojalain edellyttämänä */
  function Badge() {
    return (
      <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-pink-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
        {badge}
      </span>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CARD variant, kuva (tai gradient) + nimi + tagline
  // ────────────────────────────────────────────────────────────────────────────
  const tagline = i18nLoc?.tagline ?? pickLocalized(locale, partner.tagline, partner.taglineEn, partner.taglineSv);
  // A sold card must be legible on the surface it sits on. The card variant used
  // to hardcode dark styling (bg-white/5 + text-snow), so on the cream sites
  // (nature, stays, christmas, hoteldeals) a real partner card rendered as
  // near-white text on near-white — invisible. `surface` now drives it, exactly
  // like the house-ad placeholder above (Vesa 2026-07-27).
  const lightCard = surface === 'light';
  const cta = i18nLoc?.cta ?? pickLocalized(locale, partner.ctaLabel, partner.ctaLabelEn, partner.ctaLabelSv);
  const description = i18nLoc?.description ?? pickLocalized(locale, partner.description, partner.descriptionEn, partner.descriptionSv);
  const articleLabel = i18nLoc?.articleLabel ?? pickLocalized(locale, partner.articleLabel, partner.articleLabelEn, partner.articleLabelSv);
  // Artikkelilinkki per kieli: hubin blogi on EN juuressa ja muut kielet
  // etuliitteen takana, joten yhtä URLia ei voi käyttää kaikille.
  const articleUrl = i18nLoc?.articleUrl ?? pickLocalized(locale, partner.articleUrl, partner.articleUrlEn, partner.articleUrlSv);

  if (variant === 'card') {
    return (
      // 🔴 JUURI ON <div>, EI <a> (Vesa 2026-07-27). Kortissa on nyt KAKSI eri
      // kohdetta: varaus kumppanin sivulle ja linkki esittelyartikkeliin. Linkkiä
      // ei voi upottaa toisen linkin sisään (epävalidi HTML + rikkoo näppäimistö-
      // navigoinnin), joten kortti on säiliö ja linkit ovat sen sisällä.
      <div
        data-partner-slot="card"
        className={[
          'group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300',
          lightCard
            ? 'border-[#0F172A]/12 bg-white shadow-sm hover:border-vibe-pink/50 hover:shadow-md'
            : 'border-white/15 bg-white/5 backdrop-blur-sm hover:border-vibe-pink/40',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <a
          href={partnerHref}
          target="_blank"
          rel="sponsored nofollow noopener"
          aria-label={`${badge}: ${partner.name}`}
          className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibe-pink"
        >
        {/* KUVA + TEKSTI KUVAN PÄÄLLÄ.
            Vesa 2026-07-27: aiemmin kortti oli kuva + nimi + tagline erillisessä
            valkoisessa alaosassa eikä siinä ollut CTA:ta lainkaan. Vieressä oleva
            TYHJÄ paikka taas huusi "HALUATKO MAINOKSESI TÄHÄN?" + iso pinkki
            "Varaa mainospaikka" -nappi, joten vapaa paikka näytti houkuttele-
            vammalta kuin maksava asiakas. Maksetun paikan pitää viestiä että
            tuon voi varata: teksti kuvan päälle scrimin kanssa + oma CTA-nappi,
            samalla logiikalla kuin alasivujen AdUnit. */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {partner.imageSrc ? (
            <img
              src={partner.imageSrc}
              alt={partner.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className={`w-full h-full ${gradientBg}`} />
          )}
          <Badge />
          {/* KUMPPANIN LOGO, kuvan oikea yläkulma (Vesa 2026-07-29).
              Valkoinen chip: logo istuu VALOKUVAN päällä, ei kortin pinnalla,
              joten sen kontrastia ei voi jättää kortin surface-arvon varaan.
              Valkoinen tausta toimii millä tahansa kuvalla ja sekä vaaleilla
              että tummilla sivustoilla — siksi tässä käytetään aina tummaa
              logoversiota, ei `-white.png`:tä.
              "Kumppani"-badge on vasemmassa yläkulmassa → ei törmäystä.
              🔴 Mitat ja pinta INLINE-TYYLINÄ, ei arbitrary-luokkina
              (`h-[40px]`, `max-w-[160px]`, `shadow-[…]`): Tailwind v4:n
              source-skannaus ei emitoi shared/-kansiossa esiintyviä arbitrary-
              luokkia kaikissa repoissa (sama ansa kuin house-adin hehkussa
              yllä — todettu 2026-07-26). */}
          {partner.logoSrc && (
            <div
              className="absolute z-10"
              style={{
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(255,255,255,0.96)',
                borderRadius: '0.75rem',
                padding: '0.375rem 0.625rem',
                boxShadow: '0 4px 14px rgba(15,23,42,0.28)',
              }}
            >
              <img
                src={partner.logoSrc}
                alt={partner.logoAlt ?? `${partner.name} logo`}
                // 🔴 EI `loading="lazy"`: kortin oma valokuva latautuu eagerinä,
                // joten lazy logo saapuisi sen jälkeen ja maksaneen kumppanin
                // brändimerkki "poksahtaisi" paikalleen viiveellä. Logo on
                // ~30 kt, eli säästö ei ole sen arvoinen.
                decoding="async"
                className="block w-auto object-contain"
                style={{ height: 'clamp(26px, 5.5vw, 40px)', maxWidth: '160px' }}
              />
            </div>
          )}
          {/* Scrim: tumma vain alaosassa, jotta kuva itsessään säilyy kirkkaana. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 38%, rgba(15,23,42,0.05) 72%)',
            }}
          />
          {/* Desktopissa korttiin mahtuu enemmän ja isompaa tekstiä (Vesa
              2026-07-27), mobiilissa pidetään tiiviinä ettei kortti veny. */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <p
              className="font-heading text-2xl sm:text-3xl md:text-4xl tracking-wide leading-tight text-white"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.55)' }}
            >
              {partner.name}
            </p>
            {tagline && (
              <p
                className="text-white/90 text-sm sm:text-base md:text-lg leading-snug mt-1 sm:mt-1.5"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.55)' }}
              >
                {tagline}
              </p>
            )}
          </div>
        </div>
        </a>

        {(cta || description || (articleUrl && articleLabel)) && (
          <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            {/* Pidempi kuvaus vain sm+: desktopissa on tilaa, mobiilissa ei. */}
            {description && (
              <p
                className={[
                  'hidden sm:block text-sm md:text-base leading-relaxed',
                  lightCard ? 'text-[#0F172A]/70' : 'text-snow/70',
                ].join(' ')}
              >
                {description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {/* CTA. Renderöityy vain kun kumppanille on annettu ctaLabel —
                  vanhat kumppanit ilman sitä säilyttävät entisen ulkoasunsa. */}
              {cta && (
                <a
                  href={partnerHref}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 hover:translate-x-0.5"
                  style={{ backgroundColor: partner.accent || '#EC4899' }}
                >
                  {cta}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
              {/* Linkki esittelyartikkeliin. TOIMITUKSELLINEN linkki: ei
                  `sponsored`, ei Worker-reititystä — artikkeli on osa myytyä
                  tuotetta ja siitä pitää päästä perille myös mainoksesta. */}
              {articleUrl && articleLabel && (
                <a
                  href={articleUrl}
                  target="_blank"
                  rel="noopener"
                  className={[
                    'inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold underline underline-offset-4 transition-colors',
                    lightCard
                      ? 'text-[#0F172A]/75 decoration-[#0F172A]/25 hover:text-pink-700 hover:decoration-pink-700'
                      : 'text-snow/80 decoration-snow/30 hover:text-pink-400 hover:decoration-pink-400',
                  ].join(' ')}
                >
                  {articleLabel}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // BANNER variant, leveä matala (koko-leveys CTA-banneri)
  // ────────────────────────────────────────────────────────────────────────────
  if (variant === 'banner') {
    return (
      <a
        data-partner-slot="banner"
        href={partnerHref}
        target="_blank"
        rel="sponsored nofollow noopener"
        className={[
          'group relative flex items-center gap-4 overflow-hidden rounded-2xl border',
          'border-white/15 bg-white/5 backdrop-blur-sm px-5 py-4 sm:px-8 sm:py-5',
          'hover:border-vibe-pink/40 transition-all duration-300 w-full',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={`${badge}: ${partner.name}`}
      >
        {/* Pieni kuva/thumbnail tai väripilkku */}
        {partner.imageSrc ? (
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden">
            <img
              src={partner.imageSrc}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${gradientBg}`} />
        )}

        {/* Teksti */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-pink-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
              {badge}
            </span>
          </div>
          <p className="font-heading text-lg sm:text-xl text-snow tracking-wide leading-tight group-hover:text-pink-400 transition-colors truncate">
            {partner.name}
          </p>
          {tagline && (
            <p className="text-snow/65 text-xs sm:text-sm leading-snug truncate">{tagline}</p>
          )}
        </div>

        {/* Nuoli */}
        <span
          aria-hidden="true"
          className="ml-auto shrink-0 text-vibe-pink opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-xl"
        >
          →
        </span>
      </a>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // LISTING variant, rivimuoto (esim. ravintola/aktiviteettilistan korostus)
  // ────────────────────────────────────────────────────────────────────────────
  // variant === 'listing'
  return (
    <a
      data-partner-slot="listing"
      href={partnerHref}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={[
        'group relative flex items-center gap-3 overflow-hidden rounded-xl border',
        'border-vibe-pink/30 bg-vibe-pink/5 px-4 py-3',
        'hover:bg-vibe-pink/10 hover:border-vibe-pink/50 transition-all duration-200 w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${badge}: ${partner.name}`}
    >
      {/* Väripilkku tai pikkukuva */}
      {partner.imageSrc ? (
        <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden">
          <img
            src={partner.imageSrc}
            alt={partner.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`shrink-0 w-10 h-10 rounded-lg ${gradientBg}`} />
      )}

      {/* Teksti */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-pink-600/90 px-1.5 py-px text-[9px] font-semibold uppercase tracking-widest text-white shadow-sm">
            {badge}
          </span>
          <p className="font-body font-semibold text-sm text-snow group-hover:text-pink-400 transition-colors truncate">
            {partner.name}
          </p>
        </div>
        {tagline && (
          <p className="text-snow/55 text-xs leading-snug truncate">{tagline}</p>
        )}
      </div>

      <span
        aria-hidden="true"
        className="ml-auto shrink-0 text-vibe-pink/60 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all duration-200 text-sm"
      >
        →
      </span>
    </a>
  );
}
