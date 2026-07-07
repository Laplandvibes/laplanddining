import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocale } from './useLocale';
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_NATIVE, LOCALE_BCP47, type Locale } from './config';

interface Props {
  className?: string;
  variant?: 'pill' | 'inline';
}

/**
 * Language switcher. Compact dropdown on `xl+` viewports (Globe + code + menu)
 * and a native <select> on mobile so the hamburger icon never gets pushed
 * off-screen.
 */
export default function LanguageSwitcher({ className = '', variant = 'pill' }: Props) {
  const { locale, to, pathWithoutLocale } = useLocale();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const items: { code: Locale; label: string; href: string; native: string }[] = SUPPORTED_LOCALES.map((c) => ({
    code: c,
    label: LOCALE_LABELS[c],
    native: LOCALE_NATIVE[c],
    href: to(pathWithoutLocale, c),
  }));

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const triggerClasses =
    variant === 'pill'
      ? 'bg-[#0F172A] backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading tracking-[0.18em] uppercase border border-snow/40 text-snow hover:border-vibe-pink hover:text-vibe-pink hover:bg-white/5 transition-colors duration-200'
      : 'flex items-center gap-1.5 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-snow/85 hover:text-vibe-pink transition-colors duration-200';

  return (
    <>
      <div className={`hidden xl:inline-block relative ${className}`} ref={wrapRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t('lang.switchTo')}
          className={triggerClasses}
        >
          <Globe className="w-3.5 h-3.5" />
          {LOCALE_LABELS[locale]}
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <ul
            role="listbox"
            aria-label={t('lang.switchTo')}
            className="absolute right-0 top-full mt-2 min-w-[180px] py-1 bg-[#0F172A] backdrop-blur-md border border-white/15 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto"
          >
            {items.map((item) => {
              const isActive = item.code === locale;
              return (
                <li key={item.code} role="option" aria-selected={isActive}>
                  <Link
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    hrefLang={LOCALE_BCP47[item.code]}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.localStorage) {
                        window.localStorage.setItem('lv_locale_choice', item.code);
                      }
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-vibe-pink/15 text-vibe-pink font-semibold'
                        : 'text-snow/85 hover:bg-white/5 hover:text-snow'
                    }`}
                  >
                    <span className="w-8 font-heading text-xs tracking-[0.18em]">{item.label}</span>
                    <span>{item.native}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('lv_locale_choice', next);
          }
          const target = items.find((i) => i.code === next);
          if (target) navigate(target.href);
        }}
        aria-label={t('lang.switchTo')}
        className={`xl:hidden bg-transparent border border-current/30 rounded px-2 py-1 text-xs font-heading tracking-[0.18em] uppercase ${
          variant === 'pill' ? 'text-snow' : 'text-snow/85'
        } ${className}`}
      >
        {items.map((item) => (
          <option key={item.code} value={item.code} className="bg-deep-night text-snow">
            {item.label} — {item.native}
          </option>
        ))}
      </select>
    </>
  );
}
