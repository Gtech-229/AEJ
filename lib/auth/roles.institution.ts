/** Profils utilisateurs — espace INSTITUTION FINANCIÈRE (microfinance / banque). */
export const INSTITUTION_ROLES = [
    'gestionnaire_microfinance',
    'gestionnaire_banque',
    'agent_credit',
] as const;

export type InstitutionRole = (typeof INSTITUTION_ROLES)[number];

export const INSTITUTION_ROLE_LABELS: Record<InstitutionRole, string> = {
    gestionnaire_microfinance: 'Gestionnaire de microfinance',
    gestionnaire_banque: 'Gestionnaire de banque',
    agent_credit: 'Agent de crédit',
};

export const INSTITUTION_TYPES = ['microfinance', 'banque'] as const;
export type InstitutionType = (typeof INSTITUTION_TYPES)[number];