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
   * Compact card title. Defaults to "Lapland jobs hiring now".
   */
  title?: string;
  /**
   * Optional className override for the wrapper. Use to drop into footers
   * or sidebars without breaking the host site's typography.
   */
  className?: string;
}

export default function JobNetworkBanner({
  siteId,
  maxItems = 3,
  title = "Lapland jobs hiring now",
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

  return (
    <aside
      className={`bg-white/95 border border-slate-200 rounded-2xl p-5 shadow-sm ${className}`}
      aria-label="Lapland job listings"
    >
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p className="text-pink-600 uppercase tracking-[0.2em] text-[10px] font-bold">
          Now hiring · LaplandWork
        </p>
        <a
          href="https://laplandwork.com/jobs"
          rel="noopener"
          className="text-slate-500 hover:text-slate-800 text-[11px] underline"
        >
          View all
        </a>
      </div>
      <h3 className="font-semibold text-slate-900 text-base mb-3 leading-snug">
        {title}
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
                {p.company_name} · {p.is_remote ? "Remote (Finland)" : p.location || "Lapland"}
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
        Hiring? Post a job →
      </a>
    </aside>
  );
}
