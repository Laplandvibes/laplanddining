import { UtensilsCrossed } from 'lucide-react';

/**
 * LaplandDining logo — LV canonical hashtag pattern with the site's warm
 * amber identity preserved on the brand word. Per CLAUDE.md hard rule:
 *   <span text-vibe-pink>#</span><span text-snow>LAPLAND</span><span amber>DINING</span>
 *
 * The dining-fork glyph stays as a small leading mark — keeps the food-niche
 * recognisability while the wordmark itself follows the network template.
 */
export default function Logo({
  className = '',
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <span
      className={`font-heading tracking-wide select-none inline-flex items-center gap-2 ${className}`}
    >
      {showIcon && <UtensilsCrossed size={18} className="text-amber shrink-0" />}
      <span>
        <span className="text-vibe-pink">#</span>
        <span className="text-snow">LAPLAND</span>
        <span className="text-amber">DINING</span>
      </span>
    </span>
  );
}
