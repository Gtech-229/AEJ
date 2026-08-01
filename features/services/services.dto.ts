/**
 * API contract for the services feature — hand-written (independent of Zod).
 * A Service sits under a Direction and groups Fonctions:
 * Direction → Service → Fonction.
 * TODO(backend): confirm the exact endpoint/shape (assumed /api/services).
 */
export interface Service {
  id: number;
  nom: string;
  code: string; // NOT NULL UNIQUE in the DB
  description: string | null;
  direction_id: number;
}

export type CreateServicePayload = {
  nom: string;
  code: string;
  description?: string | null;
  direction_id: number;
};
export type UpdateServicePayload = Service;
