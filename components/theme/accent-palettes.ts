/**
 * Runtime accent palettes for the brand-color switcher (plain data — usable
 * from server or client).
 *
 * This is a Côte d'Ivoire project — the accent set is AEJ green (default) and
 * the official CI flag orange (#FF8200, per the République de Côte d'Ivoire
 * signalétique sheet). Replaces the earlier placeholder red.
 *
 * `DEFAULT_ACCENT` maps to the CSS tokens in globals.css (which carry the
 * light/dark OKLCH variants), so selecting it clears the runtime override and
 * lets the tokens drive. Non-default accents write a fixed hex to `--primary`
 * / `--ring`.
 */
export const ACCENT_PALETTES = {
  aej_green: { label: 'AEJ Vert', primary: '#1a7a3c', ring: '#1a7a3c' },
  orange_ci: { label: 'Orange CI', primary: '#FF8200', ring: '#FF8200' },
  slate: { label: 'Slate', primary: '#1e293b', ring: '#1e293b' },
} as const;

export type AccentKey = keyof typeof ACCENT_PALETTES;

export const DEFAULT_ACCENT: AccentKey = 'aej_green';
export const ACCENT_STORAGE_KEY = 'aej-accent';