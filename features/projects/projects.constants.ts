import { formatNumber, toNumber } from '@/lib/number';
import type { ProjetStade, ProjetStatut, ProjetType } from './projects.dto';

type Option<T extends string> = { value: T; label: string };

export const PROJET_STATUT_OPTIONS: Option<ProjetStatut>[] = [
  { value: 'BROUILLON', label: 'Brouillon' },
  { value: 'EN_SOUMISSION', label: 'En soumission' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'EN_ANALYSE', label: 'En analyse' },
  { value: 'EN_FORMATION', label: 'En formation' },
  { value: 'EN_FINANCEMENT', label: 'En financement' },
  { value: 'EN_DECAISSEMENT', label: 'En décaissement' },
  { value: 'EN_SUIVI', label: 'En suivi' },
  { value: 'EN_REMBOURSEMENT', label: 'En remboursement' },
  { value: 'TERMINE', label: 'Terminé' },
];

export const PROJET_STADE_OPTIONS: Option<ProjetStade>[] = [
  { value: 'CREATION', label: 'Création' },
  { value: 'DEVELOPPEMENT', label: 'Développement' },
];

export const PROJET_TYPE_OPTIONS: Option<ProjetType>[] = [
  { value: 'INDIVIDUEL', label: 'Individuel' },
  { value: 'COLLECTIF', label: 'Collectif' },
];

function toLabels<T extends string>(options: Option<T>[]): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}

export const PROJET_STATUT_LABELS = toLabels(PROJET_STATUT_OPTIONS);
export const PROJET_STADE_LABELS = toLabels(PROJET_STADE_OPTIONS);
export const PROJET_TYPE_LABELS = toLabels(PROJET_TYPE_OPTIONS);

/**
 * Per-statut badge classes (border + bg + text), tuned for light & dark. Reusable
 * everywhere a statut is rendered — pair with `projetStatutLabel()`. Colours track
 * the financing lifecycle: neutral draft → cool intake → warm financing → green done.
 */
export const PROJET_STATUT_STYLES: Record<ProjetStatut, string> = {
  BROUILLON: 'border-border bg-muted text-muted-foreground',
  EN_SOUMISSION: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  EN_COURS: 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  EN_ANALYSE: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  EN_FORMATION: 'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  EN_FINANCEMENT: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  EN_DECAISSEMENT: 'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  EN_SUIVI: 'border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300',
  EN_REMBOURSEMENT: 'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  TERMINE: 'border-success/30 bg-success/10 text-success',
};

/** Badge classes for a statut code, with a neutral fallback for unknown values. */
export function projetStatutStyle(statut: string | null | undefined): string {
  if (statut && statut in PROJET_STATUT_STYLES) {
    return PROJET_STATUT_STYLES[statut as ProjetStatut];
  }
  return 'border-border bg-muted text-muted-foreground';
}

/** Human label for a statut code, falling back to the raw code (or "—" when null). */
export function projetStatutLabel(statut: string | null | undefined): string {
  return statut ? (PROJET_STATUT_LABELS[statut] ?? statut) : '—';
}

/**
 * Format an amount with its currency, e.g. "31433885.07" → "31 433 885 FCFA".
 * `currency` defaults to FCFA — for the system-configured currency, use the
 * `useFormatMontant()` hook (features/configurations) which binds it for you.
 */
export function formatMontant(
  value: string | number | null | undefined,
  currency = 'FCFA',
): string {
  const n = toNumber(value);
  if (n === null) return '—';
  return `${formatNumber(Math.round(n))} ${currency}`;
}
