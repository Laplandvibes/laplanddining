import { Info, Globe, ExternalLink } from 'lucide-react';
import { DINING } from '../data/images';

export default function About() {
  return (
    <>
      <title>About LaplandDining — Verified Restaurants in Finnish Lapland</title>
      <meta
        name="description"
        content="LaplandDining is part of the LaplandVibes ecosystem — the editorial guide to verified restaurants across Finnish Lapland. Operated by Lapeso Oy."
      />
      <link rel="canonical" href="https://laplanddining.com/about" />
      <meta name="robots" content="index, follow" />

      {/* Hero */}
      <section className="relative min-h-[50svh] flex items-center justify-center px-4 sm:px-6 [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        <img
          src={DINING.ingredientsAlt}
          alt="Arctic ingredients"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-night/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-5xl sm:text-6xl text-white tracking-wide mb-4">
            About LaplandDining
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your guide to real, verified restaurants across Finnish Lapland.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* About */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={24} className="text-amber" />
              <h2 className="font-heading text-2xl text-white tracking-wide">
                LaplandVibes Network
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              LaplandDining is part of the <strong className="text-white/85">LaplandVibes</strong> ecosystem —
              a family of specialised websites dedicated to helping travellers discover the best of Finnish
              Lapland. Each site focuses on a specific aspect of the Lapland experience: accommodation,
              dining, activities, nature, shopping, nightlife, and more.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Every restaurant listed on LaplandDining is a real, verified establishment. We do not
              list fictional or placeholder restaurants. Our data is researched and verified through
              official sources, local knowledge, and on-the-ground experience.
            </p>
          </div>

          {/* Affiliate Disclosure */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Info size={24} className="text-amber" />
              <h2 className="font-heading text-2xl text-white tracking-wide">
                Affiliate Disclosure
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Some links on LaplandDining are affiliate links — primarily hotel bookings via
              Hotels.com and food experiences via GetYourGuide. We may earn a small commission if you
              book through them, at no extra cost to you. These commissions help us maintain and
              improve this free resource.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our editorial recommendations are always independent. Affiliate partnerships do not
              influence which restaurants we feature or how we describe them. We only recommend places
              we genuinely believe provide a great dining experience.
            </p>
          </div>

          {/* Operator */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="font-heading text-2xl text-white tracking-wide mb-4">
              Operator
            </h2>
            <p className="text-gray-400 leading-relaxed mb-2">
              LaplandDining.com is operated by <strong className="text-white/85">Lapeso Oy</strong>,
              a Finnish company headquartered in Lapland.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Editorial questions, corrections, partnership enquiries, press requests:&nbsp;
              <a
                href="mailto:info@laplandvibes.com"
                className="text-amber hover:text-white transition-colors no-underline"
              >
                info@laplandvibes.com
              </a>
            </p>
          </div>

          {/* Explore more */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="font-heading text-2xl text-white tracking-wide mb-4">
              Explore the Ecosystem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'LaplandVibes Hub', url: 'https://laplandvibes.com' },
                { label: 'LaplandStays', url: 'https://laplandstays.com' },
                { label: 'LaplandHotelDeals', url: 'https://laplandhoteldeals.com' },
                { label: 'LaplandActivities', url: 'https://laplandactivities.online' },
                { label: 'LaplandHuskySafaris', url: 'https://laplandhuskysafaris.com' },
                { label: 'LaplandSkiResorts', url: 'https://laplandskiresorts.com' },
                { label: 'LaplandFood', url: 'https://laplandfood.com' },
                { label: 'LaplandBars', url: 'https://laplandbars.com' },
                { label: 'LaplandNightlife', url: 'https://laplandnightlife.com' },
                { label: 'LaplandWellness', url: 'https://laplandwellness.com' },
                { label: 'LaplandNature', url: 'https://laplandnature.com' },
                { label: 'LaplandVisit', url: 'https://laplandvisit.com' },
                { label: 'LaplandTransport', url: 'https://laplandtransport.com' },
                { label: 'LaplandCarRental', url: 'https://laplandcarrental.com' },
                { label: 'LaplandChristmas', url: 'https://laplandchristmas.com' },
                { label: 'LaplandGifts', url: 'https://laplandgifts.com' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber hover:text-white text-sm font-medium transition-colors no-underline"
                >
                  <ExternalLink size={14} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
