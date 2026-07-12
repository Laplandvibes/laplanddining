import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLocale } from '../i18n/useLocale';
import EcosystemMenu from '../../../shared/EcosystemMenu';
import { adSlotsCopy } from '../../../shared/adSlotsCopy';

const NAV_KEYS = [
  { key: 'restaurants', basePath: '/restaurants' },
  { key: 'fineDining', basePath: '/fine-dining' },
  { key: 'midnightSun', basePath: '/midnight-sun-dining' },
  { key: 'foodHistory', basePath: '/food-history' },
  { key: 'localFood', basePath: '/local-food' },
  { key: 'partners', basePath: '/kumppanit' },
  { key: 'about', basePath: '/about' },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('nav');
  const { to, pathWithoutLocale, locale } = useLocale();
  const navLabel = (key: string) =>
    key === 'partners' ? adSlotsCopy(locale).partners : t(`links.${key}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-night/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <EcosystemMenu lang={locale} currentDomain="laplanddining.com" />
            <Link to={to('/')} className="no-underline" aria-label="LaplandDining home">
              <Logo className="text-2xl sm:text-3xl" />
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-7">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.basePath}
                to={to(link.basePath)}
                className={`font-medium transition-colors duration-200 text-sm tracking-wide no-underline ${
                  pathWithoutLocale === link.basePath
                    ? 'text-amber'
                    : 'text-white/70 hover:text-amber'
                }`}
              >
                {navLabel(link.key)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          <div className="xl:hidden flex items-center gap-1.5 shrink-0">
            <LanguageSwitcher />
            <button
              onClick={() => setOpen(!open)}
              className="p-2.5 -mr-1 text-white hover:text-amber transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t('menu')}
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="xl:hidden bg-night/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.basePath}
                to={to(link.basePath)}
                className={`block font-medium transition-colors duration-200 text-base no-underline px-3 py-3 rounded-lg min-h-[44px] flex items-center ${
                  pathWithoutLocale === link.basePath
                    ? 'text-amber bg-amber/10'
                    : 'text-white/70 hover:text-amber hover:bg-white/5'
                }`}
              >
                {navLabel(link.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
