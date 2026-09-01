import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, AlertCircle, Loader2, X } from 'lucide-react';

/**
 * Shared LaplandVibes ecosystem newsletter popup — founder edition (2026-08-09).
 *
 * Mounted once at the root of every site (laplandvibes.com, laplandstays.com,
 * laplandhuskysafaris.com, etc.). Triggers after 25 s OR 55 % scroll, whichever
 * comes first. Suppressed on policy / utility routes. State stored per-site in
 * localStorage so a dismissal on one site does not silence the popup on others.
 *
 * The newsletter list is shared across the entire ecosystem, submissions land
 * in the same Supabase + Resend pipeline. The `source` tag differentiates the
 * referring site in GA4 / mailing-list analytics.
 *
 * Founder edition: Vesa's photo spirals in above the wordmark (one-time CSS
 * animation, fade-only under prefers-reduced-motion) and the default copy is a
 * personal founder note instead of an anonymous brand pitch. The success view
 * shows the Suomi-helmet trip photo + TikTok/Instagram/Facebook links. The
 * old default copy promised "aurora alerts" — no alert system exists, so that
 * promise is gone on every locale (same debt as the 2026-08-02 welcome-email
 * truth audit).
 *
 * Both images must exist in each consuming site's public/ dir
 * (`/vesa-founder.webp`, `/vesa-lapland.webp`). If the avatar 404s the popup
 * degrades gracefully to the pre-founder layout (no broken-image icon).
 */

const REMIND_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SUPPRESSED_PATHS = ['/privacy', '/terms', '/cookie-policy', '/unsubscribe'];

/**
 * Network wordmark font. The `#LAPLAND<brand>` lockup is ALWAYS Bebas Neue, on
 * every site, including the variant-font sites where `font-heading` resolves to
 * a serif (Cormorant Garamond on weddings/luxuryvillas, Playfair on
 * carrental/gifts/store/stayinlapland). Kept in sync with the same constant in
 * `EcosystemMenu.tsx`. Degrades to the host site's own heading font if Bebas
 * Neue is not loaded there.
 */
const WORDMARK_FONT = "'Bebas Neue', var(--font-heading, 'Arial Narrow'), sans-serif";

/** Official network profiles — single source of truth for the success view. */
const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@laplandvibes',
  instagram: 'https://www.instagram.com/laplandvibesofficial',
  facebook: 'https://www.facebook.com/laplandvibes',
};

type Status = 'hidden' | 'visible' | 'loading' | 'success' | 'already' | 'error';

interface StoredState {
  subscribed?: number;
  dismissed?: number;
}

/**
 * Optional dictionary of UI strings used inside the popup. Pass this to
 * localise the popup. If omitted, English defaults are used (preserves
 * backwards compatibility with sites that haven't migrated to i18n yet).
 */
export interface NewsletterPopupDict {
  successHeadline?: string;
  successBody?: string;
  alreadyHeadline?: string;
  alreadyBody?: string;
  emailPlaceholder?: string;
  submit?: string;
  loading?: string;
  later?: string;
  closeAria?: string;
  closeLabel?: string;
  trust?: string;
  errorGeneric?: string;
  /** Lead-in line above the social icons on the success view. */
  socialLead?: string;
  /** Alt text for the founder avatar photo. */
  founderAlt?: string;
  /**
   * [LV-CONSENT-V2 2026-08-14] Pakollisen suostumusvalinnan teksti ja
   * tietosuojalinkin teksti. `consent` on se teksti jonka tilaaja
   * tosiasiassa hyväksyy — se lähetetään myös palvelimelle ja tallennetaan
   * riville, koska GDPR edellyttää suostumuksen osoittamista jälkikäteen.
   */
  consent?: string;
  privacy?: string;
}

type SupportedLang = 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl' | 'sv';

interface NewsletterPopupProps {
  /**
   * Per-site identifier. Used for the localStorage key and the analytics
   * `source` tag. Examples: 'laplandvibes', 'laplandstays', 'laplandhuskysafaris'.
   */
  siteId: string;
  /** [LV-CONSENT-V2] Tietosuojaselosteen polku; vaihtelee sivustoittain. */
  privacyHref?: string;
  /**
   * Brand suffix in the `#LAPLAND<word>` logo at the top of the popup.
   * Defaults to 'VIBES'. Examples: 'STAYS', 'HUSKYSAFARIS', 'SKIRESORTS'.
   */
  brandWord?: string;
  /** Optional headline override. */
  headline?: string;
  /** Optional supporting paragraph override (rendered as-is, plain text). */
  description?: string;
  /** Optional translation dictionary, see NewsletterPopupDict. */
  dict?: NewsletterPopupDict;
  /**
   * Current site locale. If provided AND `headline`/`description` are NOT
   * overridden, the popup picks built-in localized copy + dict.
   * Added 2026-05-23, fixes Vesa's flag that EN newsletter appeared on /fi /cn etc.
   */
  lang?: SupportedLang;
  /**
   * Optional analytics callback. Fires after a *new* successful subscription
   * (not when the email was already on the list). Use this to forward to
   * `trackNewsletterSignup` from your site's `lib/analytics`.
   */
  onSubscribed?: (source: string) => void;
  /**
   * Trigger thresholds. Pass `delaySeconds: 0` and `scrollPercent: 0` to
   * disable the auto-trigger and rely on a manual `defaultOpen` instead.
   */
  delaySeconds?: number;
  scrollPercent?: number;
  /** If true the popup opens immediately on mount (debugging / preview). */
  defaultOpen?: boolean;
  /**
   * Optional same-origin proxy endpoint (e.g. `/api/newsletter`). When set,
   * the popup POSTs `{email, source}` here instead of calling Supabase
   * directly, useful for sister sites whose origins aren't yet on the
   * Supabase function's CORS allowlist. The proxy must accept the same
   * `{email, source}` payload and return `{message, alreadySubscribed?}`.
   *
   * If `endpoint` is set, `supabaseUrl` + `supabaseAnonKey` may be omitted.
   */
  endpoint?: string;
  /** Supabase project URL with the `send-welcome-email` function. Required if `endpoint` not set. */
  supabaseUrl?: string;
  /** Supabase publishable anon key. Required if `endpoint` not set. */
  supabaseAnonKey?: string;
  /** Founder avatar photo (circle, spirals in). Must exist in the site's public/. */
  founderImage?: string;
  /** Trip photo shown on the success view. Must exist in the site's public/. */
  thanksImage?: string;
}

function readStored(key: string): StoredState | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, s: StoredState) {
  try {
    localStorage.setItem(key, JSON.stringify(s));
  } catch {
    // ignore, Safari private mode etc.
  }
}

// Built-in locale defaults. Founder note (2026-08-09) — Vesa speaking in first
// person on every locale. Frequency promises are banned (VOICE-RULES.md): the
// cadence truth lives in the `trust` line, not here.
const LOCALE_HEADLINES: Record<SupportedLang, { headline: string; description: string }> = {
  en: {
    headline: 'Hi, Vesa here 👋',
    description: 'Founder of LaplandVibes. Auroras, autumn colours, the Christmas season and the midnight sun. I travel Lapland and tell you where to start, what to book and when, and which places genuinely surprise you.',
  },
  fi: {
    headline: 'Moro! Vesa tässä 👋',
    description: 'LaplandVibesin perustaja. Revontulet, ruska, joulun sesonki ja yötön yö. Reissaan Lapissa ja kerron sinulle, mistä kannattaa aloittaa, mitä varata milloinkin ja mitkä paikat oikeasti yllättävät.',
  },
  de: {
    headline: 'Hallo, hier ist Vesa 👋',
    description: 'Gründer von LaplandVibes. Polarlichter, Herbstfarben, die Weihnachtssaison und die Mitternachtssonne. Ich reise durch Lappland und erzähle Ihnen, womit Sie anfangen sollten, was Sie wann buchen und welche Orte wirklich überraschen.',
  },
  ja: {
    headline: 'こんにちは、ヴェサです 👋',
    description: 'LaplandVibes創業者。オーロラ、紅葉、クリスマスシーズン、白夜。ラップランドを旅しながら、どこから始めるか、何をいつ予約するか、本当に驚かされる場所はどこかをお伝えします。',
  },
  es: {
    headline: '¡Hola! Soy Vesa 👋',
    description: 'Fundador de LaplandVibes. Auroras, colores de otoño, la temporada navideña y el sol de medianoche: viajo por Laponia y te cuento por dónde empezar, qué reservar y cuándo, y qué lugares de verdad sorprenden.',
  },
  'pt-BR': {
    headline: 'Oi, aqui é o Vesa 👋',
    description: 'Fundador do LaplandVibes. Auroras, cores de outono, a temporada de Natal e o sol da meia-noite. Viajo pela Lapônia e conto para você por onde começar, o que reservar e quando, e quais lugares realmente surpreendem.',
  },
  'zh-CN': {
    headline: '你好，我是Vesa 👋',
    description: 'LaplandVibes创始人。极光、秋色、圣诞季、极昼。我行遍拉普兰，告诉你从哪里开始、何时预订什么、哪些地方真正令人惊喜。',
  },
  ko: {
    headline: '안녕하세요, 베사입니다 👋',
    description: 'LaplandVibes 창립자. 오로라, 가을 단풍, 크리스마스 시즌, 백야. 라플란드를 여행하며 어디서 시작할지, 무엇을 언제 예약할지, 어떤 곳이 정말 놀라운지 알려드립니다.',
  },
  fr: {
    headline: 'Bonjour, c\'est Vesa 👋',
    description: 'Fondateur de LaplandVibes. Aurores, couleurs d\'automne, saison de Noël et soleil de minuit. Je sillonne la Laponie et je vous dis par où commencer, quoi réserver et quand, et quels endroits surprennent vraiment.',
  },
  it: {
    headline: 'Ciao, sono Vesa 👋',
    description: 'Fondatore di LaplandVibes. Aurore, colori d\'autunno, la stagione di Natale e il sole di mezzanotte. Giro la Lapponia e Le racconto da dove iniziare, cosa prenotare e quando, e quali posti sorprendono davvero.',
  },
  nl: {
    headline: 'Hoi, Vesa hier 👋',
    description: 'Oprichter van LaplandVibes. Noorderlicht, herfstkleuren, het kerstseizoen en de middernachtzon. Ik reis door Lapland en vertel u waar u begint, wat u wanneer boekt en welke plekken echt verrassen.',
  },
  sv: {
    headline: 'Hej! Vesa här 👋',
    description: 'Grundare av LaplandVibes. Norrsken, höstfärger, julsäsongen och midnattssolen. Jag reser runt i Lappland och berättar var du ska börja, vad du ska boka och när, och vilka platser som verkligen överraskar.',
  },
};

const LOCALE_DICTS: Record<SupportedLang, Required<NewsletterPopupDict>> = {
  en: {
    successHeadline: 'Almost there.',
    successBody: 'Confirm your subscription from the email we just sent you.',
    alreadyHeadline: 'Already on the list!',
    alreadyBody: "You were already subscribed. You'll hear from me when there's something worth telling.",
    emailPlaceholder: 'Your email address',
    submit: 'Count me in!',
    loading: 'Subscribing…',
    later: 'Maybe later',
    closeAria: 'Close',
    closeLabel: 'Close',
    trust: "Only when there's something worth telling you about. Unsubscribe any time. We never share your email.",
    errorGeneric: 'Subscription failed. Please try again.',
    socialLead: 'Meanwhile, my posts from around Lapland:',
    founderAlt: 'Vesa, founder of LaplandVibes',
    consent: `Yes, send the LaplandVibes newsletter (travel tips, seasonal updates and offers) to this email address. I confirm I am 18 or over.`,
    privacy: `Privacy Policy`,
  },
  fi: {
    successHeadline: 'Melkein valmista.',
    successBody: 'Käy vahvistamassa tilaus sähköpostiisi tulleesta viestistä.',
    alreadyHeadline: 'Olit jo listalla.',
    alreadyBody: 'Tilauksesi oli jo voimassa. Kuulet minusta, kun on kerrottavaa.',
    emailPlaceholder: 'Sähköpostiosoitteesi',
    submit: 'Lähden mukaan!',
    loading: 'Tilataan…',
    later: 'Ehkä myöhemmin',
    closeAria: 'Sulje',
    closeLabel: 'Sulje',
    trust: 'Lähetämme vain silloin, kun on jotain oikeasti kerrottavaa. Tilauksen voi perua koska tahansa. Sähköpostia ei jaeta kolmansille.',
    errorGeneric: 'Tilauksessa virhe. Yritä uudelleen.',
    socialLead: 'Sillä välin, postauksiani Lapin reissuilta:',
    founderAlt: 'Vesa, LaplandVibesin perustaja',
    consent: `LaplandVibes saa lähettää minulle uutiskirjettä (matkailuvinkkejä, sesonkitietoa ja tarjouksia) antamaani sähköpostiosoitteeseen. Olen täyttänyt 18 vuotta.`,
    privacy: `Tietosuojaseloste`,
  },
  de: {
    successHeadline: 'Fast geschafft.',
    successBody: 'Bestätigen Sie Ihr Abo über die E-Mail, die wir Ihnen gerade geschickt haben.',
    alreadyHeadline: 'Schon auf der Liste!',
    alreadyBody: 'Sie waren bereits angemeldet. Sie hören von mir, wenn es etwas zu erzählen gibt.',
    emailPlaceholder: 'Ihre E-Mail-Adresse',
    submit: 'Ich bin dabei!',
    loading: 'Anmeldung läuft…',
    later: 'Vielleicht später',
    closeAria: 'Schließen',
    closeLabel: 'Schließen',
    trust: 'Nur wenn etwas wirklich der Rede wert ist. Jederzeit kündbar. Wir teilen Ihre E-Mail nie.',
    errorGeneric: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    socialLead: 'In der Zwischenzeit, meine Posts aus Lappland:',
    founderAlt: 'Vesa, Gründer von LaplandVibes',
    consent: `Ja, LaplandVibes darf mir den Newsletter mit Reisetipps, Saisoninfos und Angeboten an diese E-Mail-Adresse senden. Ich bin mindestens 18 Jahre alt.`,
    privacy: `Datenschutzerklärung`,
  },
  ja: {
    successHeadline: 'あと少しです。',
    successBody: 'いまお送りしたメールから登録を確認してください。',
    alreadyHeadline: 'すでに登録済みです!',
    alreadyBody: 'すでにご登録いただいています。お伝えしたいことがあるときにご連絡します。',
    emailPlaceholder: 'メールアドレス',
    submit: '参加します！',
    loading: '登録中…',
    later: 'あとで',
    closeAria: '閉じる',
    closeLabel: '閉じる',
    trust: '本当に価値のある時だけお届けします。いつでも解除可能。メールアドレスを第三者と共有しません。',
    errorGeneric: '登録に失敗しました。もう一度お試しください。',
    socialLead: 'それまでの間、ラップランドの旅の投稿はこちら:',
    founderAlt: 'LaplandVibes創業者のヴェサ',
    consent: `入力したメールアドレス宛に、LaplandVibesがニュースレター（旅のヒント、シーズン情報、キャンペーン情報）を送ることに同意します。私は18歳以上です。`,
    privacy: `プライバシーポリシー`,
  },
  es: {
    successHeadline: 'Ya casi.',
    successBody: 'Confirme su suscripción desde el correo que acabamos de enviarle.',
    alreadyHeadline: '¡Ya estabas en la lista!',
    alreadyBody: 'Su suscripción ya estaba activa. Sabrá de mí cuando haya algo que contar.',
    emailPlaceholder: 'Su correo electrónico',
    submit: '¡Me apunto!',
    loading: 'Suscribiendo…',
    later: 'Quizá más tarde',
    closeAria: 'Cerrar',
    closeLabel: 'Cerrar',
    trust: 'Solo cuando hay algo que merezca la pena. Cancele cuando quiera. Nunca compartimos su correo.',
    errorGeneric: 'Suscripción fallida. Inténtelo de nuevo.',
    socialLead: 'Mientras tanto, mis publicaciones desde Laponia:',
    founderAlt: 'Vesa, fundador de LaplandVibes',
    consent: `Acepto recibir en mi correo el boletín de LaplandVibes (consejos de viaje, información de temporada y ofertas) y confirmo que tengo al menos 18 años.`,
    privacy: `Política de privacidad`,
  },
  'pt-BR': {
    successHeadline: 'Quase lá.',
    successBody: 'Confirme sua inscrição no e-mail que acabamos de enviar.',
    alreadyHeadline: 'Já está na lista!',
    alreadyBody: 'Sua inscrição já estava ativa. Você vai saber de mim quando houver algo para contar.',
    emailPlaceholder: 'Seu e-mail',
    submit: 'Quero participar!',
    loading: 'Inscrevendo…',
    later: 'Talvez depois',
    closeAria: 'Fechar',
    closeLabel: 'Fechar',
    trust: 'Apenas quando vale a pena destacar. Cancele a qualquer momento. Nunca compartilhamos seu e-mail.',
    errorGeneric: 'Falha na inscrição. Tente novamente.',
    socialLead: 'Enquanto isso, meus posts da Lapônia:',
    founderAlt: 'Vesa, fundador do LaplandVibes',
    consent: `Aceito receber a newsletter da LaplandVibes no e-mail informado, com dicas de viagem, informações de temporada e ofertas. Tenho 18 anos ou mais.`,
    privacy: `Política de Privacidade`,
  },
  'zh-CN': {
    successHeadline: '就快好了。',
    successBody: '请在我们刚发送的邮件中确认订阅。',
    alreadyHeadline: '您已在订阅列表中!',
    alreadyBody: '您的订阅已经生效。有值得分享的内容时，我会告诉您。',
    emailPlaceholder: '您的邮箱地址',
    submit: '算我一个！',
    loading: '订阅中…',
    later: '稍后再说',
    closeAria: '关闭',
    closeLabel: '关闭',
    trust: '只在真正值得通知时发送。随时可取消。我们绝不分享您的邮箱。',
    errorGeneric: '订阅失败。请重试。',
    socialLead: '在此期间，看看我在拉普兰的动态：',
    founderAlt: 'LaplandVibes创始人Vesa',
    consent: `我同意 LaplandVibes 向我填写的邮箱发送订阅邮件，内容包括拉普兰旅行建议、季节资讯和优惠信息，并确认本人已年满18周岁。`,
    privacy: `隐私政策`,
  },
  ko: {
    successHeadline: '거의 다 됐습니다.',
    successBody: '방금 보내드린 이메일에서 구독을 확인해 주세요.',
    alreadyHeadline: '이미 구독 중입니다!',
    alreadyBody: '이미 구독하고 계십니다. 전할 소식이 있을 때 연락드릴게요.',
    emailPlaceholder: '이메일 주소',
    submit: '함께할게요!',
    loading: '구독 중…',
    later: '나중에',
    closeAria: '닫기',
    closeLabel: '닫기',
    trust: '정말 가치 있는 소식만 보내드립니다. 언제든 해지 가능. 이메일을 공유하지 않습니다.',
    errorGeneric: '구독 실패. 다시 시도해 주세요.',
    socialLead: '그동안 라플란드 여행 게시물을 만나보세요:',
    founderAlt: 'LaplandVibes 창립자 베사',
    consent: `입력한 이메일 주소로 LaplandVibes가 보내는 여행 팁·시즌 정보·프로모션 소식 뉴스레터 수신에 동의하며, 만 18세 이상임을 확인합니다.`,
    privacy: `개인정보처리방침`,
  },
  fr: {
    successHeadline: 'Presque fini.',
    successBody: 'Confirmez votre inscription depuis l\'e-mail que nous venons de vous envoyer.',
    alreadyHeadline: 'Déjà inscrit·e !',
    alreadyBody: 'Votre inscription était déjà active. Vous aurez de mes nouvelles quand il y aura quelque chose à raconter.',
    emailPlaceholder: 'Votre adresse e-mail',
    submit: 'Je m\'inscris !',
    loading: 'Inscription…',
    later: 'Peut-être plus tard',
    closeAria: 'Fermer',
    closeLabel: 'Fermer',
    trust: 'Uniquement quand cela vaut le coup. Désabonnement à tout moment. Nous ne partageons jamais votre e-mail.',
    errorGeneric: 'Inscription échouée. Veuillez réessayer.',
    socialLead: 'En attendant, mes publications de Laponie :',
    founderAlt: 'Vesa, fondateur de LaplandVibes',
    consent: `J'accepte de recevoir la newsletter LaplandVibes (conseils voyage, infos saisonnières, offres) à cette adresse e-mail et je confirme avoir 18 ans ou plus.`,
    privacy: `Politique de confidentialité`,
  },
  it: {
    successHeadline: 'Ci siamo quasi.',
    successBody: 'Confermi l\'iscrizione dall\'e-mail che Le abbiamo appena inviato.',
    alreadyHeadline: 'È già nella lista!',
    alreadyBody: 'La Sua iscrizione era già attiva. Le scrivo quando c\'è qualcosa da raccontare.',
    emailPlaceholder: 'Il Suo indirizzo e-mail',
    submit: 'Ci sto!',
    loading: 'Iscrizione…',
    later: 'Forse più tardi',
    closeAria: 'Chiudi',
    closeLabel: 'Chiudi',
    trust: 'Solo quando c\'è qualcosa che vale davvero. Disiscrizione in qualsiasi momento. Non condividiamo mai il Suo indirizzo e-mail.',
    errorGeneric: 'Iscrizione fallita. Riprovi.',
    socialLead: 'Nel frattempo, i miei post dalla Lapponia:',
    founderAlt: 'Vesa, fondatore di LaplandVibes',
    consent: `Sì, desidero ricevere la newsletter di LaplandVibes (consigli di viaggio, novità stagionali e offerte) all'indirizzo indicato. Ho almeno 18 anni.`,
    privacy: `Informativa sulla privacy`,
  },
  nl: {
    successHeadline: 'Bijna klaar.',
    successBody: 'Bevestig uw aanmelding via de e-mail die we net hebben gestuurd.',
    alreadyHeadline: 'Al op de lijst!',
    alreadyBody: 'U was al aangemeld. U hoort van mij als er iets te vertellen valt.',
    emailPlaceholder: 'Uw e-mailadres',
    submit: 'Ik doe mee!',
    loading: 'Bezig…',
    later: 'Misschien later',
    closeAria: 'Sluiten',
    closeLabel: 'Sluiten',
    trust: 'Alleen als het echt de moeite waard is. Op elk moment opzegbaar. We delen uw e-mail nooit.',
    errorGeneric: 'Abonneren mislukt. Probeer opnieuw.',
    socialLead: 'Ondertussen, mijn posts uit Lapland:',
    founderAlt: 'Vesa, oprichter van LaplandVibes',
    consent: `Ja, LaplandVibes mag de nieuwsbrief met reistips, seizoensinfo en aanbiedingen naar dit e-mailadres sturen. Ik ben 18 jaar of ouder.`,
    privacy: `Privacyverklaring`,
  },
  sv: {
    successHeadline: 'Nästan klart.',
    successBody: 'Bekräfta din prenumeration i mejlet vi just skickade.',
    alreadyHeadline: 'Du står redan på listan!',
    alreadyBody: 'Din prenumeration var redan aktiv. Du hör av mig när det finns något att berätta.',
    emailPlaceholder: 'Din e-postadress',
    submit: 'Jag är med!',
    loading: 'Prenumererar…',
    later: 'Kanske senare',
    closeAria: 'Stäng',
    closeLabel: 'Stäng',
    trust: 'Bara när något är värt att berätta. Avsluta när du vill. Vi delar aldrig din e-post.',
    errorGeneric: 'Prenumerationen misslyckades. Försök igen.',
    socialLead: 'Under tiden, mina inlägg från Lappland:',
    founderAlt: 'Vesa, grundare av LaplandVibes',
    consent: `Ja, jag vill ha nyhetsbrevet från LaplandVibes med restips, säsongsinfo och erbjudanden till min e-postadress. Jag är minst 18 år.`,
    privacy: `Integritetspolicy`,
  },
};

// Kept for back-compat with consumers that imported DEFAULT_DICT directly.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_DICT: Required<NewsletterPopupDict> = LOCALE_DICTS.en;
void DEFAULT_DICT;

/**
 * Social glyphs as inline SVGs. Lucide has no TikTok icon and its newer
 * releases dropped the Instagram/Facebook brand icons entirely, so all three
 * live here — sites pin different lucide versions and imports would break.
 */
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/**
 * One-time spiral entrance for the founder avatar. The translate offset shrinks
 * to zero while the rotation unwinds, so the photo swirls inward and settles —
 * runs once per popup open, never loops (a permanently spinning face is a
 * credibility killer). Under prefers-reduced-motion it becomes a plain fade.
 */
const FOUNDER_STYLES = `
@keyframes lv-founder-spiral {
  0%   { transform: rotate(-660deg) scale(0.05) translate(0, -150px); opacity: 0; }
  55%  { opacity: 1; }
  86%  { transform: rotate(6deg) scale(1.06) translate(0, 0); }
  100% { transform: rotate(0deg) scale(1) translate(0, 0); opacity: 1; }
}
@keyframes lv-founder-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.lv-founder-avatar {
  animation: lv-founder-spiral 1.15s cubic-bezier(0.22, 1, 0.36, 1) both;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .lv-founder-avatar { animation: lv-founder-fade 0.4s ease-out both; }
}
`;

/**
 * [LV-FUNNEL 2026-08-21] Lomakesuppilon eventit Umamiin (nl_view/nl_start/
 * nl_blocked/nl_submit/nl_success/nl_error/nl_dismiss + data.surface).
 * Paikallinen apuri per komponentti — EI jaettua importtia, koska vendoroitu
 * sync-shared on refresh-only eikä poimi uusia tiedostoja. Analytiikka ei saa
 * koskaan rikkoa lomaketta: umami voi puuttua (CSP/adblock) ja kutsu on
 * try/catchissa. Standardi: memory _procedural/lv_form_funnel_events.md.
 */
function track(event: string, data?: Record<string, unknown>) {
  try {
    (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } }).umami?.track(event, data);
  } catch { /* ignore */ }
}

export default function NewsletterPopup({
  siteId,
  // [LV-CONSENT-V2 2026-08-14] Tietosuojaselosteen polku vaihtelee
  // sivustoittain (`/privacy` 9:llä, `/privacy-policy` 3:lla — mitattu
  // App.tsx:n reiteistä 14.8.). 🔴 Älä todenna curlilla: SPA-kuori antaa
  // 200 mille tahansa polulle, joten se ei todista reitin olemassaoloa.
  privacyHref = '/privacy',
  brandWord = 'VIBES',
  headline,
  description,
  dict,
  lang,
  onSubscribed,
  delaySeconds = 60,
  scrollPercent = 60,
  defaultOpen = false,
  endpoint,
  supabaseUrl,
  supabaseAnonKey,
  founderImage = '/vesa-founder.webp',
  thanksImage = '/vesa-lapland.webp',
}: NewsletterPopupProps) {
  // 2026-05-23: pick localized defaults when `lang` is supplied + caller
  // didn't override headline/description. Prevents EN copy on /fi /cn etc.
  const safeLang: SupportedLang = (lang && LOCALE_HEADLINES[lang]) ? lang : 'en';
  const localized = LOCALE_HEADLINES[safeLang];
  const resolvedHeadline = headline ?? localized.headline;
  const resolvedDescription = description ?? localized.description;
  const D = { ...LOCALE_DICTS[safeLang], ...(dict ?? {}) };
  const storageKey = `${siteId}_newsletter_popup`;
  // Per-session "already shown" guard (sessionStorage). Once the popup has
  // appeared once this browsing session it will NOT pop again on later page
  // views, even if the visitor never clicked dismiss (Vesa 2026-07-03: "ettei
  // joka sivulla tulisi vastaan, aika ärsyttävä"). Cleared when the browser
  // session ends. Layered on top of the localStorage dismiss (7 d) / subscribe.
  const sessionShownKey = `${siteId}_newsletter_shown`;
  const sourceTag = `${siteId}-popup`;
  // Kieli talteen liidiin. `safeLang` ei kelpaa tähän: se putoaa 'en':ään aina
  // kun `lang`-proppia ei anneta, jolloin kirjaisimme englannin sivustoille
  // jotka eivät vain välitä lang-proppia. Käytä annettua proppia, muuten
  // <html lang> -attribuuttia, muuten jätä tyhjäksi.
  const resolvedLang: string | undefined =
    lang ??
    (typeof document !== 'undefined' ? document.documentElement.lang || undefined : undefined);

  const [status, setStatus] = useState<Status>(defaultOpen ? 'visible' : 'hidden');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, humans leave blank
  const [consented, setConsented] = useState(false); // [LV-CONSENT-V2] pakollinen
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [thanksBroken, setThanksBroken] = useState(false);
  const location = useLocation();
  // [LV-FUNNEL] view/start kerran per mount; blocked kerran per submit-yritys
  // (natiivi invalid laukeaa per kenttä — ensimmäinen kertoo pysäyttäjän).
  const funnelData = { surface: 'popup', lang: resolvedLang };
  const viewTracked = useRef(false);
  const startTracked = useRef(false);
  const blockedTracked = useRef(false);
  const trackView = () => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    track('nl_view', funnelData);
  };
  const trackStart = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    track('nl_start', funnelData);
  };
  useEffect(() => {
    if (defaultOpen) trackView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (defaultOpen) return;
    if (SUPPRESSED_PATHS.includes(location.pathname)) return;

    const stored = readStored(storageKey);
    if (stored?.subscribed) return; // never show again after subscribe
    if (stored?.dismissed && Date.now() - stored.dismissed < REMIND_AFTER_MS) return;
    // Already shown once this session → do not re-arm on this (or any later)
    // page view. This is what stops it appearing on every page as you browse.
    try { if (sessionStorage.getItem(sessionShownKey)) return; } catch { /* private mode */ }

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      try { sessionStorage.setItem(sessionShownKey, '1'); } catch { /* private mode */ }
      setStatus('visible');
      trackView();
    };

    const timer =
      delaySeconds > 0 ? window.setTimeout(trigger, delaySeconds * 1000) : 0;

    const onScroll = () => {
      if (scrollPercent <= 0) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = (window.scrollY / total) * 100;
      if (pct >= scrollPercent) trigger();
    };
    if (scrollPercent > 0) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      if (scrollPercent > 0) window.removeEventListener('scroll', onScroll);
    };
  }, [location.pathname, storageKey, sessionShownKey, defaultOpen, delaySeconds, scrollPercent]);

  // Esc to dismiss when visible
  useEffect(() => {
    if (status === 'hidden') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Lock body scroll while open
  useEffect(() => {
    if (status === 'hidden') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [status]);

  const dismiss = () => {
    writeStored(storageKey, { ...(readStored(storageKey) || {}), dismissed: Date.now() });
    setStatus('hidden');
    track('nl_dismiss', funnelData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consented) {
      track('nl_blocked', { ...funnelData, reason: !email ? 'email' : 'consent' });
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    track('nl_submit', funnelData);

    try {
      // Resolve URL + headers based on whether a proxy endpoint or direct
      // Supabase call is configured. Proxy doesn't need Authorization (the
      // server-side proxy injects it).
      const url = endpoint ?? `${supabaseUrl}/functions/v1/send-welcome-email`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (!endpoint && supabaseAnonKey) {
        headers.Authorization = `Bearer ${supabaseAnonKey}`;
      }
      const res = await fetch(url, {
        method: 'POST',
        headers,
        // `website` on hunajapurkki (send-welcome-emailin HONEYPOT_FIELDS) —
        // ihminen jättää sen tyhjäksi, botti täyttää. ÄLÄ laita siihen
        // sivuston nimeä tms.: epätyhjä arvo pudottaa tilauksen hiljaa.
        // Sivusto + kieli kulkevat omissa kentissään segmentointia varten.
        // `language` lähetetään vain kun se oikeasti tiedetään — ei arvata
        // 'en':ää, koska väärä kielileima on huonompi kuin tyhjä.
        body: JSON.stringify({
          email,
          source: sourceTag,
          website,
          site: siteId,
          language: resolvedLang,
          channel: 'popup',
          // [LV-CONSENT-V2 2026-08-14] Palvelin vaatii nämä (z.literal(true)).
          // `consentText` on se teksti jonka käyttäjä näki omalla kielellään.
          consent: true,
          ageConfirmed: true,
          consentText: D.consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || D.errorGeneric);

      if (data.alreadySubscribed) {
        setStatus('already');
        track('nl_success', { ...funnelData, already: true });
      } else {
        setStatus('success');
        track('nl_success', funnelData);
        onSubscribed?.(sourceTag);
      }
      writeStored(storageKey, { subscribed: Date.now() });
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err?.message || D.errorGeneric);
      setStatus('error');
      track('nl_error', funnelData);
    }
  };

  if (status === 'hidden') return null;

  const isSuccess = status === 'success' || status === 'already';

  const socialButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '9999px',
    background: 'rgba(255,255,255,0.10)',
    color: '#F9FAFB',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  };

  return (
    // overflow-y-auto + items-start on mobile: a card taller than the phone
    // viewport (long FI/DE copy + short mobile viewport) must stay scrollable so
    // the close button is always reachable. Without this the centred card pushed
    // the ✕ off-screen and — body scroll being locked — trapped mobile users
    // under a dark overlay (Vesa 2026-07-10). Desktop stays centred.
    <div className="fixed inset-0 z-[9990] flex items-start sm:items-center justify-center px-4 py-8 overflow-y-auto overscroll-contain">
      <style>{FOUNDER_STYLES}</style>
      {/* Backdrop */}
      <button
        type="button"
        aria-label={D.closeAria}
        onClick={dismiss}
        className="fixed inset-0 bg-deep-night/85 backdrop-blur-sm cursor-default"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lv-newsletter-popup-title"
        className="relative my-auto max-w-md w-full bg-deep-night rounded-2xl shadow-2xl"
        style={{ border: '1px solid rgba(236,72,153,0.40)' }}
      >
        {/* Pink accent strip */}
        <div
          className="h-1 w-full rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, #EC4899 0%, #DB2777 50%, #BE185D 100%)' }}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={dismiss}
          aria-label={D.closeAria}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-snow/60 hover:text-snow hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          {isSuccess ? (
            <>
              {/* Trip photo — the Suomi-helmet shot. Playful counterpart to the
                  trust-face avatar: email captured first, personality after. */}
              {!thanksBroken && (
                <img
                  src={thanksImage}
                  alt={D.founderAlt}
                  onError={() => setThanksBroken(true)}
                  className="w-full rounded-xl mb-4 object-cover"
                  style={{ height: '132px', objectPosition: 'center 32%' }}
                />
              )}
              <h2
                id="lv-newsletter-popup-title"
                className="font-heading text-2xl sm:text-3xl text-snow tracking-wide leading-tight mb-2"
              >
                {status === 'success' ? D.successHeadline : D.alreadyHeadline}
              </h2>
              <p className="text-snow/75 text-sm sm:text-base leading-relaxed mb-5">
                {status === 'success' ? D.successBody : D.alreadyBody}
              </p>

              <p className="text-snow/85 text-sm font-medium mb-3">{D.socialLead}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener"
                  aria-label="TikTok: @laplandvibes"
                  style={socialButtonStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EC4899'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                >
                  <TikTokIcon />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram: @laplandvibesofficial"
                  style={socialButtonStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EC4899'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                >
                  <InstagramIcon />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook: LaplandVibes"
                  style={socialButtonStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EC4899'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                >
                  <FacebookIcon />
                </a>
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-snow font-medium text-sm transition-colors cursor-pointer"
              >
                {D.closeLabel}
              </button>
            </>
          ) : (
            <>
              {/* Founder avatar — spirals in once, then holds still. */}
              {!avatarBroken && (
                <div
                  className="lv-founder-avatar mx-auto mb-4"
                  style={{
                    width: '128px',
                    height: '128px',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    boxShadow: '0 0 0 3px #EC4899, 0 0 40px rgba(236,72,153,0.55)',
                  }}
                >
                  <img
                    src={founderImage}
                    alt={D.founderAlt}
                    onError={() => setAvatarBroken(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {/* Brand mark, adapts to current site. The wordmark is ALWAYS Bebas
                  Neue, never the host site's heading font: see WORDMARK_FONT. */}
              <p className="font-heading tracking-wide text-xl sm:text-2xl mb-3 leading-none" style={{ fontFamily: WORDMARK_FONT }}>
                <span className="text-vibe-pink">#</span>
                <span className="text-snow">LAPLAND</span>
                <span className="text-vibe-pink">{brandWord}</span>
              </p>

              <h2
                id="lv-newsletter-popup-title"
                className="font-heading text-2xl sm:text-3xl text-snow tracking-wide leading-tight mb-3"
              >
                {resolvedHeadline}
              </h2>
              <p className="text-snow/75 text-sm sm:text-base leading-relaxed mb-5 text-left sm:text-center">
                {resolvedDescription}
              </p>

              <form
                onSubmit={handleSubmit}
                // [LV-FUNNEL] required-kentät estävät submitin natiivisti ennen
                // handleSubmitia — invalid-capture kertoo MIKÄ kenttä pysäytti.
                onInvalidCapture={(e) => {
                  if (blockedTracked.current) return;
                  blockedTracked.current = true;
                  window.setTimeout(() => { blockedTracked.current = false; }, 400);
                  const t = e.target as HTMLInputElement;
                  track('nl_blocked', { ...funnelData, reason: t.type === 'checkbox' ? 'consent' : 'email' });
                }}
                className="flex flex-col gap-3"
              >
                {/* Honeypot: off-screen, not focusable, hidden from a11y tree. Bots fill it; humans never see it. */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                />
                <input
                  type="email"
                  value={email}
                  onFocus={trackStart}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={D.emailPlaceholder}
                  required
                  disabled={status === 'loading'}
                  autoComplete="email"
                  // 2026-05-12: switched from Tailwind `bg-white/8 text-snow` to
                  // explicit inline style, not every LV site (e.g. laplandvisit)
                  // defines the `snow` colour token in tailwind.config, which
                  // made the input render as pure white-on-white and invisible.
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#F8FAFC',
                    WebkitTextFillColor: '#F8FAFC',
                  }}
                  className="w-full px-5 py-3 rounded-full border border-white/15 focus:border-vibe-pink/60 focus:outline-none focus:ring-2 focus:ring-vibe-pink/25 disabled:opacity-50 placeholder:text-white/40"
                />
                {/* [LV-CONSENT-V2 2026-08-14] Pakollinen suostumus + ikävahvistus.
                    Esivalitsematon: GDPR:n mukaan esivalittu ruutu ei ole suostumus. */}
                <label className="flex items-start gap-2.5 text-left cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consented}
                    onChange={(e) => setConsented(e.target.checked)}
                    required
                    disabled={status === 'loading'}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-vibe-pink cursor-pointer"
                  />
                  <span className="text-white/70 text-[11px] leading-relaxed">
                    {D.consent}{' '}
                    <a
                      href={privacyHref}
                      target="_blank"
                      rel="noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="underline hover:text-white"
                    >
                      {D.privacy}
                    </a>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3 rounded-full hover:bg-pink-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-vibe-pink/25 cursor-pointer"
                  style={{ backgroundColor: '#DB2777' }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {D.loading}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> {D.submit}
                    </>
                  )}
                </button>
              </form>

              {status === 'error' && (
                <p className="mt-3 text-xs flex items-center justify-center gap-1.5 text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </p>
              )}

              <button
                type="button"
                onClick={dismiss}
                className="mt-4 w-full text-center text-snow/60 hover:text-snow/75 text-xs transition-colors cursor-pointer"
              >
                {D.later}
              </button>

              <p className="mt-4 text-[11px] text-snow/60 text-center leading-relaxed">
                {D.trust}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
