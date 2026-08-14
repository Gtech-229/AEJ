/**
 * API contract for "emplois prévus" — planned-job targets, set per guichet and
 * zone (localité). Managed as its own CRUD referential (confirmed with
 * Julien: separate entity, not a field on Guichet/Dispositif).
 *
 * ⚠️ Field names (`intitule_poste`, `nombre_prevu`, `localite_id`) are a
 * best-guess pending backend confirmation — no ticket/Postman doc was
 * available to verify the exact shape. Adjust once the AEJ-XX ticket or the
 * Laravel routes are confirmed.
 *
 * Endpoint assumed as `/emplois-prevus`, following the `/type-organismes`
 * convention (POST create, PUT /{id} update).
 */
export interface EmploiPrevu {
  id: number;
  guichet_id: number;
  /** Zone d'intervention — reuses the AEJ localité referential (features/localites). */
  localite_id: number;
  intitule_poste: string;
  nombre_prevu: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateEmploiPrevuPayload = {
  guichet_id: number;
  localite_id: number;
  intitule_poste: string;
  nombre_prevu: number;
};

export type UpdateEmploiPrevuPayload = CreateEmploiPrevuPayload & { id: number };
