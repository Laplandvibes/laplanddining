import { useTranslation, Trans } from 'react-i18next';
import { Compass } from 'lucide-react';

/**
 * In-content "Where to next" block for the main dining content pages.
 * Renders contextual, keyword-anchored links to topically-relevant sibling
 * sites in the LaplandVibes network. Copy is localized via the `pages`
 * namespace (`relatedLinks.*`); the lead weaves the three anchors into prose
 * through <Trans> placeholders (<bars>/<nightlife>/<stays>).
 *
 * Links are plain external anchors (not affiliate) → target="_blank"
 * rel="noopener". Canonical sibling URLs per SITE-MAP.md.
 */
const linkClass =
  'text-amber font-semibold underline decoration-amber/40 underline-offset-2 hover:text-white hover:decoration-white transition-colors';

export default function WhereToNext() {
  const { t } = useTranslation('pages');
  return (
    <section className="py-14 bg-night border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <Compass size={20} className="text-amber" />
            <span className="text-amber/80 text-[11px] font-semibold uppercase tracking-[0.22em]">
              {t('relatedLinks.kicker')}
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-3">
            {t('relatedLinks.headline')}
          </h2>
          <p className="text-white/75 leading-relaxed">
            <Trans
              ns="pages"
              i18nKey="relatedLinks.lead"
              components={{
                bars: (
                  <a
                    href="https://laplandbars.com/bars/"
                    target="_blank"
                    rel="noopener"
                    className={linkClass}
                  />
                ),
                nightlife: (
                  <a
                    href="https://laplandnightlife.com/nightclubs/"
                    target="_blank"
                    rel="noopener"
                    className={linkClass}
                  />
                ),
                stays: (
                  <a
                    href="https://laplandstays.com/property-types/"
                    target="_blank"
                    rel="noopener"
                    className={linkClass}
                  />
                ),
              }}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
