import { useLocation } from 'react-router-dom';

/**
 * Founder byline for the bottom-of-page newsletter sections (2026-08-09).
 *
 * The unifying founder element across every ecosystem site's inline
 * newsletter section: small round photo of Vesa + name + role line. The
 * spiral-animated big avatar lives in the popup only — this one never
 * animates (a moving face at the bottom of every page would wear thin).
 *
 * Locale comes from <html lang> (every site sets it via its i18n layer), so
 * no per-site wiring is needed; useLocation re-reads it on route change.
 * All colors are inline styles on purpose: sections live in per-site files
 * whose Tailwind content scans differ, and inline styles are purge-immune.
 *
 * `/vesa-founder.webp` must exist in the consuming site's public/ (same
 * asset the popup uses). Degrades to text-only if the image 404s.
 */

const STRINGS: Record<string, { role: string; note: string; alt: string }> = {
  en: { role: 'Vesa — founder of LaplandVibes', note: 'These letters come from me.', alt: 'Vesa, founder of LaplandVibes' },
  fi: { role: 'Vesa — LaplandVibesin perustaja', note: 'Nämä kirjeet tulevat minulta.', alt: 'Vesa, LaplandVibesin perustaja' },
  de: { role: 'Vesa — Gründer von LaplandVibes', note: 'Diese Briefe kommen von mir.', alt: 'Vesa, Gründer von LaplandVibes' },
  ja: { role: 'ヴェサ — LaplandVibes創業者', note: 'このレターは私が書いています。', alt: 'LaplandVibes創業者のヴェサ' },
  es: { role: 'Vesa — fundador de LaplandVibes', note: 'Estas cartas las escribo yo.', alt: 'Vesa, fundador de LaplandVibes' },
  'pt-BR': { role: 'Vesa — fundador do LaplandVibes', note: 'Estas cartas vêm de mim.', alt: 'Vesa, fundador do LaplandVibes' },
  'zh-CN': { role: 'Vesa — LaplandVibes创始人', note: '这些信由我亲自撰写。', alt: 'LaplandVibes创始人Vesa' },
  ko: { role: '베사 — LaplandVibes 창립자', note: '이 레터는 제가 직접 씁니다.', alt: 'LaplandVibes 창립자 베사' },
  fr: { role: 'Vesa — fondateur de LaplandVibes', note: 'Ces lettres viennent de moi.', alt: 'Vesa, fondateur de LaplandVibes' },
  it: { role: 'Vesa — fondatore di LaplandVibes', note: 'Queste lettere le scrivo io.', alt: 'Vesa, fondatore di LaplandVibes' },
  nl: { role: 'Vesa — oprichter van LaplandVibes', note: 'Deze brieven komen van mij.', alt: 'Vesa, oprichter van LaplandVibes' },
  sv: { role: 'Vesa — grundare av LaplandVibes', note: 'Breven kommer från mig.', alt: 'Vesa, grundare av LaplandVibes' },
};

/** br/cn path locales (laplandchristmas) and BCP47 regions normalise here. */
function normalizeLang(raw: string | undefined): string {
  if (!raw) return 'en';
  if (STRINGS[raw]) return raw;
  const lower = raw.toLowerCase();
  if (lower === 'br' || lower.startsWith('pt')) return 'pt-BR';
  if (lower === 'cn' || lower.startsWith('zh')) return 'zh-CN';
  const base = lower.split('-')[0];
  return STRINGS[base] ? base : 'en';
}

export type FounderBylineTone = 'pink' | 'dark' | 'light';

const TONES: Record<FounderBylineTone, { role: string; note: string; ring: string; glow: string; plate: string; plateBorder: string }> = {
  // On the pink Newsletter band (the network default section background).
  pink: { role: '#FFFFFF', note: 'rgba(255,255,255,0.85)', ring: '#FFFFFF', glow: 'rgba(255,255,255,0.35)', plate: 'rgba(0,0,0,0.18)', plateBorder: 'rgba(255,255,255,0.30)' },
  // On deep-night / dark editorial surfaces.
  dark: { role: '#F9FAFB', note: 'rgba(249,250,251,0.78)', ring: '#EC4899', glow: 'rgba(236,72,153,0.40)', plate: 'rgba(255,255,255,0.07)', plateBorder: 'rgba(236,72,153,0.35)' },
  // On cream / white surfaces (laplandstays).
  light: { role: '#0F172A', note: 'rgba(15,23,42,0.75)', ring: '#EC4899', glow: 'rgba(236,72,153,0.30)', plate: 'rgba(15,23,42,0.05)', plateBorder: 'rgba(15,23,42,0.14)' },
};

interface FounderBylineProps {
  /** Surface the byline sits on. Default 'pink' = the network Newsletter band. */
  tone?: FounderBylineTone;
  /** Override locale; defaults to <html lang>, normalised. */
  lang?: string;
  /** Founder avatar path, defaults to the shared network asset. */
  image?: string;
}

export default function FounderByline({ tone = 'pink', lang, image = '/vesa-founder.webp' }: FounderBylineProps) {
  // Re-read <html lang> whenever the route changes (locale switches navigate).
  useLocation();
  const resolved = normalizeLang(
    lang ?? (typeof document !== 'undefined' ? document.documentElement.lang : undefined),
  );
  const s = STRINGS[resolved] ?? STRINGS.en;
  const t = TONES[tone];

  // A proper founder card, not a floating row: big portrait in a thick ring
  // with glow, on a pill-shaped plate that separates it from the band
  // (Vesa 9.8.: "ympyrä liian pieni ja taustaakaan ei ollenkaan").
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '18px',
          padding: '14px 26px 14px 16px',
          borderRadius: '9999px',
          background: t.plate,
          border: `1px solid ${t.plateBorder}`,
          maxWidth: '100%',
        }}
      >
        <img
          src={image}
          alt={s.alt}
          loading="lazy"
          width={96}
          height={96}
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '9999px',
            objectFit: 'cover',
            flexShrink: 0,
            boxShadow: `0 0 0 3px ${t.ring}, 0 0 28px ${t.glow}`,
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: t.role, lineHeight: 1.3 }}>
            {s.role}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: t.note, lineHeight: 1.35 }}>
            {s.note}
          </p>
        </div>
      </div>
    </div>
  );
}
