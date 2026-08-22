/**
 * PartnersDirectory — /kumppanit-koontisivun sisältö.
 *
 * Malli (Vesa 2026-07-12): sponsoroidut kumppaniartikkelit julkaistaan
 * normaaliin sisältövirtaan (Kumppani-badge, KSL) JA kerätään tähän yhteen
 * pysyvään hakemistoon. Myyntivaltti: "artikkelisi näkyy sekä virrassa että
 * pysyvässä kumppanihakemistossa".
 *
 * items = maksaneet kumppanit (nimi, tagline, artikkelilinkki, logo). Tyhjänä
 * hillitty tyhjätila + CTA LV Media -portaaliin.
 */

import { adSlotsCopy, mediaSiteUrl, fireAdvertiseHereClick } from './adSlotsCopy';

export type PartnerDirEntry = {
  name: string;
  tagline?: string;
  /** Sisäinen artikkelilinkki (esim. /fi/kumppanit/levi-lodge) tai ulkoinen url */
  href: string;
  imageSrc?: string;
  /** true = ulkoinen linkki (rel sponsored) */
  external?: boolean;
};

export type PartnersDirectoryProps = {
  items: PartnerDirEntry[];
  siteSlug: string;
  locale?: string;
  surface?: 'dark' | 'light';
  className?: string;
};

export default function PartnersDirectory({ items, siteSlug, locale, surface = 'dark', className }: PartnersDirectoryProps) {
  const t = adSlotsCopy(locale);
  const light = surface === 'light';

  const empty = items.length === 0;
  return (
    <section
      data-lv-partners-dir
      className={['py-14 sm:py-20 px-6 md:px-12 lg:px-20', className].filter(Boolean).join(' ')}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h1
            className={[
              'font-heading text-4xl sm:text-5xl tracking-wide mb-3',
              light ? 'text-gray-900' : 'text-[#F9FAFB]',
            ].join(' ')}
          >
            {/* Tyhjänä positiivinen "ryhdy kumppaniksi" -otsikko, ei "kumppanimme"
                (joka implikoisi tyhjää hyllyä). Vesa 2026-07-12. */}
            {empty ? t.partnersDirEmptyTitle : t.partnersDirTitle}
          </h1>
          <p className={['text-base leading-relaxed max-w-2xl mx-auto', light ? 'text-gray-600' : 'text-[#F9FAFB]/70'].join(' ')}>
            {empty ? t.partnersDirEmpty : t.partnersDirLead}
          </p>
        </div>

        {empty ? (
          <div className="flex justify-center">
            <a
              href={mediaSiteUrl(siteSlug, locale)}
              onClick={() => fireAdvertiseHereClick(siteSlug, 'partners_directory')}
              className="inline-flex items-center gap-2 rounded-full bg-[#EC4899] hover:bg-[#EC4899]/90 text-white font-semibold px-7 py-3.5 text-sm transition-colors"
            >
              {t.bookCta}
            </a>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {items.map((it) => (
              <li key={it.name}>
                <a
                  href={it.href}
                  {...(it.external ? { target: '_blank', rel: 'sponsored nofollow noopener' } : {})}
                  className={[
                    'group flex items-center gap-4 rounded-2xl border p-4 sm:p-5 transition-colors',
                    light
                      ? 'border-black/10 bg-black/[0.02] hover:border-[#EC4899]/40'
                      : 'border-white/12 bg-white/5 hover:border-[#EC4899]/40',
                  ].join(' ')}
                >
                  <div className={['shrink-0 w-14 h-14 rounded-xl overflow-hidden', light ? 'bg-black/5' : 'bg-white/10'].join(' ')}>
                    {it.imageSrc ? (
                      <img src={it.imageSrc} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0d2818] via-[#0F172A] to-[#1e1b4b]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 inline-flex items-center rounded-full bg-[#EC4899]/90 px-1.5 py-px text-[9px] font-semibold uppercase tracking-widest text-white">
                        {t.badge}
                      </span>
                      <p
                        className={[
                          'font-heading text-lg tracking-wide truncate group-hover:text-[#EC4899] transition-colors',
                          light ? 'text-gray-900' : 'text-[#F9FAFB]',
                        ].join(' ')}
                      >
                        {it.name}
                      </p>
                    </div>
                    {it.tagline && (
                      <p className={['text-sm leading-snug mt-0.5 line-clamp-2', light ? 'text-gray-600' : 'text-[#F9FAFB]/60'].join(' ')}>
                        {it.tagline}
                      </p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
