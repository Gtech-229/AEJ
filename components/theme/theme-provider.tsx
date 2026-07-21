'use client';

import { ThemeProvider as NextThemes } from 'next-themes';

/**
 * Light/dark theming via next-themes. Toggles the `.dark` class on <html>
 * (`attribute="class"`), hydration-safe. Requires `suppressHydrationWarning`
 * on <html> in the root layout.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
