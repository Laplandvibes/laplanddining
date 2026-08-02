/**
 * The app announcement that runs across the network.
 *
 * Two variants, and the difference between them is deliberate:
 *
 *  `hero`  — a fixed block on the front page. Loud, always there, no dismissal.
 *  `nudge` — everywhere else. Appears only AFTER the reader has engaged (half the
 *            page scrolled, or 45 s, or the pointer leaving toward the tab bar),
 *            once per visitor, anchored to the bottom and never covering the page.
 *
 * 🔴 Why `nudge` is not an interstitial, even though an interstitial converts
 * better in the short run: Google demotes mobile pages whose content is covered
 * by a popup on arrival, and organic search is the engine of all 29 sites. A
 * banner that costs rankings costs more traffic than it converts. This shape —
 * triggered by engagement, bottom-anchored, one screen-third at most — is
 * outside that policy while still being impossible to miss.
 * (Vesa 2026-08-01 asked for a popup on every page; agreed to this instead.)
 *
 * The QR is a committed static asset (public/images/app-qr.svg), generated once
 * rather than rendered by a runtime library — 2 KB of SVG carrying its own white
 * card, so it scans on any background and costs no JavaScript on 29 sites.
 *
 * Numbers in the copy are counted from the app's own data, not invented.
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Smartphone, ArrowRight, Check } from 'lucide-react';

/**
 * Locale straight from the URL, so this file drops into any site in the network
 * without importing that site's i18n helpers — the spokes do not all share the
 * hub's `useLocale` / `stripLocale`, and a promo block is not worth 26 forks.
 * Prefix != locale code for two of them: /br is pt-BR, /cn is zh-CN.
 */
const SEGMENT_LOCALE: Record<string, string> = {
  fi: 'fi', sv: 'sv', de: 'de', fr: 'fr', it: 'it', nl: 'nl',
  es: 'es', br: 'pt-BR', cn: 'zh-CN', ja: 'ja', ko: 'ko', kr: 'ko',
};

const localeFromPath = (pathname: string): string =>
  SEGMENT_LOCALE[pathname.split('/').filter(Boolean)[0] ?? ''] ?? 'en';

/** True on a site's front page in any locale: "/", "/fi", "/fi/". */
const isFrontPage = (pathname: string): boolean => {
  const segs = pathname.split('/').filter(Boolean);
  return segs.length === 0 || (segs.length === 1 && segs[0] in SEGMENT_LOCALE);
};

const APP_URL = 'https://app.laplandvibes.com/?utm_source=web&utm_medium=promo';
const QR_SRC = '/images/app-qr.svg';
const SEEN_KEY = 'lv_app_promo_seen';

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Labels for the counted figures. The numbers themselves are universal. */
  stats: [string, string, string, string];
  /** What you can actually do. Every one of these is a real screen in the app. */
  features: string[];
  cta: string;
  scan: string;
  free: string;
  dismiss: string;
};

/**
 * ð´ Every number below is counted from the app's own data, never rounded up:
 * 31 municipalities, 211 slopes and 105 lifts across 9 resorts, 475 checked
 * places (120 restaurants, 85 shops, 47 cafes, 47 fuel stations, 39 gyms,
 * 37 ATMs, 37 bars, 33 pharmacies, 29 saunas). EV chargers come live from
 * /api/chargers, so they get no fixed figure.
 *
 * The excitement has to come from the scale being real. "Never before" is a
 * claim anyone can make; "211 slopes and the nearest charger, offline, free"
 * is one only we can make, and it is the more persuasive of the two.
 */
const COPY: Record<string, Copy> = {
  en: {
    eyebrow: 'New · free',
    title: 'All of Lapland. One app.',
    lead: 'Nobody has put the whole of Finnish Lapland in one place before. Every municipality, every slope, every charger, every trailhead — and it still works when the signal does not.',
    stats: ['municipalities', 'slopes', 'lifts', 'checked places'],
    features: [
      '9 ski resorts, slope and lift counts',
      'EV chargers and fuel, nearest first',
      'Hiking and MTB routes, huts, campsites',
      'Events across the whole region',
      'Your tickets, saved in one wallet',
      'Live slope conditions from other skiers',
      'Flights, hotels and cars in one search',
      'Emergency numbers, always reachable',
    ],
    cta: 'Open the app',
    scan: 'Scan to open on your phone',
    free: 'Free · no account needed to browse',
    dismiss: 'Close',
  },
  fi: {
    eyebrow: 'Uutta · ilmainen',
    title: 'Koko Lappi. Yksi sovellus.',
    lead: 'Kukaan ei ole aiemmin koonnut koko Suomen Lappia yhteen paikkaan. Jokainen kunta, jokainen rinne, jokainen latausasema, jokainen reitin lähtöpaikka — ja se toimii silloinkin kun kenttää ei ole.',
    stats: ['kuntaa', 'rinnettä', 'hissiä', 'tarkistettua paikkaa'],
    features: [
      '9 hiihtokeskusta, rinteet ja hissit lukuina',
      'Sähkölatausasemat ja huoltoasemat, lähin ensin',
      'Vaellus- ja maastopyöräreitit, autiotuvat, leirintä',
      'Tapahtumat koko Lapin alueelta',
      'Lippusi tallessa yhdessä lompakossa',
      'Rinnetilanne suoraan muilta hiihtäjiltä',
      'Lennot, hotellit ja autot samasta hausta',
      'Hätänumerot aina saatavilla',
    ],
    cta: 'Avaa sovellus',
    scan: 'Skannaa ja avaa puhelimessa',
    free: 'Ilmainen · selaaminen ei vaadi tiliä',
    dismiss: 'Sulje',
  },
  sv: {
    eyebrow: 'Nytt · gratis',
    title: 'Hela Lappland. En app.',
    lead: 'Ingen har tidigare samlat hela finska Lappland på ett ställe. Varje kommun, varje backe, varje laddstation, varje ledstart — och det fungerar även när täckningen tar slut.',
    stats: ['kommuner', 'backar', 'liftar', 'kontrollerade platser'],
    features: [
      '9 skidorter, backar och liftar i siffror',
      'Laddstationer och bensinstationer, närmast först',
      'Vandrings- och cykelleder, ödestugor, camping',
      'Evenemang i hela regionen',
      'Dina biljetter i en och samma plånbok',
      'Backförhållanden direkt från andra åkare',
      'Flyg, hotell och bilar i en sökning',
      'Nödnummer alltid till hands',
    ],
    cta: 'Öppna appen',
    scan: 'Skanna för att öppna i telefonen',
    free: 'Gratis · inget konto behövs för att bläddra',
    dismiss: 'Stäng',
  },
  de: {
    eyebrow: 'Neu · kostenlos',
    title: 'Ganz Lappland. Eine App.',
    lead: 'Noch nie hat jemand das gesamte finnische Lappland an einem Ort versammelt. Jede Gemeinde, jede Piste, jede Ladesäule, jeder Wanderparkplatz — und es funktioniert auch dann, wenn kein Netz mehr da ist.',
    stats: ['Gemeinden', 'Pisten', 'Lifte', 'geprüfte Orte'],
    features: [
      '9 Skigebiete, Pisten und Lifte in Zahlen',
      'Ladesäulen und Tankstellen, nächste zuerst',
      'Wander- und MTB-Routen, Hütten, Campingplätze',
      'Veranstaltungen in der ganzen Region',
      'Deine Tickets in einer Wallet',
      'Pistenzustand direkt von anderen Fahrern',
      'Flüge, Hotels und Mietwagen in einer Suche',
      'Notrufnummern immer griffbereit',
    ],
    cta: 'App öffnen',
    scan: 'Zum Öffnen am Handy scannen',
    free: 'Kostenlos · zum Stöbern kein Konto nötig',
    dismiss: 'Schließen',
  },
  fr: {
    eyebrow: 'Nouveau · gratuit',
    title: 'Toute la Laponie. Une appli.',
    lead: 'Personne n’avait encore réuni toute la Laponie finlandaise au même endroit. Chaque commune, chaque piste, chaque borne de recharge, chaque départ de sentier — et ça marche même sans réseau.',
    stats: ['communes', 'pistes', 'remontées', 'lieux vérifiés'],
    features: [
      '9 stations de ski, pistes et remontées chiffrées',
      'Bornes de recharge et stations-service, au plus près',
      'Sentiers et VTT, refuges, campings',
      'Événements dans toute la région',
      'Vos billets réunis dans un seul portefeuille',
      'État des pistes par les autres skieurs',
      'Vols, hôtels et voitures en une recherche',
      'Numéros d’urgence toujours accessibles',
    ],
    cta: 'Ouvrir l’application',
    scan: 'Scannez pour ouvrir sur votre téléphone',
    free: 'Gratuit · aucun compte requis pour parcourir',
    dismiss: 'Fermer',
  },
  es: {
    eyebrow: 'Nuevo · gratis',
    title: 'Toda Laponia. Una app.',
    lead: 'Nadie había reunido antes toda la Laponia finlandesa en un solo sitio. Cada municipio, cada pista, cada punto de recarga, cada inicio de ruta — y funciona también sin cobertura.',
    stats: ['municipios', 'pistas', 'remontes', 'lugares verificados'],
    features: [
      '9 estaciones de esquí, pistas y remontes en cifras',
      'Puntos de recarga y gasolineras, el más cercano primero',
      'Rutas de senderismo y BTT, refugios, campings',
      'Eventos de toda la región',
      'Tus entradas en una sola cartera',
      'Estado de las pistas por otros esquiadores',
      'Vuelos, hoteles y coches en una búsqueda',
      'Números de emergencia siempre a mano',
    ],
    cta: 'Abrir la app',
    scan: 'Escanea para abrirla en tu móvil',
    free: 'Gratis · no hace falta cuenta para explorar',
    dismiss: 'Cerrar',
  },
  it: {
    eyebrow: 'Novità · gratis',
    title: 'Tutta la Lapponia. Un’app.',
    lead: 'Nessuno aveva mai riunito tutta la Lapponia finlandese in un unico posto. Ogni comune, ogni pista, ogni colonnina, ogni punto di partenza — e funziona anche quando il segnale non c’è.',
    stats: ['comuni', 'piste', 'impianti', 'luoghi verificati'],
    features: [
      '9 comprensori, piste e impianti in cifre',
      'Colonnine e distributori, il più vicino per primo',
      'Sentieri e MTB, rifugi, campeggi',
      'Eventi in tutta la regione',
      'I tuoi biglietti in un unico portafoglio',
      'Stato delle piste dagli altri sciatori',
      'Voli, hotel e auto in una sola ricerca',
      'Numeri di emergenza sempre a portata',
    ],
    cta: 'Apri l’app',
    scan: 'Inquadra per aprirla sul telefono',
    free: 'Gratis · nessun account per navigare',
    dismiss: 'Chiudi',
  },
  nl: {
    eyebrow: 'Nieuw · gratis',
    title: 'Heel Lapland. Eén app.',
    lead: 'Niemand heeft ooit heel Fins Lapland op één plek samengebracht. Elke gemeente, elke piste, elke laadpaal, elk startpunt — en het werkt ook als er geen bereik is.',
    stats: ['gemeenten', 'pistes', 'liften', 'gecontroleerde plekken'],
    features: [
      '9 skigebieden, pistes en liften in cijfers',
      'Laadpalen en tankstations, dichtstbijzijnde eerst',
      'Wandel- en MTB-routes, hutten, campings',
      'Evenementen in de hele regio',
      'Je tickets in één wallet',
      'Pistestatus van andere skiërs',
      'Vluchten, hotels en auto’s in één zoekopdracht',
      'Alarmnummers altijd bij de hand',
    ],
    cta: 'Open de app',
    scan: 'Scan om op je telefoon te openen',
    free: 'Gratis · geen account nodig om te bladeren',
    dismiss: 'Sluiten',
  },
  'pt-BR': {
    eyebrow: 'Novo · grátis',
    title: 'Toda a Lapônia. Um app.',
    lead: 'Ninguém havia reunido toda a Lapônia finlandesa em um só lugar. Cada município, cada pista, cada carregador, cada início de trilha — e funciona mesmo sem sinal.',
    stats: ['municípios', 'pistas', 'teleféricos', 'lugares verificados'],
    features: [
      '9 estações de esqui, pistas e teleféricos em números',
      'Carregadores e postos, o mais próximo primeiro',
      'Trilhas e mountain bike, abrigos, campings',
      'Eventos de toda a região',
      'Seus ingressos em uma única carteira',
      'Condições das pistas por outros esquiadores',
      'Voos, hotéis e carros em uma busca',
      'Números de emergência sempre à mão',
    ],
    cta: 'Abrir o app',
    scan: 'Escaneie para abrir no celular',
    free: 'Grátis · não precisa de conta para navegar',
    dismiss: 'Fechar',
  },
  ja: {
    eyebrow: '新登場 · 無料',
    title: 'ラップランドのすべてを、ひとつのアプリに。',
    lead: 'フィンランド領ラップランド全体をひとつにまとめたアプリは、これまでありませんでした。すべての自治体、ゲレンデ、充電スタンド、登山口。電波が届かない場所でも使えます。',
    stats: ['自治体', 'ゲレンデ', 'リフト', '確認済みスポット'],
    features: [
      'スキー場9か所、ゲレンデ数とリフト数',
      'EV充電スタンドとガソリンスタンド、近い順に',
      'ハイキング・MTBコース、無人小屋、キャンプ場',
      '地域全体のイベント',
      'チケットをひとつのウォレットに',
      '他の滑走者からのリアルなゲレンデ状況',
      '航空券・ホテル・レンタカーをまとめて検索',
      '緊急連絡先にいつでもアクセス',
    ],
    cta: 'アプリを開く',
    scan: 'スキャンしてスマホで開く',
    free: '無料 · 閲覧にアカウントは不要',
    dismiss: '閉じる',
  },
  ko: {
    eyebrow: '새로움 · 무료',
    title: '라플란드 전체를, 하나의 앱에.',
    lead: '핀란드 라플란드 전체를 한곳에 모은 앱은 지금까지 없었습니다. 모든 지자체, 모든 슬로프, 모든 충전소, 모든 트레일 입구 — 신호가 없는 곳에서도 작동합니다.',
    stats: ['지자체', '슬로프', '리프트', '검증된 장소'],
    features: [
      '스키장 9곳, 슬로프와 리프트 수치',
      '전기차 충전소와 주유소, 가까운 순으로',
      '하이킹·MTB 코스, 산장, 캐핑장',
      '지역 전체의 행사',
      '티켓을 하나의 지갑에',
      '다른 스키어들이 남긴 슬로프 상태',
      '항공·호텔·렌터카를 한 번에 검색',
      '긴급 전화번호에 항상 접근',
    ],
    cta: '앱 열기',
    scan: '스캔해서 휴대폰에서 열기',
    free: '무료 · 둘러보기에 계정 불필요',
    dismiss: '닫기',
  },
  'zh-CN': {
    eyebrow: '全新 · 免费',
    title: '整个拉普兰，装进一个应用。',
    lead: '此前从未有人把整个芬兰拉普兰装进一个地方。每个市镇、每条雪道、每个充电桩、每个步道起点 — 没有信号时它依然可用。',
    stats: ['市镇', '雪道', '缆车', '已核实地点'],
    features: [
      '9 家滑雪场，雪道与缆车数量一目了然',
      '充电桩与加油站，就近排序',
      '徒步与山地车路线、野外小屋、营地',
      '覆盖全区域的活动',
      '把门票收进同一个卡包',
      '来自其他雪友的真实雪道状况',
      '机票、酒店与租车一次搜完',
      '紧急电话号码随时可用',
    ],
    cta: '打开应用',
    scan: '扫码在手机上打开',
    free: '免费 · 浏览无需账号',
    dismiss: '关闭',
  },
};

const copyFor = (locale: string): Copy => COPY[locale] ?? COPY.en;

function track(placement: string) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'app_promo_click', {
      placement,
    });
  } catch {
    /* analytics is never allowed to break a link */
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Front page: the fixed block.
   ────────────────────────────────────────────────────────────────────────── */
export function AppPromoHero() {
  const { pathname } = useLocation();
  const c = copyFor(localeFromPath(pathname));

  const FIGURES = ['31', '211', '105', '475'] as const;
  return (
    <section className="my-14 not-prose">
      <div className="relative overflow-hidden rounded-[28px] border border-vibe-pink/40 bg-gradient-to-br from-[#330f28] via-deep-night to-[#0d1a35] p-6 sm:p-10">
        {/* Two soft lights so the block reads as a product launch, not a banner. */}
        <div aria-hidden className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-vibe-pink/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-arctic-cyan/15 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-vibe-pink px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-vibe-pink/30">
            <Smartphone className="h-3.5 w-3.5" />
            {c.eyebrow}
          </span>

          <h2 className="font-heading tracking-wide text-snow text-[2.5rem] sm:text-6xl lg:text-7xl mt-5 leading-[0.95]">
            {c.title}
          </h2>
          <p className="text-snow/80 mt-4 text-base sm:text-lg leading-relaxed max-w-3xl">
            {c.lead}
          </p>

          {/* The scale, stated plainly. Every figure is counted from our own data. */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FIGURES.map((n, i) => (
              <div
                key={n}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-center"
              >
                <div className="font-heading tracking-wide text-vibe-pink text-3xl sm:text-4xl leading-none">
                  {n}
                </div>
                <div className="text-snow/70 text-[11px] sm:text-xs mt-1.5 leading-snug">
                  {c.stats[i]}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-end gap-8">
            <ul className="flex-1 grid sm:grid-cols-2 gap-x-7 gap-y-2.5">
              {c.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-snow/90 text-sm leading-snug">
                  <Check className="mt-[3px] h-4 w-4 shrink-0 text-aurora-green" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Decorative on a phone: you cannot scan the screen in your hand. */}
            <div className="hidden lg:flex flex-col items-center gap-2.5 shrink-0">
              <img
                src={QR_SRC}
                alt=""
                width={150}
                height={150}
                loading="lazy"
                className="h-[150px] w-[150px] rounded-2xl bg-white p-2.5 shadow-xl"
              />
              <span className="text-snow/60 text-[11px] text-center max-w-[150px] leading-snug">
                {c.scan}
              </span>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={APP_URL}
              onClick={() => track('hero')}
              className="inline-flex items-center gap-2 rounded-full bg-vibe-pink px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-vibe-pink/30 transition-transform active:scale-[0.98] hover:bg-pink-500"
            >
              {c.cta}
              <ArrowRight className="h-4.5 w-4.5" />
            </a>
            <span className="text-snow/60 text-xs">{c.free}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Everywhere else: the engagement-triggered card.
   ────────────────────────────────────────────────────────────────────────── */
export function AppPromoNudge() {
  const location = useLocation();
  const c = copyFor(localeFromPath(location.pathname));
  const [show, setShow] = useState(false);

  // The front page already carries the fixed hero. Asking twice on one screen
  // reads as pestering and makes the hero look like it failed.
  const onFrontPage = isFrontPage(location.pathname);

  useEffect(() => {
    if (onFrontPage) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // private mode: never nag rather than nag on every page
    }

    let done = false;
    let retry = 0;

    // 🔴 Never two asks at once. The newsletter popup is a real modal
    // (role="dialog" aria-modal) that fires at 60 s / 60 % scroll, and this card
    // fires earlier — so without this check a reader could get both stacked, and
    // the one they did not choose becomes the reason they leave. If a modal is
    // up when our moment arrives, we wait and try again rather than compete.
    const modalUp = () => Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));

    const fire = () => {
      if (done) return;
      if (modalUp()) {
        if (retry++ > 20) return cleanup(); // ~2 min of company: give this visit up
        window.setTimeout(fire, 6_000);
        return;
      }
      done = true;
      setShow(true);
      cleanup();
    };

    // Half the page read, 45 s spent, or the pointer heading for the tab bar —
    // all three mean "engaged", which is the moment an ask is welcome rather
    // than an obstacle.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) fire();
    };
    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };
    const timer = window.setTimeout(fire, 45_000);

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onExit);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onExit);
    }
    return cleanup;
  }, [onFrontPage]);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* */
    }
  };

  /** Same destination and same bookkeeping wherever the button lands — the
   *  phone layout puts it on its own row, the wide one keeps it inline. */
  const openApp = () => {
    track('nudge');
    close();
  };

  if (!show) return null;

  return (
    <div
      role="complementary"
      aria-label={c.title}
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] animate-[lvSlideUp_0.35s_cubic-bezier(.22,1,.36,1)]"
    >
      <style>{`@keyframes lvSlideUp{from{transform:translateY(110%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div className="mx-auto max-w-2xl rounded-2xl border border-vibe-pink/30 bg-deep-night/95 backdrop-blur px-4 py-3.5 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.9)]">
        {/* 🔴 The button cannot share a row with the words on a phone. It is
            shrink-0 and ~190 px wide; with the 44 px icon, the close button and
            three gaps that comes to more than the ~300 px a 375 px screen has
            to give, so the text column collapsed to a sliver and set one word
            per line. Below sm the button takes a full-width row of its own, and
            the reassurance line steps aside — the button carries the offer. */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          <span className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-vibe-pink">
            <Smartphone className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-snow font-semibold text-[15px] leading-snug text-pretty">{c.title}</p>
            <p className="hidden sm:block text-snow/65 text-xs mt-0.5">{c.free}</p>
          </div>
          <a
            href={APP_URL}
            onClick={openApp}
            className="hidden sm:inline-flex shrink-0 rounded-full bg-vibe-pink px-4 py-2 text-sm font-semibold text-white active:scale-[0.98] transition-transform"
          >
            {c.cta}
          </a>
          <button
            onClick={close}
            aria-label={c.dismiss}
            className="shrink-0 rounded-full p-1.5 text-snow/50 hover:text-snow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <a
          href={APP_URL}
          onClick={openApp}
          className="mt-3 flex w-full items-center justify-center rounded-full bg-vibe-pink px-4 py-3 text-sm font-semibold text-white no-underline transition-transform active:scale-[0.98] sm:hidden"
        >
          {c.cta}
        </a>
      </div>
    </div>
  );
}
