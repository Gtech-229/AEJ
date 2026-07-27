import type { SelectOption } from '@/components/forms';
import type { FacetedFilterOption } from '@/components/data-table/types';

export const AGENCE_STATUTS = ['active', 'fermee'] as const;
export type AgenceStatut = (typeof AGENCE_STATUTS)[number];

export const AGENCE_STATUT_LABELS: Record<AgenceStatut, string> = {
    active: 'Active',
    fermee: 'Fermée',
};

export const AGENCE_STATUT_BADGE_CLASSES: Record<AgenceStatut, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    fermee: 'bg-muted text-muted-foreground',
};

export const AGENCE_STATUT_OPTIONS: SelectOption[] = AGENCE_STATUTS.map((value) => ({
    value,
    label: AGENCE_STATUT_LABELS[value],
}));

export const AGENCE_STATUT_FACETED_OPTIONS: FacetedFilterOption[] = AGENCE_STATUTS.map((value) => ({
    value,
    label: AGENCE_STATUT_LABELS[value],
}));