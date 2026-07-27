export const ACTEUR_TYPES = ['agence', 'institution_financiere', 'entreprise'] as const;
export type ActeurType = (typeof ACTEUR_TYPES)[number];

export const AGENCE_ROLES = [
    'admin_general',
    'directeur_general',
    'directeur_finances',
    'directeur_suivi_evaluation',
    'directeur_si',
    'comptable',
    'analyste',
    'auditeur',
] as const;

export type UserRole = (typeof AGENCE_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
    admin_general: 'Administrateur général',
    directeur_general: 'Directeur général',
    directeur_finances: 'Directeur des Finances et Partenariats',
    directeur_suivi_evaluation: 'Directeur du Suivi-Évaluation',
    directeur_si: "Directeur des Systèmes d'Information et de la Communication",
    comptable: 'Comptable',
    analyste: 'Analyste',
    auditeur: 'Auditeur',
};

/** Accès large : tout voir, tout gérer, y compris paramétrage. */
export const ADMIN_ROLES: UserRole[] = ['admin_general', 'directeur_general'];

/** Directeurs — chacun scope sur sa direction (voir dashboard.config.ts). */
export const DIRECTEUR_ROLES: UserRole[] = [
    'directeur_general',
    'directeur_finances',
    'directeur_suivi_evaluation',
    'directeur_si',
];

export function hasAnyRole(userRole: UserRole | undefined, allowed: UserRole[]): boolean {
    if (!userRole) return false;
    return allowed.includes(userRole);
}