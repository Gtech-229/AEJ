/** Profils utilisateurs — espace ENTREPRISE. */
export const ENTREPRISE_ROLES = ['responsable_entreprise'] as const;

export type EntrepriseRole = (typeof ENTREPRISE_ROLES)[number];

export const ENTREPRISE_ROLE_LABELS: Record<EntrepriseRole, string> = {
    responsable_entreprise: "Responsable d'entreprise",
};