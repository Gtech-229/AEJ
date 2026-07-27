import type { SelectOption } from '@/components/forms';
import type { FacetedFilterOption } from '@/components/data-table/types';

export const DEPARTEMENTS = [
    'recrutement',
    'relations_entreprises',
    'administration',
    'comptabilite',
    'direction',
    'support',
] as const;
export type Departement = (typeof DEPARTEMENTS)[number];

export const DEPARTEMENT_LABELS: Record<Departement, string> = {
    recrutement: 'Recrutement',
    relations_entreprises: 'Relations Entreprises',
    administration: 'Administration',
    comptabilite: 'Comptabilité',
    direction: 'Direction',
    support: 'Support',
};

export const POSTES = [
    'directeur',
    'manager',
    'charge_recrutement',
    'conseiller_emploi',
    'assistant_rh',
    'comptable',
    'commercial',
    'receptionniste',
] as const;
export type Poste = (typeof POSTES)[number];

export const POSTE_LABELS: Record<Poste, string> = {
    directeur: 'Directeur(trice)',
    manager: 'Manager',
    charge_recrutement: 'Chargé(e) de recrutement',
    conseiller_emploi: 'Conseiller(ère) emploi',
    assistant_rh: 'Assistant(e) RH',
    comptable: 'Comptable',
    commercial: 'Commercial(e)',
    receptionniste: 'Réceptionniste',
};

export const TYPES_CONTRAT = ['cdi', 'cdd', 'stage', 'consultant'] as const;
export type TypeContrat = (typeof TYPES_CONTRAT)[number];

export const TYPE_CONTRAT_LABELS: Record<TypeContrat, string> = {
    cdi: 'CDI',
    cdd: 'CDD',
    stage: 'Stage',
    consultant: 'Consultant',
};

export const STATUTS_PERSONNEL = ['actif', 'inactif', 'suspendu','en_conge'] as const;
export type StatutPersonnel = (typeof STATUTS_PERSONNEL)[number];

export const STATUT_LABELS: Record<StatutPersonnel, string> = {
    actif: 'Actif',
    inactif: 'Inactif',
    suspendu: 'Suspendu',
    en_conge: 'En Congé'
};

/** Classes badge par statut (indépendantes de l'accent de marque). */
export const STATUT_BADGE_CLASSES: Record<StatutPersonnel, string> = {
    actif: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    inactif: 'bg-muted text-muted-foreground',
    suspendu: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    en_conge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
};

export const SEXES = ['M', 'F'] as const;
export type Sexe = (typeof SEXES)[number];

export const SEXE_LABELS: Record<Sexe, string> = { M: 'Masculin', F: 'Féminin' };

// --- Options prêtes à l'emploi pour DynamicForm / GenericTable ---------

export const DEPARTEMENT_OPTIONS: SelectOption[] = DEPARTEMENTS.map((value) => ({
    value,
    label: DEPARTEMENT_LABELS[value],
}));

export const POSTE_OPTIONS: SelectOption[] = POSTES.map((value) => ({
    value,
    label: POSTE_LABELS[value],
}));

export const TYPE_CONTRAT_OPTIONS: SelectOption[] = TYPES_CONTRAT.map((value) => ({
    value,
    label: TYPE_CONTRAT_LABELS[value],
}));

export const STATUT_OPTIONS: SelectOption[] = STATUTS_PERSONNEL.map((value) => ({
    value,
    label: STATUT_LABELS[value],
}));

export const SEXE_OPTIONS: SelectOption[] = SEXES.map((value) => ({
    value,
    label: SEXE_LABELS[value],
}));

export const DEPARTEMENT_FACETED_OPTIONS: FacetedFilterOption[] = DEPARTEMENTS.map(
    (value) => ({ value, label: DEPARTEMENT_LABELS[value] }),
);

export const STATUT_FACETED_OPTIONS: FacetedFilterOption[] = STATUTS_PERSONNEL.map(
    (value) => ({ value, label: STATUT_LABELS[value] }),
);