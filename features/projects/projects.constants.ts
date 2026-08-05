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

/** Format a decimal-string amount as FCFA, e.g. "31433885.07" → "31 433 885 FCFA". */
export function formatMontant(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return `${Math.round(n).toLocaleString('fr-FR')} FCFA`;
}
