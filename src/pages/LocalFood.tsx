import { Leaf, Droplets, Mountain, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygSearchLink } from '../lib/gyg';
import { DINING } from '../data/images';

const localIngredients = [
  {
    name: 'Reindeer',
    fact: '200,000 reindeer roam Finnish Lapland across 56 herding districts. Annual production: 2.1 million kg of meat. The animals graze freely on lichen, moss, and wild plants — no feedlots, no growth hormones.',
    season: 'Year-round (autumn slaughter)',
  },
  {
    name: 'Arctic Char & Salmon',
    fact: "Pulled from some of Europe's cleanest rivers and lakes. Lake Inari alone provides Arctic char, whitefish, and brown trout. Wild-caught, never farmed in Lapland's waterways.",
    season: 'Summer & autumn',
  },
  {
    name: 'Cloudberry (Lakka)',
    fact: "The 'gold of the Arctic' — grows only in subarctic bogs, ripens for 2-3 weeks in July, and cannot be commercially farmed. Finland produces about 500,000 kg annually, mostly wild-picked.",
    season: 'July–August',
  },
  {
    name: 'Wild Bilberry',
    fact: "Finnish wild bilberries contain 3-4x more anthocyanins than cultivated blueberries. Finland's forests produce an estimated 500 million kg annually — only 5-10% is picked.",
    season: 'July–September',
  },
  {
    name: 'Lingonberry',
    fact: 'The most commonly picked wild berry in Finland. Used in jams, sauces, and desserts. The traditional accompaniment to reindeer — the sweet-tart balance is inseparable from Lappish cuisine.',
    season: 'August–October',
  },
  {
    name: 'Wild Mushrooms',
    fact: 'Chanterelles, ceps (porcini), and funnel chanterelles grow abundantly in Lappish forests. Every Finn has the legal right to pick mushrooms and berries anywhere — the ancient "Everyman\'s Right."',
    season: 'August–October',
  },
  {
    name: 'Game Birds',
    fact: 'Willow ptarmigan (riekko) is the most prized game bird of Lapland. Once a peasant staple, now a fine dining delicacy. Wild-caught during the hunting season under strict quotas.',
    season: 'September–March',
  },
  {
    name: 'Wild Herbs',
    fact: 'Arctic angelica, meadowsweet, fireweed, and Arctic thyme. Foraged by hand from fell meadows and forest edges. The midnight sun gives them intense flavor and nutritional density.',
    season: 'June–August',
  },
];

export default function LocalFood() {
  return (
    <>
      <title>Local Food & Arctic Ingredients in Lapland | LaplandDining</title>
      <meta
        name="description"
        content="Why Lapland produces some of Europe's cleanest, most nutrient-dense food — reindeer, Arctic char, cloudberries, wild bilberries, and Everyman's Right foraging in Finnish Lapland."
      />
      <link rel="canonical" href="https://laplanddining.com/local-food" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/local-food',
          headline: 'Local Food & Arctic Ingredients in Finnish Lapland',
          description:
            "Why Lapland produces some of the cleanest, most nutrient-dense food on Earth — and how Finnish food production sets the standard for purity.",
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
      <section className="relative min-h-[60svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.heroLocalFood}
          alt="Local Arctic ingredients on plate"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5">
            Local Food & Ingredients
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Why Lapland produces some of the cleanest, most nutrient-dense food on Earth —
            and how Finnish food production sets the standard for purity.
          </p>
        </div>
      </section>

      {/* Finland's Clean Food */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  Finland: Europe's Cleanest Kitchen
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Finland isn't just clean — it's measurably, scientifically, verifiably clean.
                  The country has some of the world's purest air, water, and soil, and its food
                  production reflects that.
                </p>
                <p>
                  Finnish farming uses less pesticides per hectare than almost any other EU country.
                  Antibiotic use in animal husbandry is among the lowest in Europe. The country's
                  cold winters act as a natural pest control — insects that plague warmer climates
                  simply don't survive the Arctic freeze. This means less chemical intervention
                  and cleaner produce.
                </p>
                <p>
                  The result? Finnish food consistently ranks among the safest in EU food safety
                  audits. Tap water is drinkable everywhere in the country — in Lapland, it comes
                  straight from some of the purest groundwater sources on the continent.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Droplets size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  The Arctic Advantage
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Plants that grow in extreme conditions develop extraordinary qualities. During
                  the Arctic summer, Lapland receives up to 24 hours of continuous sunlight.
                  Berries and herbs photosynthesize around the clock, producing higher concentrations
                  of vitamins, antioxidants, and flavonoids than their southern counterparts.
                </p>
                <p>
                  A wild Finnish bilberry contains 3-4 times more anthocyanins — the compounds
                  that give berries their deep color and health benefits — than a cultivated
                  blueberry grown in temperate climates. Cloudberries are rich in vitamin C,
                  vitamin E, and omega fatty acids. Sea buckthorn berries contain more vitamin C
                  per gram than oranges.
                </p>
                <p>
                  This isn't marketing — it's botany. The harsh environment forces plants to
                  produce more protective compounds, and those compounds are exactly what make
                  Arctic food so nutritious and flavorful.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Leaf size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  Everyman's Right: Nature's Supermarket
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Finland has a remarkable legal tradition called <strong className="text-white/80">jokamiehenoikeus</strong> —
                  Everyman's Right. It grants every person, Finnish citizen or visitor, the legal right
                  to walk, ski, cycle, pick berries, and gather mushrooms anywhere in nature, regardless
                  of who owns the land.
                </p>
                <p>
                  This isn't just a nice gesture — it shapes the entire food culture. Finland's forests
                  produce an estimated 500 million kilograms of wild bilberries annually, but only
                  5-10% is picked. The rest feeds the wildlife and replenishes the ecosystem.
                  Lingonberries, cloudberries, wild raspberries, cranberries, and dozens of mushroom
                  species are free for the taking.
                </p>
                <p>
                  Many of Lapland's best restaurants employ professional foragers who spend their
                  summers harvesting wild herbs, berries, and mushrooms from the fell meadows and
                  old-growth forests surrounding their kitchens. The concept of "farm-to-table" doesn't
                  quite apply here. It's more like "forest-to-table" — and the forest is right outside
                  the door.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Mountain size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  Reindeer: Free-Range by Definition
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Every reindeer in Finnish Lapland lives free. There are no reindeer farms in the
                  conventional sense — the animals roam across 122,936 km² of wilderness, grazing
                  on lichen, moss, wild grasses, and birch leaves. They're semi-domesticated, meaning
                  herders track and manage them, but the animals move where instinct and the seasons
                  take them.
                </p>
                <p>
                  This matters for the meat. A free-ranging reindeer that has spent its life walking
                  across fell landscapes and eating wild plants produces meat that is lean, rich in
                  omega-3 fatty acids, and deeply flavored — nothing like the grain-fed livestock
                  found in conventional farming.
                </p>
                <p>
                  Finland's reindeer industry is managed sustainably through 56 herding cooperatives,
                  with maximum herd sizes capped by law. Roughly 200,000 reindeer are managed across
                  the region, with autumn roundups determining how many can be slaughtered to keep
                  herds healthy and the landscape balanced.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ingredients grid */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              The Ingredients of Lapland
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              What ends up on your plate — and where it comes from.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {localIngredients.map((item) => (
              <div
                key={item.name}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber/20 transition-all duration-300"
              >
                <h3 className="font-heading text-lg text-amber tracking-wide mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                  Season: {item.season}
                </p>
                <p className="text-sm text-white/50 leading-relaxed">{item.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + booking */}
      <section className="py-16 bg-night">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-4">
            Taste It Yourself
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed max-w-2xl mx-auto">
            The best way to understand Lapland's food culture is to experience it.
            Find the restaurants that source directly from local herders, fishermen, and foragers —
            then book a stay within walking distance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              Explore All Restaurants
            </Link>
            <AffiliateCTA
              partner="hotels"
              sid="local_food_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center gap-2 bg-vibe-pink hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 no-underline shadow-lg shadow-vibe-pink/25"
            >
              Book a Lapland stay
            </AffiliateCTA>
            <a
              href={gygSearchLink('lapland cooking class food tour', 'local_food_cooking_classes')}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-2 bg-arctic-cyan/15 hover:bg-arctic-cyan/25 border border-arctic-cyan/40 text-arctic-cyan hover:text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 no-underline"
            >
              Cooking classes & food tours
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
