import { Star, MapPin, ExternalLink, Award } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { DINING } from '../data/images';
import { restaurants, partnershipBadge } from '../data/restaurants';

/**
 * Fine Dining = the top-pick restaurant for each city, sorted by Google rating.
 * (Editorial team can override which restaurant counts as topPick for any city
 *  via src/data/restaurant-overrides.ts — see partnership tier upgrades.)
 */
export default function FineDining() {
  const fineDining = restaurants
    .filter((r) => r.topPick)
    .filter((r) => (r.priceRange === '€€€' || r.priceRange === '€€€€') || (r.rating ?? 0) >= 4.5)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <>
      <title>Fine Dining in Lapland — Top-Rated Tasting Menus | LaplandDining</title>
      <meta
        name="description"
        content={`Lapland's top-rated restaurants for tasting menus and fine dining — sorted by Google rating, verified by the LaplandVibes editorial team. ${fineDining.length} city top picks across Finnish Lapland.`}
      />
      <link rel="canonical" href="https://laplanddining.com/fine-dining" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/fine-dining',
          headline: 'Fine Dining in Finnish Lapland',
          description:
            'Top-rated tasting menus across Finnish Lapland — Sámi heritage meets modern Nordic gastronomy.',
          author: { '@type': 'Organization', name: 'LaplandVibes editorial team' },
          publisher: {
            '@type': 'Organization',
            name: 'LaplandDining',
            logo: { '@type': 'ImageObject', url: 'https://laplanddining.com/favicon.svg' },
          },
          datePublished: '2026-05-03',
          inLanguage: 'en',
        })}
      </script>

      {/* Hero */}
      <section className="relative min-h-[60svh] flex items-center justify-center px-4 sm:px-6 [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.fineDining}
          alt="Fine dining in Lapland"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star size={32} className="text-amber" />
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-4">
            Fine Dining in Lapland
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Top-rated tasting menus where Sámi heritage meets modern gastronomy.
            Curated from {restaurants.length} verified Lapland restaurants —
            sorted by Google rating, paired with a hotel within walking distance.
          </p>
        </div>
      </section>

      {/* Fine dining grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fineDining.map((r) => {
              const desc = r.curatedDescription || r.editorialSummary;
              const badge = partnershipBadge(r.partnership);
              return (
                <div
                  key={r.googlePlaceId}
                  className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber/30 transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber/20 via-night to-night/80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-heading text-2xl text-white tracking-wide">{r.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-300 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} className="text-amber" />
                          {r.city}
                        </span>
                        {r.rating && (
                          <span className="inline-flex items-center gap-1 text-amber/85">
                            <Star size={12} className="fill-amber" />
                            {r.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    {badge && (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber/95 text-night text-[10px] font-bold uppercase tracking-wider">
                        <Award size={10} /> {badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {(r.cuisine || r.type) && (
                      <p className="text-xs text-amber/60 font-medium uppercase tracking-wider mb-2">
                        {r.cuisine || r.type}
                      </p>
                    )}
                    {desc && (
                      <p className="text-sm text-white/50 leading-relaxed mb-3">{desc}</p>
                    )}
                    {r.priceRange && (
                      <p className="text-xs text-white/35 italic mb-4">{r.priceRange}</p>
                    )}
                    {r.highlights && r.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {r.highlights.map((h) => (
                          <span
                            key={h}
                            className="text-xs bg-amber/8 text-amber/80 border border-amber/10 px-2.5 py-1 rounded-full"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
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
                        className="inline-flex items-center gap-1.5 text-arctic-cyan/80 hover:text-arctic-cyan text-sm font-medium transition-colors duration-200 no-underline"
                      >
                        Maps <ExternalLink size={14} />
                      </a>
                      <AffiliateCTA
                        partner="hotels"
                        sid={`fine_dining_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
                        destination={`${r.city}, ${r.country}`}
                        className="inline-flex items-center gap-1.5 bg-vibe-pink/15 hover:bg-vibe-pink/25 border border-vibe-pink/40 text-vibe-pink hover:text-white text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 no-underline ml-auto"
                      >
                        Stay in {r.city}
                      </AffiliateCTA>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
