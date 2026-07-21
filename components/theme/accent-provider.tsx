'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  ACCENT_PALETTES,
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  type AccentKey,
} from './accent-palettes';

interface AccentContextValue {
  accent: AccentKey;
  setAccent: (key: AccentKey) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

function applyAccent(accent: AccentKey) {
  const el = document.documentElement;
  if (accent === DEFAULT_ACCENT) {
    // Let the OKLCH tokens (with their light/dark variants) drive.
    el.style.removeProperty('--primary');
    el.style.removeProperty('--ring');
    return;
  }
  const palette = ACCENT_PALETTES[accent];
  el.style.setProperty('--primary', palette.primary);
  el.style.setProperty('--ring', palette.ring);
}

/**
 * Persists the selected brand accent (localStorage) and applies it as CSS
 * variables on <html>. No zustand — plain Context per the project convention.
 * All localStorage/DOM access happens in effects (never at module top level).
 */
export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentKey>(DEFAULT_ACCENT);

  // Hydrate from storage once on mount.
  useEffect(() => {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentKey | null;
    if (saved && saved in ACCENT_PALETTES) setAccentState(saved);
  }, []);

  // Reflect the current accent into CSS variables.
  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  function setAccent(key: AccentKey) {
    setAccentState(key);
    localStorage.setItem(ACCENT_STORAGE_KEY, key);
  }

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent(): AccentContextValue {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error('useAccent must be used within an AccentProvider');
  return ctx;
}
