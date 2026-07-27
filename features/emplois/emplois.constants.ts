import type { SelectOption } from '@/components/forms';
import type { FacetedFilterOption } from '@/components/data-table/types';

export const EMPLOI_STATUTS = ['ouvert', 'pourvu', 'ferme'] as const;
export type EmploiStatut = (typeof EMPLOI_STATUTS)[number];

export const EMPLOI_STATUT_LABELS: Record<EmploiStatut, string> = {
    ouvert: 'Ouvert',
    pourvu: 'Pourvu',
    ferme: 'Fermé',
};

export const EMPLOI_STATUT_BADGE_CLASSES: Record<EmploiStatut, string> = {
    ouvert: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    pourvu: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    ferme: 'bg-muted text-muted-foreground',
};

export const EMPLOI_TYPES_CONTRAT = ['cdi', 'cdd', 'interim'] as const;
export type EmploiTypeContrat = (typeof EMPLOI_TYPES_CONTRAT)[number];

export const EMPLOI_TYPE_CONTRAT_LABELS: Record<EmploiTypeContrat, string> = {
    cdi: 'CDI',
    cdd: 'CDD',
    interim: 'Intérim',
};

export const EMPLOI_STATUT_OPTIONS: SelectOption[] = EMPLOI_STATUTS.map((value) => ({
    value,
    label: EMPLOI_STATUT_LABELS[value],
}));

export const EMPLOI_TYPE_CONTRAT_OPTIONS: SelectOption[] = EMPLOI_TYPES_CONTRAT.map((value) => ({
    value,
    label: EMPLOI_TYPE_CONTRAT_LABELS[value],
}));

export const EMPLOI_STATUT_FACETED_OPTIONS: FacetedFilterOption[] = EMPLOI_STATUTS.map((value) => ({
    value,
    label: EMPLOI_STATUT_LABELS[value],
}));