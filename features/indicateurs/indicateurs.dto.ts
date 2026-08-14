/**
 * API contract for the indicateurs feature (suivi-évaluation) — hand-written.
 * Endpoint: /api/indicateurs (POST, PUT /{id}). Create is a GLOBAL indicator
 * config — no micro_projet, no frequence: { nom, description, type_valeur, unite }.
 * `type_valeur` values are lowercase: "numerique" | "texte" | "pourcentage".
 */
export interface Indicateur {
  id: number;
  nom: string;
  description: string | null;
  type_valeur: string | null;
  unite: string | null;
  /** 0/1, server-managed. */
  statut?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateIndicateurPayload = {
  nom: string;
  description?: string;
  type_valeur?: string;
  unite?: string;
};

export type UpdateIndicateurPayload = CreateIndicateurPayload & { id: number };

/** A dated measurement for an indicateur (`/indicateur-suivis`). */
export interface IndicateurSuivi {
  id: number;
  indicateur_id: number;
  valeur: string;
  created_at?: string;
  updated_at?: string;
  /** Embedded on the list response. */
  indicateur?: Indicateur;
}

export type CreateIndicateurSuiviPayload = { indicateur_id: number; valeur: string };
