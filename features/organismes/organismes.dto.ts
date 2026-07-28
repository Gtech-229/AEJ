/**
 * Contract for the organismes (organisme_financements) feature — hand-written.
 * Basé sur le schéma de base de données fourni par l'équipe backend
 * (tables organisme_financements + type_organismes). Aucune route API
 * confirmée à ce jour — voir organismes.service.ts (SIMULATED).
 */
export interface TypeOrganisme {
  id: number;
  code: string;
  libelle: string;
}

export interface Organisme {
  id: number;
  nom: string;
  sigle: string | null;
  type_id: number;
  region_id: number;
}

export type CreateOrganismePayload = {
  nom: string;
  sigle?: string | null;
  type_id: number;
  region_id: number;
};

export type UpdateOrganismePayload = Organisme;