/**
 * API contract for the fonctions feature — hand-written (independent of Zod).
 * Confirmed against the Postman doc (POST/PUT /api/fonctions).
 */
export interface Fonction {
  id: number;
  nom: string;
  code: string; // NOT NULL UNIQUE in the DB
  description: string | null;
  service_id: number;
}

export type CreateFonctionPayload = {
  nom: string;
  code: string;
  description?: string | null;
  service_id: number;
};
export type UpdateFonctionPayload = Fonction;