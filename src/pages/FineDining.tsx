import { Star, MapPin, ExternalLink } from 'lucide-react';
import AffiliateCTA from '../components/AffiliateCTA';
import { DINING } from '../data/images';
import { restaurants } from '../data/restaurants';

const fineDiningImages: Record<string, string> = {
  'Nili': DINING.featNili,
  'Ravintola Gustav': DINING.featGustav,
  'Kammi at Hullu Poro': DINING.featKammi,
  'Aanaar': DINING.featAanaar,
  'Star Arctic Hotel Restaurant': DINING.featStarArctic,
  'SnowRestaurant': DINING.featSnowRestaurant,
};

export default function FineDining() {
  const fineDining = restaurants.filter((r) => r.featured);

  return (
    <>
      <title>Fine Dining in Lapland — Tasting Menus & Sami Heritage | LaplandDining</title>
      <meta
        name="description"
        content="Lapland's finest tasting menus. Aanaar, Nili, Gustav, Kammi, Star Arctic and SnowRestaurant — Sami heritage meeting modern gastronomy across Inari, Rovaniemi, Levi, Saariselkä and Kemi."
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
            'Tasting menus that pair Sámi food heritage with modern Nordic gastronomy — six restaurants worth planning a trip around.',
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
            Where Sámi heritage meets modern gastronomy. These are the restaurants
            worth planning a trip around — tasting menus, fire-cooked feasts, and
            ingredients you won't find anywhere else on Earth.
          </p>
        </div>
      </section>

      {/* Fine dining grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fineDining.map((r) => (
              <div
                key={r.name}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber/30 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={fineDiningImages[r.name] || DINING.foodCloseup}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-heading text-2xl text-white tracking-wide">{r.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                      <MapPin size={14} className="text-amber" />
                      {r.city}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-amber/60 font-medium uppercase tracking-wider mb-2">{r.type}</p>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">{r.description}</p>
                  {r.price && (
                    <p className="text-xs text-white/25 italic mb-4">{r.price}</p>
                  )}
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
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {r.website && (
                      <a
                        href={r.website}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="inline-flex items-center gap-1.5 text-amber hover:text-white text-sm font-medium transition-colors duration-200 no-underline"
                      >
                        Visit website <ExternalLink size={14} />
                      </a>
                    )}
                    <AffiliateCTA
                      partner="hotels"
                      sid={`fine_dining_stay_${r.city.toLowerCase().replace(/[^a-z]/g, '_')}`}
                      destination={`${r.city}, Finland`}
                      className="inline-flex items-center gap-1.5 bg-vibe-pink/15 hover:bg-vibe-pink/25 border border-vibe-pink/40 text-vibe-pink hover:text-white text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 no-underline ml-auto"
                    >
                      Stay in {r.city}
                    </AffiliateCTA>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
