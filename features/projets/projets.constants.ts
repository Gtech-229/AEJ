import type { FacetedFilterOption } from '@/components/data-table/types';

export const PROJET_STATUTS = ['en_cours', 'termine', 'abandonne'] as const;
export type ProjetStatut = (typeof PROJET_STATUTS)[number];

export const PROJET_STATUT_LABELS: Record<ProjetStatut, string> = {
    en_cours: 'En cours',
    termine: 'Terminé',
    abandonne: 'Abandonné',
};

export const PROJET_STATUT_BADGE_CLASSES: Record<ProjetStatut, string> = {
    en_cours: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    termine: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    abandonne: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

export const PROJET_STATUT_FACETED_OPTIONS: FacetedFilterOption[] = PROJET_STATUTS.map((value) => ({
    value,
    label: PROJET_STATUT_LABELS[value],
}));