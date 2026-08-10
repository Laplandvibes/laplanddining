import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../i18n/useLocale';
import PhotoCaption from '../components/PhotoCaption';
import MenuLink from '../components/MenuLink';
import { MapPin, Flame, Snowflake, Sun, UtensilsCrossed, TreePine, Star, Award, Quote } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygCategoryLink } from '../lib/gyg';
import { withReferral } from '../lib/outbound';
import PartnerSlot, { type Partner } from '../../../shared/PartnerSlot';
import SubpageAd from '../../../shared/SubpageAd';
import PremiumSpotGrid from '../../../shared/PremiumSpotGrid';
import { adLocaleEnabled } from '../../../shared/adSlotsCopy';
import { PARTNERS, AD_SLOTS } from '../data/partners';
import {
  restaurants, cities, composeCardBody, cuisineLabel,
  googleReviewsUrl, type Restaurant, type Locale,
} from '../data/restaurants';
import { DINING, seasonal, isSummerSeason } from '../data/images';
import PageBreadcrumb from '../components/PageBreadcrumb';
import WhereToNext from '../components/WhereToNext';

const cityImages: Record<string, string> = {
  Rovaniemi: DINING.rovaniemiCenter,
  Levi: DINING.kotaInside,
  Inari: DINING.foodMoody,
  'Saariselkä': seasonal(DINING.auroraRestaurant, DINING.saariselkaSummer),
  Kemi: seasonal(DINING.iceRestaurant, DINING.kemiSummer),
  'Ylläs': DINING.ingredientsAlt,
  Tornio: DINING.ingredients,
  Haparanda: DINING.fineDining,
  Kittilä: DINING.kotaInside,
  'Sodankylä': DINING.foodMoody,
  Pyhätunturi: seasonal(DINING.snowVillage, DINING.pyhaSummer),
  Luosto: seasonal(DINING.snowVillage, DINING.luostoSummer),
  Muonio: DINING.ingredientsAlt,
  Hetta: DINING.foodMoody,
  Kuusamo: DINING.exterior,
  Kemijärvi: DINING.exteriorAlt,
  Salla: seasonal(DINING.snowVillage, DINING.sallaSummer),
  Posio: DINING.foodMoody,
};

const cityGygCatalog: Record<string, { citySlug: string; sid: string }> = {
  Rovaniemi: { citySlug: 'rovaniemi-l2653', sid: 'restaurants_rovaniemi_food_tours' },
  Levi: { citySlug: 'levi-sirkka-l150197', sid: 'restaurants_levi_food_tours' },
};

/**
 * v2.0 (Vesa 3.8.2026): sivu oli 33 000 px / 32 näyttöä tabletilla — 18
 * kaupunkia kaikilla korteillaan + tyhjä house-ad joka kaupungille.
 * Oletusnäkymä näyttää 3 korttia per kaupunki + "Näytä kaikki" -laajennin;
 * kaupunkisuodatin auki = kaikki kortit. Tyhjä "Esittelykumppani"-house-ad
 * renderöityy vain top-6-kohteissa — MYYTY kumppani näkyy aina, kaupungista
 * riippumatta.
 */
const COLLAPSED_CARD_COUNT = 3;
const FEATURED_SLOT_CITIES = new Set(['Rovaniemi', 'Levi', 'Ylläs', 'Saariselkä', 'Kittilä', 'Inari']);

function hotelsSid(city: string) {
  return `restaurants_stay_${city.toLowerCase().replace(/[^a-z]/g, '_')}`;
}

interface CardI18n {
  websiteLabel: string;
  menuLabel: string;
  menuLabelPdf: string;
  mapsLabel: string;
  googleReview: string;
  editorsPickLabel: string;
}

/** fi/en/sv copy for the sellable per-city featured partner slot (KKV: ad-marked). */
function featuredCopy(locale: string) {
  const l = (locale || 'en').toLowerCase();
  if (l.startsWith('fi')) return { ad: 'Mainos', featured: 'Esittelykumppani' };
  if (l.startsWith('sv')) return { ad: 'Annons', featured: 'Utvald partner' };
  return { ad: 'Advertisement', featured: 'Featured partner' };
}

/**
 * Sellable per-city "featured partner" surface at the top of each city's
 * restaurant section (replaces the old free hero-size top-pick card). Same model
 * as the hub resort partner slots: one AdSpec + one optional data row
 * (PARTNERS.cityFeatured[city]). When empty it renders the canonical LIGHT
 * house-ad from shared/PartnerSlot ("Varaa mainospaikka →"). fi/en/sv-gated like
 * every other LV Media ad unit. Never auto-promotes a real restaurant.
 */
function CityFeaturedSlot({ city, slug, partner, locale }: { city: string; slug: string; partner: Partner | null; locale: string }) {
  if (!adLocaleEnabled(locale)) return null;
  const fc = featuredCopy(locale);
  if (partner) {
    return (
      <div className="mb-8" data-city-featured={slug}>
        <p className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
          <span className="inline-flex items-center rounded-full bg-vibe-pink/90 px-2 py-0.5 text-white">{fc.ad}</span>
          <span>{fc.featured} · {city}</span>
        </p>
        <PartnerSlot variant="banner" partner={partner} locale={locale} surface="dark" />
      </div>
    );
  }
  return (
    <div className="mb-8" data-city-featured={slug}>
      <PartnerSlot
        variant="banner"
        partner={null}
        locale={locale}
        surface="dark"
        placeholder={{ siteSlug: AD_SLOTS.siteSlug, slotId: `restaurants_featured_${slug}`, level: 'premium', label: `${fc.featured} · ${city}` }}
      />
    </div>
  );
}

function RestaurantCard({ r, i18n, locale, editorsPick }: { r: Restaurant; i18n: CardI18n; locale: Locale; editorsPick?: boolean }) {
  const body = composeCardBody(r, locale);
  const cuisine = cuisineLabel(r, locale);

  return (
    <article className={`group relative rounded-2xl overflow-hidden bg-cream shadow-[0_15px_35px_-12px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full${editorsPick ? ' ring-1 ring-amber/40' : ''}`}>
      <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
        {r.photo ? (
          <img
            src={r.photo}
            alt={r.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1c14] via-warm-ink to-[#3d2a1d] flex flex-col items-center justify-center gap-2">
            <UtensilsCrossed className="w-9 h-9 text-amber/55" strokeWidth={1.5} />
            {cuisine && (
              <span className="text-amber/60 text-[10px] font-bold uppercase tracking-[0.2em] px-5 text-center leading-snug">{cuisine}</span>
            )}
          </div>
        )}
        <PhotoCaption r={r} locale={locale} />
        {r.rating && (
          <a
            href={googleReviewsUrl(r.googlePlaceId)}
            target="_blank"
            rel="nofollow noopener"
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cream text-warm-ink text-xs font-bold shadow-md hover:bg-amber transition-colors no-underline"
          >
            <Star size={10} className="text-amber fill-amber" />
            <span>{r.rating.toFixed(1)}</span>
            {r.reviewCount && (
              <span className="text-warm-muted font-semibold ml-0.5">· {r.reviewCount.toLocaleString('en')}</span>
            )}
          </a>
        )}
        {(editorsPick || r.priceRange) && (
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {editorsPick && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warm-ink text-cream text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-md">
                <Award size={10} className="text-amber" /> {i18n.editorsPickLabel}
              </span>
            )}
            {r.priceRange && (
              <span className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-amber text-warm-ink text-[11px] font-bold tracking-wide shadow-md">
                {r.priceRange}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-xl tracking-wide text-warm-ink leading-tight mb-1">
          {r.name}
        </h3>
        {cuisine && (
          <p className="text-[11px] text-amber-deep font-semibold uppercase tracking-[0.18em] mb-2.5">
            {cuisine}
          </p>
        )}

        {body && (
          body.isQuote ? (
            <div className="mb-3 flex-1">
              <blockquote className="relative pl-5 text-[14px] text-warm-text leading-relaxed italic line-clamp-4">
                <Quote size={11} className="absolute left-0 top-1.5 text-amber-deep -scale-x-100" />
                {body.text}
              </blockquote>
              <a
                href={googleReviewsUrl(r.googlePlaceId)}
                target="_blank"
                rel="nofollow noopener"
                className="inline-block mt-1.5 ml-5 text-[10px] text-warm-muted hover:text-spice tracking-[0.15em] uppercase font-bold no-underline"
              >
                {i18n.googleReview}
              </a>
            </div>
          ) : (
            <p className="text-[14px] text-warm-text leading-relaxed mb-3 line-clamp-5 flex-1">{body.text}</p>
          )
        )}

        <div className="flex flex-wrap items-center gap-4 mt-auto pt-3 border-t border-warm-ink/10">
          <MenuLink
            restaurant={r}
            label={i18n.menuLabel}
            labelPdf={i18n.menuLabelPdf}
            campaign="dining_menu_restaurants"
          />
          {r.website && (
            <a
              href={withReferral(r.website, 'dining_restaurants')}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
            >
              {i18n.websiteLabel} →
            </a>
          )}
          <a
            href={r.googleMapsUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center gap-1 text-warm-muted hover:text-warm-ink text-xs font-bold uppercase tracking-wider transition-colors no-underline"
          >
            {i18n.mapsLabel} →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Restaurants() {
  const { t } = useTranslation('pages');
  const location = useLocation();
  const { locale } = useLocale();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.slice(1).toLowerCase();
      const match = cities.find(
        (c) => c.toLowerCase().replace(/[^a-z]/g, '') === hash,
      );
      if (match) {
        setActiveCity(match);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const filteredCities = activeCity ? [activeCity] : cities;
  const cityVibes = (t('restaurants.cityVibes', { returnObjects: true }) as Record<string, string>) || {};
  // Decorative season icon must match the hero image, which flips winter↔summer
  // on the same predicate (Snowflake over the snow-village shot Oct–Apr, Sun over
  // the summer-terrace shot May–Sep).
  const summer = isSummerSeason();
  const SeasonIcon = summer ? Sun : Snowflake;

  const cardI18n: CardI18n = {
    websiteLabel: t('restaurants.websiteLabel'),
    menuLabel: t('restaurants.menuLabel'),
    menuLabelPdf: t('restaurants.menuLabelPdf'),
    mapsLabel: t('restaurants.mapsLabel'),
    googleReview: t('restaurants.googleReview'),
    editorsPickLabel: t('restaurants.editorsPick'),
  };

  return (
    <>
      <title>{t('restaurants.title')}</title>
      <meta name="description" content={t('restaurants.description')} />
      <Hreflang path="/restaurants" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://laplanddining.com/' },
            { '@type': 'ListItem', position: 2, name: 'Restaurants', item: 'https://laplanddining.com/restaurants' },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Hand-picked restaurants in and around Finnish Lapland',
          numberOfItems: restaurants.length,
          itemListElement: restaurants.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Restaurant',
              name: r.name,
              servesCuisine: cuisineLabel(r) ?? 'Lappish',
              priceRange: r.priceRange,
              ...(r.website ? { url: r.website } : {}),
              ...(r.menuUrl ? { hasMenu: r.menuUrl } : {}),
              ...(r.rating ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: r.rating,
                  reviewCount: r.reviewCount,
                },
              } : {}),
              address: {
                '@type': 'PostalAddress',
                streetAddress: r.address,
                addressLocality: r.city,
                addressCountry: r.country === 'Finland' ? 'FI' : 'SE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: r.location.latitude,
                longitude: r.location.longitude,
              },
              ...(r.googleMapsUrl ? { hasMap: r.googleMapsUrl } : {}),
            },
          })),
        })}
      </script>

      <section className="relative min-h-[56svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={seasonal(DINING.snowVillage, DINING.heroSummer)}
          alt="Dining in Finnish Lapland"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber/8 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <SeasonIcon size={16} className="text-amber/60" />
            <span className="text-amber/80 text-xs font-semibold uppercase tracking-[0.25em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {t('restaurants.heroKicker')}
            </span>
            <SeasonIcon size={16} className="text-amber/60" />
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('restaurants.heroH1')}
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('restaurants.heroLeadTemplate', { restaurantCount: restaurants.length, cityCount: cities.length })}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-white/85 text-xs uppercase tracking-wider">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-night/50 backdrop-blur-sm px-4 py-2"><Flame size={13} className="text-amber" /> {t('restaurants.heroChipKota')}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-night/50 backdrop-blur-sm px-4 py-2"><TreePine size={13} className="text-amber" /> {t('restaurants.heroChipWilderness')}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-night/50 backdrop-blur-sm px-4 py-2"><SeasonIcon size={13} className="text-amber" /> {t('restaurants.heroChipArctic')}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night to-transparent" />
      </section>

      {/* Alasivun oma mainospaikka heti heron alla — pysyy koko sesongin,
          myydään erikseen. Tyhjänä house-ad (top-liikenteen sivu). */}
      <SubpageAd
        partner={PARTNERS.pages['/restaurants']?.[0] ?? null}
        siteSlug={AD_SLOTS.siteSlug}
        slotId="restaurants"
        locale={locale}
        showHouseAd
        className="bg-night"
      />

      <PageBreadcrumb />

      {/* Filter bar */}
      <section className="sticky top-16 z-30 bg-night/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <UtensilsCrossed size={16} className="text-amber/60 shrink-0" />
            <button
              onClick={() => setActiveCity(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[36px] ${
                !activeCity
                  ? 'bg-amber text-night shadow-lg shadow-amber/20'
                  : 'bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-white/[0.06]'
              }`}
            >
              {t('restaurants.filterAll')}
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(activeCity === city ? null : city)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[36px] ${
                  activeCity === city
                    ? 'bg-amber text-night shadow-lg shadow-amber/20'
                    : 'bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-night min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.06)_0%,transparent_50%)] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium-listanosto: maksaneet ravintolat nousevat listan kärkeen
              kohteittain (Rovaniemi, Levi, Ylläs…). Tyhjänä house-ad. */}
          <div className="mb-12">
            <p className="text-white/75 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              {t('restaurants.premiumHeading', 'Kärkipaikat')}
            </p>
            <PremiumSpotGrid
              spots={AD_SLOTS.spots}
              siteSlug={AD_SLOTS.siteSlug}
              locale={locale}
              surface="dark"
            />
          </div>

          {/* Listing kärkipaikka-partneri — korostettu ensimmäinen rivi (tyhjä = ei renderöidy) */}
          {PARTNERS.listingTop !== null && (
            <div className="mb-8">
              <PartnerSlot variant="listing" partner={PARTNERS.listingTop} locale={locale} />
            </div>
          )}
          {filteredCities.map((city) => {
            const cityRestaurants = restaurants.filter((r) => r.city === city);
            if (cityRestaurants.length === 0) return null;
            const slug = city.toLowerCase().replace(/[^a-z]/g, '');
            const gyg = cityGygCatalog[city];
            const topPick = cityRestaurants.find((r) => r.topPick);
            const others = cityRestaurants.filter((r) => !r.topPick);
            // Editorial top pick shrinks to a normal card (with an earned "Editor's
            // pick" chip) at the front of the grid; the big surface above it is now
            // the sellable per-city featured-partner slot.
            const ordered = topPick ? [topPick, ...others] : others;
            const count = cityRestaurants.length;
            const countLabel = count > 1
              ? t('restaurants.cityRestaurantsPlural')
              : t('restaurants.cityRestaurantsSingular');

            return (
              <div key={city} id={slug} className="mb-20 last:mb-0 scroll-mt-36">
                <div className="relative mb-8 rounded-2xl overflow-hidden group">
                  <div className="relative h-48 sm:h-56">
                    <img
                      src={cityImages[city] || DINING.heroInterior}
                      alt={`Dining in ${city}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-night/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin size={20} className="text-amber" />
                          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide">{city}</h2>
                        </div>
                        <p className="text-white/75 text-sm max-w-lg">{cityVibes[city]}</p>
                      </div>
                      <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 text-sm font-medium px-4 py-2 rounded-full shrink-0">
                        {count} {countLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sellable "Esittelykumppani" surface (KKV: merkitty mainokseksi).
                    Empty = canonical light house-ad, mutta VAIN top-6-kohteissa
                    (v2.0: 18 tyhjää mainosbanneria samalla sivulla söi ruokasisällön).
                    Myyty kumppani renderöityy aina. */}
                {(PARTNERS.cityFeatured[city] != null || FEATURED_SLOT_CITIES.has(city)) && (
                  <CityFeaturedSlot
                    city={city}
                    slug={slug}
                    partner={PARTNERS.cityFeatured[city] ?? null}
                    locale={locale}
                  />
                )}

                {ordered.length > 0 && (() => {
                  const isExpanded = Boolean(activeCity) || expandedCities.has(city);
                  const visible = isExpanded ? ordered : ordered.slice(0, COLLAPSED_CARD_COUNT);
                  const hiddenCount = ordered.length - visible.length;
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                        {visible.map((r) => (
                          <RestaurantCard
                            key={r.googlePlaceId}
                            r={r}
                            i18n={cardI18n}
                            locale={locale}
                            editorsPick={r === topPick}
                          />
                        ))}
                      </div>
                      {hiddenCount > 0 && (
                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setExpandedCities((prev) => new Set(prev).add(city))}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber/40 bg-amber/10 hover:bg-amber/20 text-amber font-semibold text-sm transition-all duration-200 cursor-pointer min-h-[44px]"
                          >
                            {t('restaurants.showAllInCity', { count: ordered.length, city })}
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}

                <div className="mt-8 rounded-2xl border border-white/8 bg-gradient-to-br from-vibe-pink/8 via-night to-night p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div>
                      <p className="text-vibe-pink text-[10px] font-semibold tracking-[0.25em] uppercase mb-1.5">
                        {t('restaurants.stayKicker')}
                      </p>
                      <p className="font-heading text-xl sm:text-2xl text-white tracking-wide">
                        {t('restaurants.stayHeadlineTemplate', { city })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AffiliateCTA
                        partner="hotels"
                        sid={hotelsSid(city)}
                        destination={`${city === 'Ylläs' ? 'Äkäslompolo' : city}, Finland`}
                        className="inline-flex items-center gap-1.5 bg-vibe-pink hover:bg-pink-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 no-underline shadow-md shadow-vibe-pink/20 min-h-[44px]"
                      >
                        {t('restaurants.stayBtnTemplate', { city })}
                      </AffiliateCTA>
                      {gyg && (
                        <a
                          href={gygCategoryLink(gyg.citySlug, 'food-and-drink', gyg.sid, locale)}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className="inline-flex items-center gap-1.5 bg-arctic-cyan/15 hover:bg-arctic-cyan/25 border border-arctic-cyan/40 text-arctic-cyan hover:text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 no-underline min-h-[44px]"
                        >
                          {t('restaurants.foodToursBtnTemplate', { city })}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <img
          src={DINING.kotaFire}
          alt="Kota fire cooking"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-night/85" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6">
          <Flame size={32} className="text-amber/60 mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-4">
            {t('restaurants.bottomHeadlineTemplate', { count: restaurants.length })}
          </h2>
          <p className="text-white/75 leading-relaxed mb-4">
            {t('restaurants.bottomLead', { date: restaurants[0]?.lastVerified || '' })}
          </p>
          <p className="text-white/55 text-sm">
            {t('restaurants.bottomPartner')}{' '}
            <a href="mailto:info@laplandvibes.com" className="text-amber/70 hover:text-amber underline">
              info@laplandvibes.com
            </a>
          </p>
        </div>
      </section>

      <WhereToNext />
    </>
  );
}
