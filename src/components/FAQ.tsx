import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';
import { DINING } from '../data/images';

interface FAQItem {
  question: string;
  answer: string;
}

// Per-question deep links into the pages that actually back each answer
// (network model: laplandsnowmobile FAQ — FAQ answers must link to our own
// supporting content). Keys are nav.links entries → labels come
// pre-translated in all 11 locales.
const FAQ_ROUTE = {
  restaurants: '/restaurants',
  fineDining: '/fine-dining',
  midnightSun: '/midnight-sun-dining',
  foodHistory: '/food-history',
  localFood: '/local-food',
} as const;
const FAQ_LINKS: (keyof typeof FAQ_ROUTE)[][] = [
  ['fineDining', 'restaurants'],  // 1 Aanaar → fine dining + full catalogue
  ['foodHistory', 'localFood'],   // 2 poronkäristys → food story + ingredients
  ['foodHistory', 'restaurants'], // 3 kota dining → food story + where to eat one
  ['midnightSun'],                // 4 outdoor dining window → midnight-sun guide
  ['localFood'],                  // 5 Arctic ingredients → local food
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation('pages');
  const { t: tNav } = useTranslation('nav');
  const { to } = useLocale();
  const items = t('home.faq.items', { returnObjects: true }) as FAQItem[];

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 bg-night border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
          <div className="md:col-span-5 md:sticky md:top-24 md:self-start">
            <p className="text-amber text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              {t('home.faq.eyebrow')}
            </p>
            <h2 className="font-heading tracking-wide text-4xl sm:text-5xl md:text-6xl text-white mb-5 leading-[0.95]">
              {t('home.faq.headline')}
            </h2>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-7">
              {t('home.faq.lead')}
            </p>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-6">
              <img
                src={DINING.kotaInside}
                alt="Traditional Sami kota dining around an open fire in Lapland"
                className="w-full h-64 sm:h-80 object-cover"
                loading="lazy"
                decoding="async"
                width="800"
                height="600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent pointer-events-none" />
            </div>

            <div className="rounded-xl p-4 bg-white/[0.03] border border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-amber font-semibold mb-1">
                {t('home.faq.stillWonderingKicker')}
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {t('home.faq.stillWonderingBodyPrefix')}<a href="mailto:info@laplandvibes.com" className="text-white underline hover:text-amber transition-colors">info@laplandvibes.com</a>{t('home.faq.stillWonderingBodySuffix')}
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="space-y-3">
              {items.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl overflow-hidden transition-colors duration-300 border ${
                      isOpen ? 'bg-white/[0.06] border-amber/40' : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-start justify-between gap-4 px-5 sm:px-6 py-5 text-left transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <span className="font-heading tracking-wide text-lg text-amber/60 shrink-0 leading-tight pt-0.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium text-white text-base sm:text-lg leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 mt-1 ${
                          isOpen ? 'rotate-180 text-amber' : 'text-white/75'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pl-14 sm:pl-16">
                        <p className="text-white/70 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                        {(FAQ_LINKS[index] ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                            {FAQ_LINKS[index].map((key) => (
                              <Link
                                key={key}
                                to={to(FAQ_ROUTE[key])}
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber hover:text-vibe-pink transition-colors"
                              >
                                {tNav(`links.${key}`)} <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
