import { Flame, Snowflake, TreePine, Fish } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DINING } from '../data/images';

export default function FoodHistory() {
  return (
    <>
      <title>A Story Told Through Food — Lapland's Culinary Heritage | LaplandDining</title>
      <meta
        name="description"
        content="How thousands of years of Arctic survival shaped Lapland's distinctive food culture — Sami reindeer herding, kota fire cooking, river fish, foraged berries, and the New Nordic movement."
      />
      <link rel="canonical" href="https://laplanddining.com/food-history" />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          mainEntityOfPage: 'https://laplanddining.com/food-history',
          headline: "A Story Told Through Food — Lapland's Culinary Heritage",
          description:
            "How thousands of years of Arctic survival shaped one of the world's most distinctive food cultures.",
          image: 'https://lh3.googleusercontent.com/d/12JaYlv_GRvbFwyN95-n0lJdQMK7mCMWS=w1600-rw',
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
          src={DINING.heroFoodStory}
          alt="Traditional Lapland kota cooking"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5">
            A Story Told Through Food
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            How thousands of years of Arctic survival shaped one of the world's
            most distinctive food cultures.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Snowflake size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  Born from Survival
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Long before anyone called it "cuisine," the people of Lapland were solving
                  a problem: how do you feed a family when winter lasts eight months, temperatures
                  drop to -40°C, and the nearest farm is hundreds of kilometers away?
                </p>
                <p>
                  The answer was everywhere around them — in the rivers teeming with salmon and
                  Arctic char, in the forests filled with game and wild berries, and in the vast
                  tundra where reindeer moved with the seasons. For the Sámi people, the indigenous
                  inhabitants of northern Scandinavia, food was never separate from the land.
                  It <em>was</em> the land.
                </p>
                <p>
                  Finnish cuisine as a whole grew from agricultural traditions dating back to
                  prehistoric times. But in the north, farming was never reliable. Harsh conditions
                  meant hunting, fishing, and gathering weren't just supplements — they were survival.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Flame size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  The Reindeer — Everything to Everyone
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Reindeer herding became central to Sámi life during the 19th century, when
                  it replaced hunting and fishing as the primary livelihood in eastern Sápmi.
                  But the relationship between people and reindeer goes back much further — and
                  it's about far more than meat.
                </p>
                <p>
                  Today, Finland has approximately 5,600 reindeer herders managing around 200,000
                  animals across 56 herding districts — covering roughly one-third of Finland's
                  total land area. In 1999–2000, some 93,000 reindeer were slaughtered, producing
                  2.1 million kilograms of meat. The annual industry generates around €60 million.
                </p>
                <p>
                  Unlike Norway and Sweden, reindeer herding in Finland isn't exclusively a Sámi
                  right — any EU citizen can participate with proper approval. But the knowledge,
                  the connection to the land, and the traditions that make reindeer meat taste the
                  way it does? Those come from centuries of Sámi stewardship.
                </p>
                <p>
                  The most iconic dish is <strong className="text-white/80">poronkäristys</strong> —
                  sautéed reindeer, thinly sliced and cooked with butter, served with mashed potatoes
                  and lingonberry jam. Simple, honest, and deeply satisfying. You'll find it in
                  every restaurant in Lapland, from roadside cafés to fine dining establishments.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Fish size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  Water, Ice, and Fire
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Lapland's rivers and lakes have always been its other pantry. Salmon, whitefish,
                  perch, Arctic char, and pike — these fish sustained families through the darkest
                  winters and the brightest midnight sun summers.
                </p>
                <p>
                  The traditional cooking methods are still alive in today's restaurants. Flame-grilled
                  salmon on a wooden board next to an open fire. Smoked whitefish wrapped in birch bark.
                  Fish soup made thick with cream and fresh dill. These aren't "recreations" of old recipes —
                  they're living traditions, passed from generation to generation and now served to
                  travelers from around the world.
                </p>
                <p>
                  Lake Inari, Finland's third-largest lake, provides some of the finest freshwater fish
                  in Europe. Restaurant Aanaar in Inari builds entire tasting menus around what local
                  fishermen pull from its waters that morning.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <TreePine size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  The Forest Floor Pharmacy
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Walk through a Lappish forest in late summer and you're walking through a supermarket.
                  Bilberries, lingonberries, cloudberries, and sea buckthorn grow wild across the Arctic
                  wilderness. Mushrooms — chanterelles, ceps, and the prized matsutake — push through
                  the forest floor. Wild herbs like angelica, meadowsweet, and Arctic thyme scent the air.
                </p>
                <p>
                  The cloudberry holds a special place in Lappish food culture. Called
                  <strong className="text-white/80"> lakka</strong> in Finnish, it grows only in Arctic
                  and subarctic bogs, ripens for just a few weeks in July, and cannot be commercially
                  farmed at scale. Its amber color, honey-like sweetness, and rarity make it the
                  "gold of the Arctic." You'll find it in desserts, liqueurs, and as a garnish at
                  nearly every fine dining restaurant in Lapland.
                </p>
                <p>
                  What makes these wild ingredients extraordinary isn't just their taste — it's
                  their environment. The extreme conditions of the Arctic, with 24 hours of summer
                  sunlight, pristine air, and some of the cleanest water on Earth, produce berries
                  with higher concentrations of vitamins, antioxidants, and flavonoids than their
                  southern counterparts.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Flame size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  From Survival to Art
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  For most of its history, Lappish cooking was about preservation and sustenance.
                  Smoking, drying, salting — these were techniques born from necessity, not creativity.
                  Spices beyond salt were virtually unknown. The food was honest and nourishing, but
                  nobody was plating it on handmade ceramics.
                </p>
                <p>
                  That changed with the New Nordic movement. When restaurants like Noma in Copenhagen
                  began celebrating hyper-local, foraged ingredients in the 2000s, chefs across the
                  Nordic countries started looking at their own backyard with fresh eyes. In Lapland,
                  they found ingredients that most of the world had never tasted — and traditions that
                  were already centuries old.
                </p>
                <p>
                  Today, restaurants like Aanaar in Inari, Nili in Rovaniemi, and Gustav in Rovaniemi
                  are doing something remarkable: they're honoring Sámi traditions while pushing the
                  boundaries of what Arctic cuisine can be. A reindeer dish at Aanaar isn't just food —
                  it's a story of indigenous heritage, environmental stewardship, and culinary innovation
                  served on a single plate.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Snowflake size={24} className="text-amber" />
                <h2 className="font-heading text-3xl text-white tracking-wide">
                  The Kota — Where Stories Are Shared
                </h2>
              </div>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Perhaps the most distinctive dining experience in Lapland isn't a restaurant at all.
                  It's the <strong className="text-white/80">kota</strong> — a traditional Sámi tent,
                  shaped like a tepee, with a fire pit at its center. For centuries, the kota was home,
                  kitchen, and gathering place. Food was cooked over open flame, stories were told,
                  and the smoke carried prayers to the sky.
                </p>
                <p>
                  Today, kota restaurants like Kammi at Hullu Poro in Levi keep this tradition alive.
                  You sit on reindeer furs around a crackling fire while smoked salmon, reindeer
                  sausages, and grilled game are prepared before your eyes. The meal costs €64 per
                  person, but the experience is priceless.
                </p>
                <p>
                  This is what makes Lapland dining different from anywhere else on Earth. It's not
                  just about what's on the plate — it's about the fire, the smoke, the snow outside,
                  the Northern Lights above, and the thousands of years of human ingenuity that made
                  this meal possible.
                </p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 bg-amber hover:bg-amber-warm text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
              >
                Explore the Restaurants
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
