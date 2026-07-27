import type { FacetedFilterOption } from '@/components/data-table/types';
import type { CreditStatut } from './credits.types';

export const CREDIT_STATUT_LABELS: Record<CreditStatut, string> = {
    actif: 'Actif',
    solde: 'Soldé',
    retard: 'En retard',
};

export const CREDIT_STATUT_BADGE_CLASSES: Record<CreditStatut, string> = {
    actif: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    solde: 'bg-muted text-muted-foreground',
    retard: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

export const CREDIT_STATUT_FACETED_OPTIONS: FacetedFilterOption[] = (
    ['actif', 'solde', 'retard'] as CreditStatut[]
).map((value) => ({ value, label: CREDIT_STATUT_LABELS[value] }));