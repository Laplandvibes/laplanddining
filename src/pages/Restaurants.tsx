import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../i18n/useLocale';
import { MapPin, ExternalLink, Flame, Snowflake, Sun, UtensilsCrossed, TreePine, Star, Award, Clock, Quote } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygCategoryLink } from '../lib/gyg';
import PartnerSlot from '../../../shared/PartnerSlot';
import { PARTNERS } from '../data/partners';
import {
  restaurants, cities, partnershipBadgeLocalized, composeCardBody, cuisineLabel, todayHours,
  googleReviewsUrl, localizedStr, type Restaurant, type Locale,
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

function hotelsSid(city: string) {
  return `restaurants_stay_${city.toLowerCase().replace(/[^a-z]/g, '_')}`;
}

interface CardI18n {
  websiteLabel: string;
  mapsLabel: string;
  todayLabel: string;
  cityTopPickLabel: string;
  stayNearby: string;
  readReviews: (count: string) => string;
  googleReview: string;
}

/** Cream-on-dark hero card for the city top pick. */
function FeaturedCard({ r, i18n, locale }: { r: Restaurant; i18n: CardI18n; locale: Locale }) {
  const body = composeCardBody(r, locale);
  const cuisine = cuisineLabel(r, locale);
  const hours = todayHours(r, locale);
  const badge = partnershipBadgeLocalized(r.partnership, locale);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-cream shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)] hover:shadow-[0_40px_80px_-25px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 transition-all duration-500">
      <div className="relative flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {r.photo ? (
            <img
              src={r.photo}
              alt={`${r.name} in ${r.city}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a1c14] via-warm-ink to-[#3d2a1d] flex flex-col items-center justify-center gap-2.5">
              <UtensilsCrossed className="w-12 h-12 text-amber/55" strokeWidth={1.5} />
              {cuisine && (
                <span className="text-amber/60 text-xs font-bold uppercase tracking-[0.22em] px-8 text-center leading-snug">{cuisine}</span>
              )}
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-amber text-warm-ink text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
              <Flame size={10} /> {i18n.cityTopPickLabel}
            </span>
            {badge && (
              <span className="bg-warm-ink text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <Award size={10} className="text-amber" /> {badge}
              </span>
            )}
          </div>

          {r.rating && (
            <a
              href={googleReviewsUrl(r.googlePlaceId)}
              target="_blank"
              rel="nofollow noopener"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cream text-warm-ink shadow-md hover:bg-amber transition-colors no-underline group/rating"
            >
              <Star size={13} className="text-amber fill-amber group-hover/rating:fill-warm-ink" />
              <span className="text-sm font-bold">{r.rating.toFixed(1)}</span>
              {r.reviewCount && (
                <span className="text-warm-muted text-xs font-semibold ml-0.5 group-hover/rating:text-warm-ink">
                  · {r.reviewCount.toLocaleString('en')}
                </span>
              )}
            </a>
          )}
        </div>

        <div className="p-6 sm:p-8 flex flex-col">
          <h3 className="font-heading text-3xl sm:text-4xl text-warm-ink tracking-wide leading-[1.05] mb-2">
            {r.name}
          </h3>
          {(cuisine || r.priceRange) && (
            <p className="text-xs text-amber-deep font-semibold uppercase tracking-[0.18em] mb-4">
              {cuisine}
              {cuisine && r.priceRange && <span className="text-warm-muted mx-2">·</span>}
              {r.priceRange && <span className="font-heading tracking-widest text-amber-deep">{r.priceRange}</span>}
            </p>
          )}

          {body && (
            body.isQuote ? (
              <div className="mb-5">
                <blockquote className="relative pl-7 text-warm-text leading-relaxed text-base italic">
                  <Quote size={16} className="absolute left-0 top-1 text-amber-deep -scale-x-100" />
                  {body.text}
                </blockquote>
                <a
                  href={googleReviewsUrl(r.googlePlaceId)}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-block mt-2 ml-7 text-[11px] text-warm-muted hover:text-spice tracking-[0.15em] uppercase font-bold no-underline"
                >
                  — {i18n.readReviews(r.reviewCount?.toLocaleString('en') ?? '')}
                </a>
              </div>
            ) : (
              <p className="text-warm-text leading-relaxed mb-5">{body.text}</p>
            )
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-warm-muted mb-5">
            {(r.shortAddress || r.address) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-amber-deep" />
                {r.shortAddress || r.address}
              </span>
            )}
            {hours && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} className="text-amber-deep" />
                {i18n.todayLabel}: {hours}
              </span>
            )}
          </div>

          {r.highlights && r.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {r.highlights.slice(0, 4).map((h, i) => {
                const label = localizedStr(h, locale);
                return label ? (
                  <span
                    key={i}
                    className="text-[11px] bg-cream-warm text-amber-deep border border-amber/30 px-2.5 py-1 rounded-full font-semibold"
                  >
                    {label}
                  </span>
                ) : null;
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-auto pt-1">
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-1.5 bg-warm-ink hover:bg-spice text-cream text-sm font-bold px-4 py-2.5 rounded-full transition-all no-underline shadow-md min-h-[40px]"
              >
                {i18n.websiteLabel} <ExternalLink size={14} />
              </a>
            )}
            <a
              href={r.googleMapsUrl}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1.5 bg-cream-warm hover:bg-amber/15 border border-warm-ink/15 text-warm-ink text-sm font-semibold px-4 py-2.5 rounded-full transition-all no-underline min-h-[40px]"
            >
              {i18n.mapsLabel} <ExternalLink size={14} />
            </a>
            <AffiliateCTA
              partner="hotels"
              sid={`featured_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
              destination={`${r.city}, ${r.country}`}
              className="ml-auto inline-flex items-center gap-1.5 bg-vibe-pink hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-full transition-all no-underline shadow-sm shadow-vibe-pink/30"
            >
              {i18n.stayNearby}
            </AffiliateCTA>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ r, i18n, locale }: { r: Restaurant; i18n: CardI18n; locale: Locale }) {
  const body = composeCardBody(r, locale);
  const cuisine = cuisineLabel(r, locale);

  return (
    <article className="group relative rounded-2xl overflow-hidden bg-cream shadow-[0_15px_35px_-12px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
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
        {r.priceRange && (
          <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1.5 rounded-full bg-amber text-warm-ink text-[11px] font-bold tracking-wide shadow-md">
            {r.priceRange}
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
                — {i18n.googleReview}
              </a>
            </div>
          ) : (
            <p className="text-[14px] text-warm-text leading-relaxed mb-3 line-clamp-5 flex-1">{body.text}</p>
          )
        )}

        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-warm-ink/10">
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="sponsored nofollow noopener"
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
    mapsLabel: t('restaurants.mapsLabel'),
    todayLabel: t('restaurants.todayLabel'),
    cityTopPickLabel: t('restaurants.cityTopPickLabel'),
    stayNearby: t('restaurants.stayNearby'),
    readReviews: (count: string) => t('restaurants.readReviews', { count }),
    googleReview: t('restaurants.googleReview'),
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
          name: 'Hand-picked restaurants in Finnish Lapland',
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

      <section className="relative min-h-[55svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
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

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 text-white/75 text-xs uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <span className="flex items-center gap-1.5"><Flame size={12} className="text-amber/70" /> {t('restaurants.heroChipKota')}</span>
            <span className="text-white/55">|</span>
            <span className="flex items-center gap-1.5"><TreePine size={12} className="text-amber/70" /> {t('restaurants.heroChipWilderness')}</span>
            <span className="text-white/55">|</span>
            <span className="flex items-center gap-1.5"><SeasonIcon size={12} className="text-amber/70" /> {t('restaurants.heroChipArctic')}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night to-transparent" />
      </section>

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

                {topPick && (
                  <div className="mb-6">
                    <FeaturedCard r={topPick} i18n={cardI18n} locale={locale} />
                  </div>
                )}

                {others.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                    {others.map((r) => (
                      <RestaurantCard key={r.googlePlaceId} r={r} i18n={cardI18n} locale={locale} />
                    ))}
                  </div>
                )}

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
                        destination={`${city}, Finland`}
                        className="inline-flex items-center gap-1.5 bg-vibe-pink hover:bg-pink-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 no-underline shadow-md shadow-vibe-pink/20 min-h-[44px]"
                      >
                        {t('restaurants.stayBtnTemplate', { city })}
                      </AffiliateCTA>
                      {gyg && (
                        <a
                          href={gygCategoryLink(gyg.citySlug, 'food-and-drink', gyg.sid)}
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
            {t('restaurants.bottomLead', { date: restaurants[0]?.lastVerified || '—' })}
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
