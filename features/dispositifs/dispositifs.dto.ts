/**
 * API contract for the dispositifs referential (mécanismes de financement AEJ,
 * ex: AGR, MEPS/MPE). Referenced by `dispositif_id` on `Projet`
 * (features/projects) and by `Guichet` (features/guichets) — this module is
 * the missing piece behind those FKs.
 *
 * Endpoint assumed as `/dispositifs`, following the confirmed `/type-organismes`
 * and `/fonctions` convention (POST create, PUT /{id} update). Not yet
 * verified against Postman — adjust `BASE_URL` in `dispositifs.service.ts` if
 * the backend route differs.
 */
export interface Dispositif {
  id: number;
  code: string;
  libelle: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateDispositifPayload = {
  code: string;
  libelle: string;
  description?: string | null;
};

export type UpdateDispositifPayload = CreateDispositifPayload & { id: number };
