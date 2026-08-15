'use client';

import { cn } from '@/lib/utils';

// Cycles through the chart tokens (already theme/dark-mode aware) + primary,
// so avatar colors stay vibrant and on-brand without hardcoding raw hex.
const PALETTE = [
  'bg-primary/15 text-primary',
  'bg-chart-2/15 text-chart-2',
  'bg-chart-3/15 text-chart-3',
  'bg-chart-4/15 text-chart-4',
  'bg-chart-5/15 text-chart-5',
  'bg-chart-1/15 text-chart-1',
] as const;

/** Simple deterministic string hash — same name always gets the same color. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Colored initials avatar for identity-bearing table rows (people, orgs…).
 * Color is derived from `name` so the same person always renders the same
 * color across renders/pages — no extra data needed.
 */
export function AvatarInitials({ name, className }: { name: string; className?: string }) {
  const colorClass = PALETTE[hashString(name) % PALETTE.length];
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
        colorClass,
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
