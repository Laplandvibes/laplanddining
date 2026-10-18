
import { useTranslation, Trans } from 'react-i18next';
import Hreflang from '../i18n/Hreflang';
import { Info, Globe, ExternalLink } from 'lucide-react';
import { PHOTO, photoSrcSet } from '../data/images';
import { PHOTO_BY } from '../data/restaurants';
import { ownPhotoCredit, OTHER_PHOTO_PLACES } from '../data/photoCredit';
import { imageAlt } from '../data/imageAlts';
import { useLocale } from '../i18n/useLocale';
import PageBreadcrumb from '../components/PageBreadcrumb';

export default function About() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <title>{t('about.title')}</title>
      <meta name="description" content={t('about.description')} />
      <Hreflang path="/about" />

      {/* Hero, 18.10.2026 (Vesa: "eikö se voi olla jokin missä olen ravintolan edessä kuva"): oma kuva
          Hotelli Ravintola Kultahipun edestä Ivalossa 12.10.2026. Kasvot ovat kuvan vasemmalla puoliskolla
          (x 26–46 %, y 58–96 %), joten otsikko ei saa olla keskellä kuvaa: puhelimella se on kuvan alla,
          lg:llä oikealla oven kohdalla. Kuva näytetään koko ruutuna (2,16:1), ei 56svh-kaistana. */}
      <section className="relative bg-night">
        <div className="relative w-full overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-[216/100] lg:max-h-[88svh]">
          <img
            src={PHOTO.vesaKultahippu}
            srcSet={photoSrcSet(PHOTO.vesaKultahippu)}
            sizes="100vw"
            alt={imageAlt(PHOTO.vesaKultahippu, locale)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '30% 60%' }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent via-30% to-transparent lg:bg-gradient-to-l lg:from-night/90 lg:via-night/40 lg:via-45%" />
          <p className="absolute bottom-3 right-4 z-10 rounded bg-black/55 px-1.5 py-px text-[11px] text-white/90 tracking-wide">
            {ownPhotoCredit(PHOTO_BY[locale], OTHER_PHOTO_PLACES.ivalo[locale], '2026-10', locale)}
          </p>
        </div>
        <div className="relative z-10 px-4 sm:px-6 pt-6 pb-10 text-center lg:absolute lg:inset-y-0 lg:right-0 lg:w-[46%] lg:flex lg:flex-col lg:justify-center lg:items-start lg:text-left lg:pl-6 lg:pr-12 lg:py-0 xl:pr-20">
          <h1 className="font-heading text-5xl sm:text-6xl text-white tracking-wide mb-4 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {t('about.heroH1')}
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('about.heroLead')}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* About */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center bg-amber/10 border border-amber/30">
                <Globe size={18} className="text-amber" />
              </span>
              <h2 className="font-heading text-2xl text-white tracking-wide">
                {t('about.networkTitle')}
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              <Trans
                i18nKey="about.networkBodyA"
                ns="pages"
                components={{ strong: <strong className="text-white/85" /> }}
              />
            </p>
            <p className="text-gray-400 leading-relaxed">
              {t('about.networkBodyB')}
            </p>
          </div>

          {/* Affiliate Disclosure */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center bg-amber/10 border border-amber/30">
                <Info size={18} className="text-amber" />
              </span>
              <h2 className="font-heading text-2xl text-white tracking-wide">
                {t('about.affiliateTitle')}
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              {t('about.affiliateBodyA')}
            </p>
            <p className="text-gray-400 leading-relaxed">
              {t('about.affiliateBodyB')}
            </p>
          </div>

          {/* Operator */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="font-heading text-2xl text-white tracking-wide mb-4">
              {t('about.operatorTitle')}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-2">
              <Trans
                i18nKey="about.operatorBodyA"
                ns="pages"
                components={{ strong: <strong className="text-white/85" /> }}
              />
            </p>
            <p className="text-gray-400 leading-relaxed">
              {t('about.operatorBodyB')}&nbsp;
              <a
                href="mailto:info@laplandvibes.com"
                className="text-amber hover:text-white transition-colors no-underline"
              >
                info@laplandvibes.com
              </a>
            </p>
          </div>

          {/* Explore more */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="font-heading text-2xl text-white tracking-wide mb-4">
              {t('about.exploreTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'LaplandVibes Hub', url: 'https://laplandvibes.com' },
                { label: 'LaplandStays', url: 'https://laplandstays.com' },
                { label: 'LaplandHotelDeals', url: 'https://laplandhoteldeals.com' },
                { label: 'LaplandActivities', url: 'https://laplandactivities.fi' },
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
