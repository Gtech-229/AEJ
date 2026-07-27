'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Light/dark toggle. Plain markup for now (will be restyled onto the shadcn
 * button in Phase 2). Guards against hydration mismatch with a mounted flag.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The theme is unknown during SSR, so keep EVERY theme-dependent output
  // (icon, aria-label, onClick target) stable until mounted — otherwise the
  // server HTML and the first client render disagree and React warns about a
  // hydration mismatch.
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={
        !mounted
          ? 'Changer de thème'
          : isDark
            ? 'Passer en mode clair'
            : 'Passer en mode sombre'
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
