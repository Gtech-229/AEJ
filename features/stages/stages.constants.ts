import type { SelectOption } from '@/components/forms';
import type { FacetedFilterOption } from '@/components/data-table/types';

export const STAGE_STATUTS = ['ouvert', 'pourvu', 'ferme'] as const;
export type StageStatut = (typeof STAGE_STATUTS)[number];

export const STAGE_STATUT_LABELS: Record<StageStatut, string> = {
    ouvert: 'Ouvert',
    pourvu: 'Pourvu',
    ferme: 'Fermé',
};

export const STAGE_STATUT_BADGE_CLASSES: Record<StageStatut, string> = {
    ouvert: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    pourvu: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    ferme: 'bg-muted text-muted-foreground',
};

export const STAGE_STATUT_OPTIONS: SelectOption[] = STAGE_STATUTS.map((value) => ({
    value,
    label: STAGE_STATUT_LABELS[value],
}));

export const STAGE_STATUT_FACETED_OPTIONS: FacetedFilterOption[] = STAGE_STATUTS.map((value) => ({
    value,
    label: STAGE_STATUT_LABELS[value],
}));