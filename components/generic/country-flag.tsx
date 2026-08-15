import { cn } from '@/lib/utils';

/**
 * A country flag as an SVG image, keyed by ISO-2 code (e.g. "CI"). Uses SVG
 * images (not emoji) so flags render on every platform — Windows has no flag
 * emoji glyphs. Renders nothing for a missing/invalid code.
 *
 * Implementation is isolated here: swapping flagcdn for a bundled library
 * (e.g. `country-flag-icons`) is a one-line change with no call-site impact.
 */
export function CountryFlag({ code, className }: { code?: string | null; className?: string }) {
  const cc = code?.trim().toLowerCase();
  if (!cc || cc.length !== 2) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${cc}.svg`}
      alt=""
      aria-hidden
      loading="lazy"
      className={cn('inline-block h-3.5 w-5 shrink-0 rounded-[2px] object-cover', className)}
    />
  );
}
