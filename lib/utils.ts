import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and de-conflict Tailwind utilities.
 * Standard shadcn/ui helper — used by `components/ui/*` primitives.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Up-to-two-letter initials from a display name: "Awa Koné" → "AK", "Awa" →
 * "AW", empty → "?". Used for avatar fallbacks.
 */
export function getDisplayNameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
