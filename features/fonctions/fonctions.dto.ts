/**
 * API contract for the fonctions feature — hand-written (independent of Zod).
 * Confirmed against the Postman doc (POST/PUT /api/fonctions).
 */
export interface Fonction {
  id: number;
  nom: string;
  code: string | null;
  description: string | null;
  service_id: number;
}

export type CreateFonctionPayload = Omit<Fonction, 'id'>;
export type UpdateFonctionPayload = Fonction;