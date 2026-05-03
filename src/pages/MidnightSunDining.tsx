import { Sun, Sunset, MapPin, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygCategoryLink } from '../lib/gyg';
import { DINING } from '../data/images';

/**
 * Midnight Sun Dining — the 32-day window June 6 → July 7 when the sun
 * never sets above the Arctic Circle. The under-marketed half of LV's
 * year. Per lv_summer_marketing_gap.md: every site needs a visible
 * summer story.
 */

const summerCities = [
  {
    name: 'Rovaniemi',
    angle: 'Riverside terraces',
    body: "Kemijoki and Ounasjoki meet in the centre — terrace tables at Nili and Roka stay open while the sun loops over the river at 1 a.m. Order salmon caught the same morning.",
    hotelsQuery: 'Rovaniemi, Finland',
    hotelsSid: 'midnight_sun_rovaniemi',
  },
  {
    name: 'Levi',
    angle: 'Fell-top dinners',
    body: "Hullu Poro's terrace + the Levi gondola summer service give you 360° fell views with Lappish small plates. Pack a layer — even at 2 a.m. it can drop to 8 °C.",
    hotelsQuery: 'Levi, Finland',
    hotelsSid: 'midnight_sun_levi',
  },
  {
    name: 'Inari',
    angle: 'Lake Inari midnight grills',
    body: "Aanaar serves a summer tasting menu built around lake fish hauled the morning of. Eat outside facing the lake while the sun grazes the horizon and never dips below.",
    hotelsQuery: 'Inari, Finland',
    hotelsSid: 'midnight_sun_inari',
  },
  {
    name: 'Saariselkä',
    angle: 'Wilderness kotas with the sun still up',
    body: "Pirkon Pirtti and Star Arctic do open-fire reindeer dinners at hours that feel impossible — 11 p.m. starts that finish in full daylight. The kota smoke against the gold sky is the photo.",
    hotelsQuery: 'Saariselkä, Finland',
    hotelsSid: 'midnight_sun_saariselka',
  },
];

export default function MidnightSunDining() {
  return (
    <>
      <title>Midnight Sun Dining in Lapland | LaplandDining</title>
      <meta
        name="description"
        content="Eat outdoors at 1 a.m. with the sun still up — the 32-day midnight sun window in Finnish Lapland (June 6 to July 7). Terraces, kota fires and lake-side tables in Rovaniemi, Levi, Inari and Saariselkä."
      />
      <link rel="canonical" href="https://laplanddining.com/midnight-sun-dining" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/midnight-sun-dining',
          headline: 'Midnight Sun Dining in Finnish Lapland',
          description:
            'Where to eat outdoors during the 32-day midnight sun window in Finnish Lapland — terraces, kota fires and lake-side tables that stay open while the sun loops above the horizon.',
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

      {/* Hero — warm overlay, image-forward, neon yellow accent (per lv_summer_marketing_gap rule) */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <img
          src={DINING.kotaFire}
          alt="Open fire kota dinner during midnight sun in Finnish Lapland"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Warm summer overlay — replaces the cold deep-night default */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/55 via-amber-900/40 to-night/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(253,224,71,0.15)_0%,transparent_55%)]" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-300/15 border border-yellow-300/30 backdrop-blur-sm mb-6">
            <Sun size={14} className="text-yellow-300" />
            <span className="text-yellow-200 text-xs font-semibold tracking-[0.25em] uppercase">
              June 6 → July 7 · 32 days
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight mb-5">
            Dinner at 1 a.m.<br />The sun is still up.
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            For thirty-two days, the sun never sinks below the horizon north of the Arctic Circle.
            Terraces stay open. Kota fires stay lit. The 11 p.m. table is the new 8 p.m. table —
            and Lapland's restaurants quietly become the best summer dining destination in Europe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#cities"
              className="inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-night px-7 py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-400/30 no-underline"
            >
              Where to eat under the midnight sun
              <Sunset size={18} />
            </a>
            <AffiliateCTA
              partner="hotels-seasonal"
              sid="midnight_sun_hero_hotels"
              destination="Lapland, Finland"
              query={{ checkin: '2026-06-15', checkout: '2026-06-18' }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:border-yellow-300/60 hover:bg-white/15 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all duration-300 no-underline"
            >
              Find midnight-sun stays
            </AffiliateCTA>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-3xl mx-auto">
          <p className="text-yellow-300/80 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            What changes
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-6">
            Lapland's other half
          </h2>
          <div className="space-y-5 text-white/65 leading-relaxed">
            <p>
              Most travel writing about Lapland is built around aurora, snow, and reindeer in the
              dark. That's nine months of the year. The other three months are something else
              entirely — and the food culture rises to meet it.
            </p>
            <p>
              From early June to early July, the sun above the Arctic Circle never sets. Even south
              of the line, in Rovaniemi, twilight replaces darkness — at 1 a.m. you can read a
              menu outside without a torch. Terraces that close at 9 p.m. in winter stay open
              until midnight. Kota tents do summer dinner sittings at hours that feel impossible.
            </p>
            <p>
              The ingredients change too. Wild herbs photosynthesise around the clock. Lake fish
              feed in shallow warm water. Forest mushrooms haven't started yet, but cloudberries
              are ripening on the bogs by the end of the window. Restaurants that built their
              reputation on winter game shift, quietly, to a lighter, lake-and-river palette.
            </p>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="py-20 px-4 sm:px-6 lg:px-8 bg-night/95">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              Four cities, four ways to eat the sun
            </h2>
            <p className="text-white/55 text-base max-w-2xl mx-auto">
              Each gives you a different angle on midnight-sun dining. Pair the meal with a stay
              within walking distance — these are the windows when the right hotel matters as
              much as the right table.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summerCities.map((c) => (
              <article
                key={c.name}
                className="group relative bg-gradient-to-br from-amber/8 via-white/[0.03] to-transparent border border-amber/15 hover:border-yellow-300/40 rounded-2xl p-7 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <MapPin size={20} className="text-yellow-300 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-heading text-2xl text-white tracking-wide leading-tight">
                      {c.name}
                    </h3>
                    <p className="text-yellow-300/80 text-xs font-semibold uppercase tracking-wider mt-1">
                      {c.angle}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">{c.body}</p>
                <div className="flex flex-wrap gap-2">
                  <AffiliateCTA
                    partner="hotels-seasonal"
                    sid={c.hotelsSid}
                    destination={c.hotelsQuery}
                    query={{ checkin: '2026-06-15', checkout: '2026-06-18' }}
                    className="inline-flex items-center gap-1.5 bg-amber hover:bg-amber-warm text-night text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-200 no-underline shadow-md shadow-amber/20"
                  >
                    Stay in {c.name}
                  </AffiliateCTA>
                  <a
                    href={gygCategoryLink('lapland-l662', 'food-tours', `midnight_sun_${c.name.toLowerCase()}`)}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 no-underline"
                  >
                    Summer food tours
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 overflow-hidden">
        <img
          src={DINING.fineDining}
          alt="Lapland summer terrace dining"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-night/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(253,224,71,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6">
          <Flame size={32} className="text-yellow-300 mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-4">
            Build your midnight-sun trip
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Pair these tables with the wider Lappish summer — fell hikes, lake swims at 11 p.m.,
            and the rare quiet of an Arctic midsummer. Start with the restaurants you want, then
            book the rest around them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              Browse all restaurants
            </Link>
            <Link
              to="/local-food"
              className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 no-underline"
            >
              Read about Arctic ingredients
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
