/**
 * Jakonapin tekstit 12 kielellä — shared/ShareBar/. Kanoninen lv-opsissa; sivustoilla vendoroitu kopio
 * src/shared/ShareBar/. Samat sanat kuin hubin blogin chrome.share.* (laplandvibes/src/locales/<kieli>/blog.json,
 * 24.10.2026), jotta nappi on verkostossa sama joka sivustolla.
 * 🔴 laplandstays: zh-CN muunnetaan sivuston scripts/zh-hant.mjs:llä (/cn/ = Taiwanin perinteinen kiina).
 */
export type ShareCopy = { button: string; heading: string; copy: string; copied: string; email: string };

export const SHARE_COPY: Record<string, ShareCopy> = {
  en: { button: 'Share', heading: 'Share this article', copy: 'Copy link', copied: 'Link copied', email: 'Email' },
  fi: { button: 'Jaa', heading: 'Jaa artikkeli', copy: 'Kopioi linkki', copied: 'Linkki kopioitu', email: 'Sähköposti' },
  sv: { button: 'Dela', heading: 'Dela artikeln', copy: 'Kopiera länk', copied: 'Länken kopierad', email: 'E-post' },
  de: { button: 'Teilen', heading: 'Artikel teilen', copy: 'Link kopieren', copied: 'Link kopiert', email: 'E-Mail' },
  fr: { button: 'Partager', heading: 'Partager cet article', copy: 'Copier le lien', copied: 'Lien copié', email: 'E-mail' },
  it: { button: 'Condividi', heading: 'Condividi l’articolo', copy: 'Copia il link', copied: 'Link copiato', email: 'E-mail' },
  nl: { button: 'Delen', heading: 'Deel dit artikel', copy: 'Link kopiëren', copied: 'Link gekopieerd', email: 'E-mail' },
  es: { button: 'Compartir', heading: 'Comparte este artículo', copy: 'Copiar enlace', copied: 'Enlace copiado', email: 'Correo' },
  'pt-BR': { button: 'Compartilhar', heading: 'Compartilhe este artigo', copy: 'Copiar link', copied: 'Link copiado', email: 'E-mail' },
  ja: { button: '共有', heading: 'この記事を共有', copy: 'リンクをコピー', copied: 'リンクをコピーしました', email: 'メール' },
  ko: { button: '공유', heading: '이 글 공유하기', copy: '링크 복사', copied: '링크를 복사했습니다', email: '이메일' },
  'zh-CN': { button: '分享', heading: '分享这篇文章', copy: '复制链接', copied: '链接已复制', email: '电子邮件' },
};

/** Sivustojen kielikoodit vaihtelevat (br/pt/pt-BR, kr/ko, cn/zh/zh-CN, fi-FI …) ⇒ yksi normalisointi. */
export function shareLang(lang: string | undefined): string {
  const l = (lang || 'en').toLowerCase();
  if (l === 'br' || l.startsWith('pt')) return 'pt-BR';
  if (l === 'kr' || l.startsWith('ko')) return 'ko';
  if (l === 'cn' || l.startsWith('zh')) return 'zh-CN';
  const two = l.slice(0, 2);
  return SHARE_COPY[two] ? two : 'en';
}
