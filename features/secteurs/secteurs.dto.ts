/**
 * AEJ activity-sector referentials — exposed READ-ONLY under `/aej/*` on the main
 * API. Verified live (2026-08): flat lists, no CRUD endpoint. Sous-secteurs are
 * returned as a flat list (no parent `secteur_id` link in the payload).
 */
export interface Secteur {
  id: number;
  libelle: string;
  nom?: string;
}

export interface SousSecteur {
  id: number;
  libelle: string;
}
