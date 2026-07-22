/**
 * API contract for the localites feature — hand-written (independent of Zod).
 * Confirmed against the Postman doc (POST/PUT /api/localites).
 */
export interface Localite {
  id: number;
  nom: string;
  code: string | null;
  couche_cartographique: string | null;
  niveau_localite_id: number;
}

export type CreateLocalitePayload = Omit<Localite, 'id'>;
export type UpdateLocalitePayload = Localite;