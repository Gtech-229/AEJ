/**
 * API contract for the guichets referential — a guichet (window) belongs to a
 * dispositif and is where micro-projets are received/traités. Referenced by
 * `guichet_id` on `Projet` (features/projects).
 *
 * Endpoint assumed as `/guichets`, following the `/type-organismes` and
 * `/fonctions` convention. Not yet verified against Postman.
 */
export interface Guichet {
  id: number;
  code: string;
  libelle: string;
  dispositif_id: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateGuichetPayload = {
  code: string;
  libelle: string;
  dispositif_id: number;
};

export type UpdateGuichetPayload = CreateGuichetPayload & { id: number };
