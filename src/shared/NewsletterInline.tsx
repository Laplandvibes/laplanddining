import { useEffect, useRef, useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import FounderByline from './FounderByline';

/**
 * [LV-FUNNEL 2026-08-21] Lomakesuppilon eventit Umamiin — paikallinen apuri,
 * ei jaettua importtia (vendoroitu sync on refresh-only). Ei saa koskaan
 * rikkoa lomaketta. Standardi: memory _procedural/lv_form_funnel_events.md.
 */
function track(event: string, data?: Record<string, unknown>) {
  try {
    (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } }).umami?.track(event, data);
  } catch { /* ignore */ }
}

/**
 * Standard bottom-of-page newsletter section (founder edition 2026-08-09) for
 * sites that had no inline signup at all (laplanddining, laplandtours,
 * laplandvisit — every ecosystem site must offer bottom-of-page signup, see
 * CLAUDE.md "Pakolliset elementit"). Visual grammar follows the hub band:
 * the ONE intentional pink section (vibe-pink → pink-600 gradient), white
 * pill CTA. Strings are founder-voiced, no cadence promises, all 12 locales.
 *
 * Locale comes from <html lang> via FounderByline's convention: pass `lang`
 * explicitly where the site has a hook, else it falls back to <html lang>.
 */

const STRINGS: Record<string, {
  headline: string; sub: string; placeholder: string; submit: string;
  loading: string; success: string; already: string; trust: string; error: string;
  // [LV-CONSENT-V2 2026-08-14] `consent` on se teksti jonka tilaaja
  // tosiasiassa hyväksyy. Se lähetetään myös palvelimelle ja tallennetaan
  // riville: GDPR edellyttää että suostumus pystytään osoittamaan
  // jälkikäteen, eikä pelkkä boolean kerro mihin suostuttiin.
  consent: string; privacy: string;
}> = {
  en: { headline: 'Lapland in your inbox', sub: 'Seasons, places and booking timing from my own trips around Lapland.', placeholder: 'Your email address', submit: 'Count me in!', loading: 'Subscribing…', success: 'Almost there: confirm your subscription from the email we just sent you.', already: 'You were already subscribed — nothing more to do.', trust: "Only when there's something worth telling you about. Unsubscribe any time.", error: 'Subscription failed. Please try again.' , consent: `Yes, send the LaplandVibes newsletter (travel tips, seasonal updates and offers) to this email address. I confirm I am 18 or over.`, privacy: `Privacy Policy` },
  fi: { headline: 'Lappi postiisi', sub: 'Sesongit, paikat ja varausajankohdat omilta Lapin-reissuiltani.', placeholder: 'Sähköpostiosoitteesi', submit: 'Lähden mukaan!', loading: 'Tilataan…', success: 'Melkein valmista: käy vahvistamassa tilaus sähköpostiisi tulleesta viestistä.', already: 'Tilauksesi oli jo voimassa — ei tarvitse tehdä mitään.', trust: 'Lähetämme vain silloin, kun on jotain oikeasti kerrottavaa. Tilauksen voi perua koska tahansa.', error: 'Tilauksessa virhe. Yritä uudelleen.' , consent: `LaplandVibes saa lähettää minulle uutiskirjettä (matkailuvinkkejä, sesonkitietoa ja tarjouksia) antamaani sähköpostiosoitteeseen. Olen täyttänyt 18 vuotta.`, privacy: `Tietosuojaseloste` },
  de: { headline: 'Lappland in Ihrem Postfach', sub: 'Saisonzeiten, Orte und Buchungstiming von meinen eigenen Lappland-Reisen.', placeholder: 'Ihre E-Mail-Adresse', submit: 'Ich bin dabei!', loading: 'Anmeldung läuft…', success: 'Fast geschafft: Bestätigen Sie Ihr Abo über die E-Mail, die wir Ihnen gerade geschickt haben.', already: 'Sie waren bereits angemeldet — nichts weiter zu tun.', trust: 'Nur wenn etwas wirklich der Rede wert ist. Jederzeit kündbar.', error: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.' , consent: `Ja, LaplandVibes darf mir den Newsletter mit Reisetipps, Saisoninfos und Angeboten an diese E-Mail-Adresse senden. Ich bin mindestens 18 Jahre alt.`, privacy: `Datenschutzerklärung` },
  ja: { headline: 'ラップランドをあなたの受信箱へ', sub: '季節、場所、予約のタイミング — 私自身のラップランドの旅から。', placeholder: 'メールアドレス', submit: '参加します！', loading: '登録中…', success: 'あと少しです。いまお送りしたメールから登録を確認してください。', already: 'すでにご登録済みです — 手続きは不要です。', trust: '本当に価値のある時だけお届けします。いつでも解除可能。', error: '登録に失敗しました。もう一度お試しください。' , consent: `入力したメールアドレス宛に、LaplandVibesがニュースレター（旅のヒント、シーズン情報、キャンペーン情報）を送ることに同意します。私は18歳以上です。`, privacy: `プライバシーポリシー` },
  es: { headline: 'Laponia en tu correo', sub: 'Temporadas, lugares y cuándo reservar, desde mis propios viajes por Laponia.', placeholder: 'Tu correo electrónico', submit: '¡Me apunto!', loading: 'Suscribiendo…', success: 'Ya casi: confirma tu suscripción desde el correo que acabamos de enviarte.', already: 'Tu suscripción ya estaba activa — no hace falta nada más.', trust: 'Solo cuando hay algo que merezca la pena. Cancela cuando quieras.', error: 'Suscripción fallida. Inténtalo de nuevo.' , consent: `Acepto recibir en mi correo el boletín de LaplandVibes (consejos de viaje, información de temporada y ofertas) y confirmo que tengo al menos 18 años.`, privacy: `Política de privacidad` },
  'pt-BR': { headline: 'A Lapônia no seu e-mail', sub: 'Estações, lugares e quando reservar, das minhas próprias viagens pela Lapônia.', placeholder: 'Seu e-mail', submit: 'Quero participar!', loading: 'Inscrevendo…', success: 'Quase lá: confirme sua inscrição no e-mail que acabamos de enviar.', already: 'Sua inscrição já estava ativa — nada mais a fazer.', trust: 'Apenas quando vale a pena destacar. Cancele a qualquer momento.', error: 'Falha na inscrição. Tente novamente.' , consent: `Aceito receber a newsletter da LaplandVibes no e-mail informado, com dicas de viagem, informações de temporada e ofertas. Tenho 18 anos ou mais.`, privacy: `Política de Privacidade` },
  'zh-CN': { headline: '拉普兰，直达你的邮箱', sub: '季节、去处与预订时机——来自我自己的拉普兰旅程。', placeholder: '您的邮箱地址', submit: '算我一个！', loading: '订阅中…', success: '就快好了：请在我们刚发送的邮件中确认订阅。', already: '您已订阅——无需再操作。', trust: '只在真正值得通知时发送。随时可取消。', error: '订阅失败。请重试。' , consent: `我同意 LaplandVibes 向我填写的邮箱发送订阅邮件，内容包括拉普兰旅行建议、季节资讯和优惠信息，并确认本人已年满18周岁。`, privacy: `隐私政策` },
  ko: { headline: '라플란드를 메일함으로', sub: '시즌, 장소, 예약 타이밍 — 제가 직접 다닌 라플란드 여행에서.', placeholder: '이메일 주소', submit: '함께할게요!', loading: '구독 중…', success: '거의 다 됐습니다. 방금 보내드린 이메일에서 구독을 확인해 주세요.', already: '이미 구독 중이셨습니다 — 더 하실 일은 없어요.', trust: '정말 가치 있는 소식만 보내드립니다. 언제든 해지 가능.', error: '구독 실패. 다시 시도해 주세요.' , consent: `입력한 이메일 주소로 LaplandVibes가 보내는 여행 팁·시즌 정보·프로모션 소식 뉴스레터 수신에 동의하며, 만 18세 이상임을 확인합니다.`, privacy: `개인정보처리방침` },
  fr: { headline: 'La Laponie dans votre boîte mail', sub: 'Saisons, lieux et calendrier de réservation, tirés de mes propres voyages en Laponie.', placeholder: 'Votre adresse e-mail', submit: 'Je m\'inscris !', loading: 'Inscription…', success: 'Presque fini : confirmez votre inscription depuis l\'e-mail que nous venons de vous envoyer.', already: 'Votre inscription était déjà active — rien de plus à faire.', trust: 'Uniquement quand cela vaut le coup. Désabonnement à tout moment.', error: 'Inscription échouée. Veuillez réessayer.' , consent: `J'accepte de recevoir la newsletter LaplandVibes (conseils voyage, infos saisonnières, offres) à cette adresse e-mail et je confirme avoir 18 ans ou plus.`, privacy: `Politique de confidentialité` },
  it: { headline: 'La Lapponia nella Sua casella', sub: 'Stagioni, posti e tempi di prenotazione, dai miei viaggi in Lapponia.', placeholder: 'Il Suo indirizzo e-mail', submit: 'Ci sto!', loading: 'Iscrizione…', success: 'Ci siamo quasi: conferma l\'iscrizione dall\'e-mail che Le abbiamo appena inviato.', already: 'La Sua iscrizione era già attiva — non serve altro.', trust: 'Solo quando c\'è qualcosa che vale davvero. Disiscrizione in qualsiasi momento.', error: 'Iscrizione fallita. Riprova.' , consent: `Sì, desidero ricevere la newsletter di LaplandVibes (consigli di viaggio, novità stagionali e offerte) all'indirizzo indicato. Ho almeno 18 anni.`, privacy: `Informativa sulla privacy` },
  nl: { headline: 'Lapland in je inbox', sub: 'Seizoenen, plekken en boekingstiming uit mijn eigen Lapland-reizen.', placeholder: 'Je e-mailadres', submit: 'Ik doe mee!', loading: 'Bezig…', success: 'Bijna klaar: bevestig je aanmelding via de e-mail die we net hebben gestuurd.', already: 'Je was al aangemeld — je hoeft niets te doen.', trust: 'Alleen als het echt de moeite waard is. Op elk moment opzegbaar.', error: 'Abonneren mislukt. Probeer opnieuw.' , consent: `Ja, LaplandVibes mag de nieuwsbrief met reistips, seizoensinfo en aanbiedingen naar dit e-mailadres sturen. Ik ben 18 jaar of ouder.`, privacy: `Privacyverklaring` },
  sv: { headline: 'Lappland i din inkorg', sub: 'Säsonger, platser och bokningstider från mina egna Lapplandsresor.', placeholder: 'Din e-postadress', submit: 'Jag är med!', loading: 'Prenumererar…', success: 'Nästan klart: bekräfta din prenumeration i mejlet vi just skickade.', already: 'Din prenumeration var redan aktiv — inget mer behövs.', trust: 'Bara när något är värt att berätta. Avsluta när du vill.', error: 'Prenumerationen misslyckades. Försök igen.' , consent: `Ja, jag vill ha nyhetsbrevet från LaplandVibes med restips, säsongsinfo och erbjudanden till min e-postadress. Jag är minst 18 år.`, privacy: `Integritetspolicy` },
};

function normalizeLang(raw: string | undefined): string {
  if (!raw) return 'en';
  if (STRINGS[raw]) return raw;
  const lower = raw.toLowerCase();
  if (lower === 'br' || lower.startsWith('pt')) return 'pt-BR';
  if (lower === 'cn' || lower.startsWith('zh')) return 'zh-CN';
  const base = lower.split('-')[0];
  return STRINGS[base] ? base : 'en';
}

interface NewsletterInlineProps {
  /** Per-site id: source tag becomes `${siteId}-inline`. */
  siteId: string;
  /**
   * [LV-CONSENT-V2 2026-08-14] Tietosuojaselosteen polku. 🔴 EI saa kovakoodata:
   * polku vaihtelee sivustoittain. Mitattu 14.8.2026 App.tsx:n reiteistä:
   * `/privacy` yhdeksällä sivustolla, `/privacy-policy` kolmella
   * (laplandchristmas, laplandcarrental, laplandskiresorts).
   * Oletus on enemmistön polku; poikkeavat sivustot antavat tämän propin.
   *
   * 🔴 Älä todenna tätä curlilla: SPA-kuori palauttaa 200 mille tahansa
   * polulle, joten 200 EI todista reitin olemassaoloa. Katso App.tsx.
   */
  privacyHref?: string;
  /** Locale; defaults to <html lang>, normalised. */
  lang?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  /** GA4 callback, fires on new subscription with the source tag. */
  onSubscribed?: (source: string) => void;
}

export default function NewsletterInline({ siteId, lang, supabaseUrl, supabaseAnonKey, onSubscribed, privacyHref = '/privacy' }: NewsletterInlineProps) {
  const resolved = normalizeLang(
    lang ?? (typeof document !== 'undefined' ? document.documentElement.lang : undefined),
  );
  const s = STRINGS[resolved] ?? STRINGS.en;
  const sourceTag = `${siteId}-inline`;
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — humans leave blank
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // [LV-FUNNEL] view = osio vieritetty näkyviin (kerran), start = 1. fokus,
  // blocked kerran per submit-yritys (natiivi invalid laukeaa per kenttä).
  const funnelData = { surface: 'inline', lang: resolved };
  const sectionRef = useRef<HTMLElement | null>(null);
  const startTracked = useRef(false);
  const blockedTracked = useRef(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        track('nl_view', funnelData);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const trackStart = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    track('nl_start', funnelData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consented || status === 'loading') {
      if (status !== 'loading') track('nl_blocked', { ...funnelData, reason: !email ? 'email' : 'consent' });
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    track('nl_submit', funnelData);
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email,
          source: sourceTag,
          website,
          site: siteId,
          language: resolved,
          channel: 'inline',
          // [LV-CONSENT-V2 2026-08-14] Palvelin vaatii nämä (z.literal(true)):
          // ilman niitä rivi ei synny lainkaan. `consentText` on se teksti
          // jonka käyttäjä näki omalla kielellään, ei englanninkielinen vakio.
          consent: true,
          ageConfirmed: true,
          consentText: s.consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || s.error);
      if (data.alreadySubscribed) {
        setStatus('already');
        track('nl_success', { ...funnelData, already: true });
      } else {
        setStatus('success');
        track('nl_success', funnelData);
        onSubscribed?.(sourceTag);
      }
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err?.message || s.error);
      setStatus('error');
      track('nl_error', funnelData);
    }
  };

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-16 sm:py-20"
      style={{ background: 'linear-gradient(160deg, #DB2777 0%, #BE185D 58%, #9D174D 100%)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 90% at 50% -10%, rgba(255,255,255,0.15) 0%, transparent 55%)' }}
      />
      <div className="relative max-w-2xl mx-auto text-center">
        <h2
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-3 tracking-wide leading-[1.05]"
          style={{ textShadow: '0 2px 22px rgba(74,4,38,0.6)' }}
        >
          {s.headline}
        </h2>
        <p className="text-white text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto" style={{ textShadow: '0 1px 10px rgba(74,4,38,0.45)' }}>
          {s.sub}
        </p>

        <FounderByline tone="pink" lang={resolved} />

        {status === 'success' || status === 'already' ? (
          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <CheckCircle className="w-12 h-12 text-white mx-auto mb-3" />
            <p className="text-white text-lg font-semibold">
              {status === 'success' ? s.success : s.already}
            </p>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              onInvalidCapture={(e) => {
                if (blockedTracked.current) return;
                blockedTracked.current = true;
                window.setTimeout(() => { blockedTracked.current = false; }, 400);
                const t = e.target as HTMLInputElement;
                track('nl_blocked', { ...funnelData, reason: t.type === 'checkbox' ? 'consent' : 'email' });
              }}
              className="flex flex-col gap-4 max-w-lg mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3">
              {/* Honeypot: off-screen, hidden from a11y tree. Bots fill it. */}
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
                placeholder={s.placeholder}
                aria-label={s.placeholder}
                required
                disabled={status === 'loading'}
                autoComplete="email"
                className="flex-1 px-6 py-4 rounded-full text-base focus:outline-none disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: '#FFFFFF',
                  WebkitTextFillColor: '#FFFFFF',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: '#FFFFFF', color: '#DB2777' }}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {s.loading}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> {s.submit}
                  </>
                )}
                </button>
              </div>

              {/* [LV-CONSENT-V2 2026-08-14] Pakollinen suostumus + ikävahvistus.
                  Ennen 14.8.2026 tätä ei ollut lainkaan: `marketing_consent`
                  oli kovakoodattu arvoon true edge-funktiossa, eli tietokanta
                  väitti suostumusta jota kukaan ei ollut antanut.
                  Ruutu on esivalitsematon (GDPR: esivalittu ruutu ei ole
                  suostumus) ja lähetysnappi on estetty kunnes se on rastitettu. */}
              <label className="flex items-start gap-3 text-left cursor-pointer">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  required
                  disabled={status === 'loading'}
                  className="mt-1 w-4 h-4 shrink-0 accent-white cursor-pointer"
                />
                <span className="text-white/85 text-xs leading-relaxed">
                  {s.consent}{' '}
                  <a
                    href={privacyHref}
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => e.stopPropagation()}
                    className="underline hover:text-white"
                  >
                    {s.privacy}
                  </a>
                </span>
              </label>
            </form>

            {status === 'error' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-white/90">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            <p className="text-white/70 text-xs mt-4">{s.trust}</p>
          </>
        )}
      </div>
    </section>
  );
}
