/** Profils utilisateurs — espace ORGANISMES financeurs (banques, fonds, coopérations, ONG, État). */
export const ORGANISME_ROLES = [
    'gestionnaire_microfinance',
    'gestionnaire_banque',
    'agent_credit',
] as const;

export type OrganismeRole = (typeof ORGANISME_ROLES)[number];

export const ORGANISME_ROLE_LABELS: Record<OrganismeRole, string> = {
    gestionnaire_microfinance: 'Gestionnaire de microfinance',
    gestionnaire_banque: 'Gestionnaire de banque',
    agent_credit: 'Agent de crédit',
};

export const ORGANISME_TYPES = ['banque', 'microfinance', 'fonds', 'cooperation', 'ong', 'etat'] as const;
export type OrganismeType = (typeof ORGANISME_TYPES)[number];
