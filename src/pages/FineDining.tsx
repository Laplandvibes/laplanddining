import { Star, MapPin, ExternalLink, Award, Quote } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { DINING } from '../data/images';
import { restaurants, partnershipBadge, composeCardBody, cuisineLabel } from '../data/restaurants';

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
              const body = composeCardBody(r);
              const cuisine = cuisineLabel(r);
              const badge = partnershipBadge(r.partnership);
              return (
                <article
                  key={r.googlePlaceId}
                  className="group bg-cream rounded-2xl overflow-hidden shadow-[0_25px_55px_-20px_rgba(0,0,0,0.65)] hover:shadow-[0_35px_70px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-0.5 transition-all duration-500"
                >
                  <div className="relative h-60 overflow-hidden">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber/30 via-cream-warm to-cream" />
                    )}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-ink/85 backdrop-blur-sm">
                      <MapPin size={11} className="text-amber" />
                      <span className="text-cream text-[10px] font-bold uppercase tracking-[0.15em]">{r.city}</span>
                    </div>
                    {r.rating && (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream text-warm-ink text-xs font-bold shadow-md">
                        <Star size={11} className="text-amber fill-amber" />
                        {r.rating.toFixed(1)}
                      </div>
                    )}
                    {badge && (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber text-warm-ink text-[10px] font-bold uppercase tracking-wider shadow-md">
                        <Award size={10} /> {badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-2xl tracking-wide text-warm-ink leading-tight mb-1">{r.name}</h3>
                    {(cuisine || r.priceRange) && (
                      <p className="text-xs text-amber-deep font-semibold uppercase tracking-[0.18em] mb-3">
                        {cuisine}
                        {cuisine && r.priceRange && <span className="text-warm-muted mx-2">·</span>}
                        {r.priceRange && <span className="font-heading tracking-widest">{r.priceRange}</span>}
                      </p>
                    )}
                    {body && (
                      body.isQuote ? (
                        <blockquote className="relative pl-6 text-sm text-warm-text leading-relaxed italic mb-4">
                          <Quote size={14} className="absolute left-0 top-1 text-amber-deep -scale-x-100" />
                          {body.text}
                          <footer className="not-italic text-[10px] text-warm-muted mt-2 tracking-[0.15em] uppercase">
                            — Recent Google review
                          </footer>
                        </blockquote>
                      ) : (
                        <p className="text-sm text-warm-text leading-relaxed mb-4">{body.text}</p>
                      )
                    )}
                    {r.highlights && r.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {r.highlights.map((h) => (
                          <span
                            key={h}
                            className="text-[11px] bg-cream-warm text-amber-deep border border-amber/30 px-2.5 py-1 rounded-full font-semibold"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-warm-ink/10">
                      {r.website && (
                        <a
                          href={r.website}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
                        >
                          Website <ExternalLink size={12} />
                        </a>
                      )}
                      <a
                        href={r.googleMapsUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center gap-1 text-warm-muted hover:text-warm-ink text-xs font-bold uppercase tracking-wider transition-colors no-underline"
                      >
                        Maps <ExternalLink size={12} />
                      </a>
                      <AffiliateCTA
                        partner="hotels"
                        sid={`fine_dining_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
                        destination={`${r.city}, ${r.country}`}
                        className="ml-auto inline-flex items-center gap-1 bg-vibe-pink hover:bg-pink-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all no-underline shadow-sm shadow-vibe-pink/30"
                      >
                        Stay in {r.city}
                      </AffiliateCTA>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
