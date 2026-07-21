'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccent } from './accent-provider';
import { ACCENT_PALETTES, type AccentKey } from './accent-palettes';

/**
 * Brand-accent picker: a row of color swatches. Plain markup for now (moves
 * into a shadcn dropdown/popover in a later phase).
 */
export function AccentSwitch({ className }: { className?: string }) {
  const { accent, setAccent } = useAccent();
  const entries = Object.entries(ACCENT_PALETTES) as [
    AccentKey,
    (typeof ACCENT_PALETTES)[AccentKey],
  ][];

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {entries.map(([key, palette]) => {
        const selected = key === accent;
        return (
          <button
            key={key}
            type="button"
            aria-label={`Accent ${palette.label}`}
            aria-pressed={selected}
            title={palette.label}
            onClick={() => setAccent(key)}
            className={cn(
              'inline-flex size-6 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-110',
              selected ? 'ring-ring' : 'ring-transparent',
            )}
            style={{ backgroundColor: palette.primary }}
          >
            {selected && <Check size={12} className="text-white" />}
          </button>
        );
      })}
    </div>
  );
}
