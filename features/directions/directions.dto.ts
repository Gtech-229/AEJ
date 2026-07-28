/**
 * API contract for the directions feature — hand-written (independent of Zod).
 * A Direction is the top of the org hierarchy: Direction → Service → Fonction.
 * TODO(backend): confirm the exact endpoint/shape (assumed /api/directions).
 */
export interface Direction {
  id: number;
  nom: string;
  code: string | null;
  description: string | null;
}

export type CreateDirectionPayload = {
  nom: string;
  code?: string | null;
  description?: string | null;
};
export type UpdateDirectionPayload = Direction;
