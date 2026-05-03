import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, ExternalLink, Flame, Snowflake, UtensilsCrossed, TreePine, Star, Award, Clock } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygCategoryLink } from '../lib/gyg';
import { restaurants, cities, partnershipBadge, type Restaurant } from '../data/restaurants';
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
  // New cities — fall back to atmospheric default; Vesa can swap in city-specific imagery later
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

/** Cities where GYG has good food-tour inventory (verified 2026-05-03). */
const cityGygCatalog: Record<string, { citySlug: string; sid: string }> = {
  Rovaniemi: { citySlug: 'rovaniemi-l2653', sid: 'restaurants_rovaniemi_food_tours' },
  Levi: { citySlug: 'levi-l52242', sid: 'restaurants_levi_food_tours' },
};

function hotelsSid(city: string) {
  return `restaurants_stay_${city.toLowerCase().replace(/[^a-z]/g, '_')}`;
}

function description(r: Restaurant) {
  return r.curatedDescription || r.editorialSummary || '';
}

function FeaturedCard({ r }: { r: Restaurant }) {
  const desc = description(r);
  const badge = partnershipBadge(r.partnership);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-amber/20 hover:border-amber/40 transition-all duration-500 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.2)]">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber/0 via-amber/5 to-amber/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row min-h-[280px]">
        {r.photo && (
          <div className="relative sm:w-2/5 min-h-[220px] sm:min-h-0 shrink-0 overflow-hidden">
            <img
              src={r.photo}
              alt={r.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-night/20 to-night/90 hidden sm:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night/20 to-night/90 sm:hidden" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(245,158,11,0.08)_0%,transparent_60%)]" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-amber text-night text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-amber/30 flex items-center gap-1.5">
                <Flame size={10} /> City Top Pick
              </span>
              {badge && (
                <span className="bg-amber/95 text-night text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Award size={10} /> {badge}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="relative flex-1 p-6 sm:p-8 flex flex-col bg-gradient-to-br from-amber/8 via-night to-night">
          <div className="mb-3">
            <h3 className="font-heading text-2xl sm:text-3xl tracking-wide text-white leading-tight group-hover:text-amber transition-colors duration-300">
              {r.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
              {r.type && <span>{r.type}</span>}
              {r.rating && (
                <span className="inline-flex items-center gap-1 text-amber/80">
                  <Star size={12} className="fill-amber" />
                  {r.rating.toFixed(1)}
                  {r.reviewCount && <span className="text-white/35 ml-1">({r.reviewCount.toLocaleString('en')})</span>}
                </span>
              )}
            </div>
          </div>

          {r.cuisine && (
            <p className="text-xs text-amber/70 font-medium uppercase tracking-wider mb-3">{r.cuisine}</p>
          )}
          {desc && (
            <p className="text-sm text-white/55 leading-relaxed mb-4 flex-1">{desc}</p>
          )}

          {r.priceRange && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-amber/40" />
              <p className="text-xs text-amber/60 font-medium">{r.priceRange}</p>
            </div>
          )}

          {r.highlights && r.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {r.highlights.slice(0, 3).map((h) => (
                <span
                  key={h}
                  className="text-xs bg-amber/10 text-amber/80 border border-amber/15 px-2.5 py-1 rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-auto">
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-1.5 text-amber hover:text-white text-sm font-medium transition-colors duration-200 no-underline"
              >
                Website <ExternalLink size={14} />
              </a>
            )}
            <a
              href={r.googleMapsUrl}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1.5 text-arctic-cyan hover:text-white text-sm font-medium transition-colors duration-200 no-underline"
            >
              Google Maps <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ r }: { r: Restaurant }) {
  const desc = description(r);

  return (
    <div className="group relative rounded-2xl p-5 transition-all duration-300 flex flex-col bg-white/[0.03] border border-white/8 hover:bg-gradient-to-br hover:from-amber/6 hover:via-white/[0.04] hover:to-transparent hover:border-amber/25 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]">
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber/0 to-transparent group-hover:via-amber/30 transition-all duration-500" />

      <div className="mb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl tracking-wide text-white leading-tight group-hover:text-amber transition-colors duration-300">
            {r.name}
          </h3>
          <UtensilsCrossed size={14} className="text-white/10 group-hover:text-amber/30 transition-colors duration-300 shrink-0 mt-1.5" />
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-white/35">
          {r.type && <span className="truncate">{r.type}</span>}
          {r.rating && (
            <span className="inline-flex items-center gap-1 text-amber/70 shrink-0">
              <Star size={11} className="fill-amber/70" />
              {r.rating.toFixed(1)}
            </span>
          )}
          {r.priceRange && <span className="text-amber/60 shrink-0">{r.priceRange}</span>}
        </div>
      </div>

      {r.cuisine && (
        <p className="text-xs text-amber/60 font-medium uppercase tracking-wider mb-2">{r.cuisine}</p>
      )}
      {desc && (
        <p className="text-sm text-white/45 leading-relaxed mb-3 flex-1 line-clamp-4">{desc}</p>
      )}

      {r.highlights && r.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {r.highlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="text-xs bg-amber/8 text-amber/70 border border-amber/10 px-2.5 py-1 rounded-full group-hover:border-amber/20 transition-colors duration-300"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
        {r.website && (
          <a
            href={r.website}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="inline-flex items-center gap-1 text-amber/85 hover:text-amber text-xs font-medium transition-all no-underline"
          >
            Website →
          </a>
        )}
        <a
          href={r.googleMapsUrl}
          target="_blank"
          rel="nofollow noopener"
          className="inline-flex items-center gap-1 text-arctic-cyan/80 hover:text-arctic-cyan text-xs font-medium transition-all no-underline"
        >
          Maps →
        </a>
        {r.openingHours && r.openingHours.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 text-white/30 text-[11px]">
            <Clock size={11} />
            {r.openingHours.length} day schedule
          </span>
        )}
      </div>
    </div>
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
              servesCuisine: r.cuisine ?? r.type ?? 'Lappish',
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

      {/* Hero — Apple Safari safe (svh + items-start escape on tall md viewports) */}
      <section className="relative min-h-[65svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(245,158,11,0.06)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Snowflake size={16} className="text-amber/40" />
            <span className="text-amber/60 text-xs font-semibold uppercase tracking-[0.25em]">
              Arctic Dining Guide
            </span>
            <Snowflake size={16} className="text-amber/40" />
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide mb-5 drop-shadow-[0_2px_20px_rgba(245,158,11,0.1)]">
            All Restaurants
          </h1>

          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {restaurants.length} verified restaurants across {cities.length} Lapland destinations.
            <br className="hidden sm:block" />
            Top picks per city — Sámi feasts, fell-top fine dining, kelo log kotas, and ice restaurants.
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

      {/* Restaurant listings */}
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
                {/* City header with atmospheric image */}
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

                {/* Per-city Stay & Eat band — Hotels.com + (where catalogued) GYG food tours */}
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

      {/* Bottom atmospheric section */}
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
