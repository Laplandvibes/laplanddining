/**
 * JobNetworkBanner, drop-in component for any LaplandVibes sister site to
 * show paid Network-tier job listings that bought a placement on it.
 *
 * Usage on a sister site (e.g. laplandskiresorts):
 *
 *   import JobNetworkBanner from "../../../shared/JobNetworkBanner";
 *   <JobNetworkBanner siteId="laplandskiresorts" />
 *
 * Behaviour:
 * - Queries Supabase `public_job_listings` for active rows where
 *   `siteId` is in the `network_sites` array.
 * - Renders nothing if no listings match (zero visual cost).
 * - When 1+ listings match, renders a compact card linking to
 *   https://laplandwork.com/jobs/<slug>-<id>.
 * - Self-contained Tailwind, fits any site's palette via accent prop.
 *
 * The component fetches at mount (no cache library needed) and is small
 * enough to drop straight into a sidebar or footer column.
 */

import { useEffect, useState } from "react";

const SUPABASE_URL = "https://oogioaxmfnqcbvjbcodh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZ2lvYXhtZm5xY2J2amJjb2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjMyNDIsImV4cCI6MjA5MDQzOTI0Mn0.eTfgsux0zV3_gPyFRUcE8M_-DuDpU2xE9gehQM9pz54";

interface Listing {
  id: string;
  job_title: string;
  company_name: string;
  location: string | null;
  is_remote: boolean;
  slug: string | null;
}

export interface JobNetworkBannerProps {
  /**
   * The sister-site identifier (lowercase, no domain). Must match the IDs
   * in the LaplandWork post-a-job picker (e.g. "laplandstays", "laplandbars").
   */
  siteId: string;
  /**
   * Maximum number of listings to render. Default 3.
   */
  maxItems?: number;
  /**
   * Compact card title. Defaults to the page language's own title (BANNER_I18N).
   */
  title?: string;
  /**
   * Optional className override for the wrapper. Use to drop into footers
   * or sidebars without breaking the host site's typography.
   */
  className?: string;
}

/** Tekstit sivun kielellä; kieli luetaan osoitteen etuliitteestä samoin kuin jaetussa Footerissa. */
const BANNER_I18N: Record<string, { aria: string; eyebrow: string; viewAll: string; title: string; remote: string; place: string; post: string }> = {"en":{"aria":"Lapland job listings","eyebrow":"Now hiring · LaplandWork","viewAll":"View all","title":"Lapland jobs hiring now","remote":"Remote (Finland)","place":"Lapland","post":"Hiring? Post a job →"},"fi":{"aria":"Työpaikkailmoituksia Lapista","eyebrow":"Nyt haetaan · LaplandWork","viewAll":"Katso kaikki","title":"Lapin avoimet työpaikat nyt","remote":"Etätyö (Suomi)","place":"Lappi","post":"Rekrytoitko? Jätä ilmoitus →"},"de":{"aria":"Stellenangebote in Lappland","eyebrow":"Aktuelle Stellen · LaplandWork","viewAll":"Alle ansehen","title":"Offene Stellen in Lappland","remote":"Remote (Finnland)","place":"Lappland","post":"Sie stellen ein? Stelle ausschreiben →"},"ja":{"aria":"ラップランドの求人","eyebrow":"募集中 · LaplandWork","viewAll":"すべて表示","title":"ラップランドの最新求人","remote":"リモート（フィンランド国内）","place":"ラップランド","post":"採用担当の方へ：求人を掲載 →"},"es":{"aria":"Ofertas de empleo en Laponia","eyebrow":"Empleos disponibles · LaplandWork","viewAll":"Ver todo","title":"Empleos disponibles en Laponia","remote":"Remoto (Finlandia)","place":"Laponia","post":"¿Busca personal? Publique una oferta →"},"pt-BR":{"aria":"Vagas de emprego na Lapônia","eyebrow":"Vagas abertas · LaplandWork","viewAll":"Ver tudo","title":"Vagas abertas na Lapônia","remote":"Remoto (Finlândia)","place":"Lapônia","post":"Está contratando? Publique uma vaga →"},"zh-CN":{"aria":"拉普兰招聘信息","eyebrow":"正在招聘 · LaplandWork","viewAll":"查看全部","title":"拉普兰最新职位","remote":"远程（芬兰）","place":"拉普兰","post":"正在招人？发布职位 →"},"ko":{"aria":"라플란드 채용 정보","eyebrow":"채용 중 · LaplandWork","viewAll":"모두 보기","title":"라플란드 최신 채용","remote":"원격 근무(핀란드)","place":"라플란드","post":"채용 중이신가요? 공고 등록 →"},"fr":{"aria":"Offres d’emploi en Laponie","eyebrow":"Recrutements en cours · LaplandWork","viewAll":"Tout voir","title":"Emplois à pourvoir en Laponie","remote":"À distance (Finlande)","place":"Laponie","post":"Vous recrutez ? Publiez une offre →"},"it":{"aria":"Offerte di lavoro in Lapponia","eyebrow":"Si assume · LaplandWork","viewAll":"Vedi tutti","title":"Lavori disponibili in Lapponia","remote":"Da remoto (Finlandia)","place":"Lapponia","post":"Cerca personale? Pubblichi un annuncio →"},"nl":{"aria":"Vacatures in Lapland","eyebrow":"Vacatures · LaplandWork","viewAll":"Bekijk alles","title":"Openstaande vacatures in Lapland","remote":"Op afstand (Finland)","place":"Lapland","post":"Personeel gezocht? Plaats een vacature →"},"sv":{"aria":"Lediga jobb i Lappland","eyebrow":"Lediga jobb · LaplandWork","viewAll":"Visa alla","title":"Lediga jobb i Lappland just nu","remote":"Distans (Finland)","place":"Lappland","post":"Rekryterar du? Lägg upp en annons →"}};

function bannerLang(): string {
  if (typeof window === 'undefined') return 'en';
  const seg = window.location.pathname.split('/')[1]?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    fi: 'fi', de: 'de', ja: 'ja', es: 'es', br: 'pt-BR', 'pt-br': 'pt-BR', pt: 'pt-BR',
    cn: 'zh-CN', 'zh-cn': 'zh-CN', zh: 'zh-CN', kr: 'ko', ko: 'ko', fr: 'fr', it: 'it', nl: 'nl', sv: 'sv',
  };
  return map[seg] ?? 'en';
}

export default function JobNetworkBanner({
  siteId,
  maxItems = 3,
  title,
  className = "",
}: JobNetworkBannerProps) {
  const [items, setItems] = useState<Listing[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      select: "id,job_title,company_name,location,is_remote,slug",
      network_sites: `cs.{${siteId}}`,
      order: "approved_at.desc.nullslast",
      limit: String(maxItems),
    });
    fetch(`${SUPABASE_URL}/rest/v1/public_job_listings?${params}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [siteId, maxItems]);

  if (!items || items.length === 0) return null;
  const tx = BANNER_I18N[bannerLang()] ?? BANNER_I18N.en;

  return (
    /* 🔴 Oma leveysraja ja pystytila OVAT komponentin sisällä, eivät kutsujassa
       (10.9.2026). Kutsuja on sivuston footer-kääre, joka renderöityy joka sivulla:
       jos kehys olisi siellä, tyhjä `py-10` jäisi jokaiselle sivulle jokaisella
       sivustolla vaikka ostettuja ilmoituksia ei ole yhtään. Tässä se syntyy vasta
       kun kortti oikeasti piirretään. */
    <section className="w-full px-5 sm:px-6 py-8">
    <aside
      className={`mx-auto w-full max-w-3xl bg-white/95 border border-slate-200 rounded-2xl p-5 shadow-sm ${className}`}
      aria-label={tx.aria}
    >
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p className="text-pink-600 uppercase tracking-[0.2em] text-[10px] font-bold">
          {tx.eyebrow}
        </p>
        <a
          href="https://laplandwork.com/jobs"
          rel="noopener"
          className="text-slate-500 hover:text-slate-800 text-[11px] underline"
        >
          {tx.viewAll}
        </a>
      </div>
      <h3 className="font-semibold text-slate-900 text-base mb-3 leading-snug">
        {title ?? tx.title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((p) => (
          <li key={p.id}>
            <a
              href={`https://laplandwork.com/jobs/${p.slug || "listing"}-${p.id}`}
              rel="noopener"
              className="block group rounded-lg p-2.5 -m-2.5 hover:bg-slate-50 transition-colors"
            >
              <p className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-pink-600">
                {p.job_title}
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                {p.company_name} · {p.is_remote ? tx.remote : p.location || tx.place}
              </p>
            </a>
          </li>
        ))}
      </ul>
      <a
        href="https://laplandwork.com/post-a-job"
        rel="noopener"
        className="mt-4 inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 text-[10px] tracking-wide uppercase font-semibold"
      >
        {tx.post}
      </a>
    </aside>
    </section>
  );
}
