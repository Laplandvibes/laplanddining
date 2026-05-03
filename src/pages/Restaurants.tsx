import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, ExternalLink, Flame, Snowflake, UtensilsCrossed, TreePine, Star, Award, Clock, Quote } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygCategoryLink } from '../lib/gyg';
import {
  restaurants, cities, partnershipBadge, composeCardBody, cuisineLabel, todayHours,
  type Restaurant,
} from '../data/restaurants';
import { DINING } from '../data/images';

const cityImages: Record<string, string> = {
  Rovaniemi: DINING.rovaniemiCenter,
  Levi: DINING.kotaInside,
  Inari: DINING.foodMoody,
  'Saariselkä': DINING.auroraRestaurant,
  Kemi: DINING.iceRestaurant,
  'Ylläs': DINING.ingredientsAlt,
  Tornio: DINING.ingredients,
  Haparanda: DINING.fineDining,
  Kittilä: DINING.kotaInside,
  'Sodankylä': DINING.foodMoody,
  Pyhätunturi: DINING.snowVillage,
  Luosto: DINING.snowVillage,
  Muonio: DINING.ingredientsAlt,
  Hetta: DINING.foodMoody,
  Kuusamo: DINING.exterior,
  Kemijärvi: DINING.exteriorAlt,
  Salla: DINING.snowVillage,
  Posio: DINING.foodMoody,
};

const cityVibes: Record<string, string> = {
  Rovaniemi: 'Capital of Lapland — where Arctic culture meets culinary ambition',
  Levi: 'Fireside dining after a day on the fells',
  Kittilä: 'Fell village beyond the Levi resort sprawl',
  Inari: 'Sámi heritage and the purest Arctic ingredients',
  'Saariselkä': 'Wilderness dining under the Northern Lights',
  Kemi: 'Where ice meets fire — unique seasonal experiences',
  'Ylläs': 'Fell village charm with authentic Lappish flavors',
  Tornio: 'Border town character and Finnish soul food',
  Haparanda: 'Cross the border for Swedish-Nordic fusion',
  'Sodankylä': 'River town traditions and the Midnight Sun Film Festival crowd',
  Pyhätunturi: 'Fell-top dining at the southern gateway to wilderness',
  Luosto: 'Amethyst-mountain village with kelo log restaurants',
  Muonio: 'Aurora-belt highlands above the tree line',
  Hetta: 'Enontekiö hub at the edge of three borders',
  Kuusamo: 'Karelian-Lapland crossroads + Ruka resort',
  Kemijärvi: 'Northernmost rail town with riverside tables',
  Salla: 'Wilderness pass + Finland\'s easternmost ski village',
  Posio: 'Lake-and-craft heart of Riisitunturi country',
};

const cityGygCatalog: Record<string, { citySlug: string; sid: string }> = {
  Rovaniemi: { citySlug: 'rovaniemi-l2653', sid: 'restaurants_rovaniemi_food_tours' },
  Levi: { citySlug: 'levi-l52242', sid: 'restaurants_levi_food_tours' },
};

function hotelsSid(city: string) {
  return `restaurants_stay_${city.toLowerCase().replace(/[^a-z]/g, '_')}`;
}

/** Format the city's first restaurant photo or fall back to atmospheric. */
function FeaturedCard({ r }: { r: Restaurant }) {
  const body = composeCardBody(r);
  const cuisine = cuisineLabel(r);
  const hours = todayHours(r);
  const badge = partnershipBadge(r.partnership);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-amber/25 bg-gradient-to-br from-amber/[0.04] via-white/[0.02] to-night/0 hover:border-amber/50 transition-all duration-500">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber/0 via-amber/8 to-amber/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative grid grid-cols-1 md:grid-cols-12">
        {/* Photo column — 5/12 on desktop, full on mobile */}
        <div className="md:col-span-5 relative h-64 sm:h-72 md:h-auto md:min-h-[340px] overflow-hidden">
          {r.photo ? (
            <img
              src={r.photo}
              alt={`${r.name} in ${r.city}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber/20 via-night to-night" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-night/50 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-night/85 md:hidden" />

          {/* Top-pick + partnership badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-amber text-night text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-amber/30 inline-flex items-center gap-1.5">
              <Flame size={10} /> City Top Pick
            </span>
            {badge && (
              <span className="bg-amber/95 text-night text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Award size={10} /> {badge}
              </span>
            )}
          </div>

          {/* Rating pill bottom-right */}
          {r.rating && (
            <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-night/85 backdrop-blur-sm border border-amber/40">
              <Star size={12} className="text-amber fill-amber" />
              <span className="text-white text-sm font-bold">{r.rating.toFixed(1)}</span>
              {r.reviewCount && (
                <span className="text-white/55 text-xs ml-0.5">
                  ({r.reviewCount.toLocaleString('en')})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body column — 7/12 on desktop */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col">
          <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide leading-tight group-hover:text-amber transition-colors duration-300 mb-1">
            {r.name}
          </h3>
          {(cuisine || r.priceRange) && (
            <p className="text-xs text-amber/75 font-semibold uppercase tracking-[0.18em] mb-3">
              {cuisine}
              {cuisine && r.priceRange && <span className="text-amber/40 mx-2">·</span>}
              {r.priceRange}
            </p>
          )}

          {body && (
            body.isQuote ? (
              <blockquote className="relative pl-7 mb-5 text-white/75 leading-relaxed text-base italic">
                <Quote size={16} className="absolute left-0 top-1 text-amber/40 -scale-x-100" />
                {body.text}
                <footer className="not-italic text-[11px] text-white/35 mt-2 tracking-wider">
                  — From a recent Google review
                </footer>
              </blockquote>
            ) : (
              <p className="text-white/65 leading-relaxed mb-5">{body.text}</p>
            )
          )}

          {/* Meta strip — address + today hours */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/50 mb-5">
            {(r.shortAddress || r.address) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-amber/70" />
                {r.shortAddress || r.address}
              </span>
            )}
            {hours && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} className="text-amber/70" />
                Today: {hours}
              </span>
            )}
          </div>

          {r.highlights && r.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {r.highlights.slice(0, 4).map((h) => (
                <span
                  key={h}
                  className="text-[11px] bg-amber/10 text-amber/85 border border-amber/20 px-2 py-0.5 rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3 mt-auto pt-1">
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-1.5 bg-amber hover:bg-amber-warm text-night text-sm font-bold px-4 py-2 rounded-full transition-all no-underline shadow-md shadow-amber/20 min-h-[40px]"
              >
                Visit website <ExternalLink size={14} />
              </a>
            )}
            <a
              href={r.googleMapsUrl}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-all no-underline min-h-[40px]"
            >
              Open in Maps <ExternalLink size={14} />
            </a>
            <AffiliateCTA
              partner="hotels"
              sid={`featured_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
              destination={`${r.city}, ${r.country}`}
              className="ml-auto inline-flex items-center gap-1.5 bg-vibe-pink/15 hover:bg-vibe-pink/25 border border-vibe-pink/40 text-vibe-pink hover:text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full transition-all no-underline"
            >
              Stay nearby
            </AffiliateCTA>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ r }: { r: Restaurant }) {
  const body = composeCardBody(r);
  const cuisine = cuisineLabel(r);

  return (
    <article className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/8 hover:border-amber/35 hover:bg-white/[0.05] transition-all duration-300 flex flex-col h-full">
      {/* Photo header */}
      <div className="relative h-40 sm:h-44 overflow-hidden shrink-0">
        {r.photo ? (
          <img
            src={r.photo}
            alt={r.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber/15 via-night to-night" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
        {r.rating && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-night/85 backdrop-blur-sm border border-amber/35">
            <Star size={10} className="text-amber fill-amber" />
            <span className="text-white text-xs font-bold">{r.rating.toFixed(1)}</span>
          </div>
        )}
        {r.priceRange && (
          <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-amber/95 text-night text-[11px] font-bold tracking-wide">
            {r.priceRange}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-heading text-lg tracking-wide text-white leading-tight mb-1 group-hover:text-amber transition-colors">
          {r.name}
        </h3>
        {cuisine && (
          <p className="text-[11px] text-amber/70 font-semibold uppercase tracking-[0.18em] mb-2">
            {cuisine}
          </p>
        )}

        {body && (
          body.isQuote ? (
            <blockquote className="relative pl-5 mb-3 text-[13px] text-white/55 leading-relaxed italic line-clamp-3 flex-1">
              <Quote size={11} className="absolute left-0 top-1 text-amber/40 -scale-x-100" />
              {body.text}
            </blockquote>
          ) : (
            <p className="text-[13px] text-white/55 leading-relaxed mb-3 line-clamp-3 flex-1">{body.text}</p>
          )
        )}

        {r.reviewCount && r.reviewCount > 0 && (
          <p className="text-[10px] text-white/30 mb-3 tracking-wide uppercase">
            {r.reviewCount.toLocaleString('en')} Google reviews
          </p>
        )}

        {/* CTA row */}
        <div className="flex items-center gap-3 mt-auto pt-1 border-t border-white/5">
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1 text-amber hover:text-amber-warm text-xs font-semibold transition-colors no-underline pt-3"
            >
              Website →
            </a>
          )}
          <a
            href={r.googleMapsUrl}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center gap-1 text-arctic-cyan/80 hover:text-arctic-cyan text-xs font-semibold transition-colors no-underline pt-3"
          >
            Maps →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Restaurants() {
  const location = useLocation();
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

  return (
    <>
      <title>All Restaurants in Lapland — by City | LaplandDining</title>
      <meta
        name="description"
        content={`${restaurants.length} verified restaurants across ${cities.length} Lapland destinations — Rovaniemi, Levi, Inari, Saariselkä, Kemi, Ylläs, Sodankylä, Kuusamo, Hetta and more. Top picks per city, ratings, opening hours, hotel CTAs.`}
      />
      <link rel="canonical" href="https://laplanddining.com/restaurants" />
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
          name: 'Verified restaurants in Finnish Lapland',
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
          src={DINING.snowVillage}
          alt="Snow village dining in Lapland"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/40 to-night" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber/8 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Snowflake size={16} className="text-amber/40" />
            <span className="text-amber/60 text-xs font-semibold uppercase tracking-[0.25em]">
              Arctic Dining Guide
            </span>
            <Snowflake size={16} className="text-amber/40" />
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_20px_rgba(245,158,11,0.1)]">
            All Restaurants
          </h1>

          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {restaurants.length} verified restaurants across {cities.length} Lapland destinations.
            <br className="hidden sm:block" />
            Real customer reviews, photos, and opening hours — paired with a hotel walking distance away.
          </p>

          <div className="flex items-center justify-center gap-6 text-white/30 text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Flame size={12} className="text-amber/50" /> Kota Dining</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><TreePine size={12} className="text-amber/50" /> Wilderness</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><Snowflake size={12} className="text-amber/50" /> Arctic</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night to-transparent" />
      </section>

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
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/[0.06]'
              }`}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(activeCity === city ? null : city)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[36px] ${
                  activeCity === city
                    ? 'bg-amber text-night shadow-lg shadow-amber/20'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/[0.06]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-night min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCities.map((city) => {
            const cityRestaurants = restaurants.filter((r) => r.city === city);
            if (cityRestaurants.length === 0) return null;
            const slug = city.toLowerCase().replace(/[^a-z]/g, '');
            const gyg = cityGygCatalog[city];
            const topPick = cityRestaurants.find((r) => r.topPick);
            const others = cityRestaurants.filter((r) => !r.topPick);

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
                        <p className="text-white/50 text-sm max-w-lg">{cityVibes[city]}</p>
                      </div>
                      <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 text-sm font-medium px-4 py-2 rounded-full shrink-0">
                        {cityRestaurants.length} restaurant{cityRestaurants.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {topPick && (
                  <div className="mb-6">
                    <FeaturedCard r={topPick} />
                  </div>
                )}

                {others.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                    {others.map((r) => (
                      <RestaurantCard key={r.googlePlaceId} r={r} />
                    ))}
                  </div>
                )}

                <div className="mt-8 rounded-2xl border border-white/8 bg-gradient-to-br from-vibe-pink/8 via-night to-night p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div>
                      <p className="text-vibe-pink text-[10px] font-semibold tracking-[0.25em] uppercase mb-1.5">
                        Stay near these tables
                      </p>
                      <p className="font-heading text-xl sm:text-2xl text-white tracking-wide">
                        Book {city} hotels — walk to dinner
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AffiliateCTA
                        partner="hotels"
                        sid={hotelsSid(city)}
                        destination={`${city}, Finland`}
                        className="inline-flex items-center gap-1.5 bg-vibe-pink hover:bg-pink-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 no-underline shadow-md shadow-vibe-pink/20 min-h-[44px]"
                      >
                        Browse {city} stays
                      </AffiliateCTA>
                      {gyg && (
                        <a
                          href={gygCategoryLink(gyg.citySlug, 'food-and-drink', gyg.sid)}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className="inline-flex items-center gap-1.5 bg-arctic-cyan/15 hover:bg-arctic-cyan/25 border border-arctic-cyan/40 text-arctic-cyan hover:text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 no-underline min-h-[44px]"
                        >
                          {city} food tours
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
            Curated from {restaurants.length} verified restaurants
          </h2>
          <p className="text-white/50 leading-relaxed mb-4">
            Catalogue sourced from Google Places (rating × review count, fast-food chains
            excluded), then editorially picked top-1 per city by the LaplandVibes team.
            Every quote on this page comes from a real Google review.
            Updated {restaurants[0]?.lastVerified || '—'}.
          </p>
          <p className="text-white/30 text-sm">
            Are you a restaurant owner? Verified Partner listings get hand-curated copy,
            menu highlights, and an upgraded card.{' '}
            <a href="mailto:info@laplandvibes.com" className="text-amber/70 hover:text-amber underline">
              info@laplandvibes.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
