/**
 * API contract for "bénéficiaires prévus" — planned-beneficiary targets, set
 * per guichet and zone (localité), broken down by catégorie (ex: Jeunes
 * hommes, Jeunes femmes, PVH…). Managed as its own CRUD referential
 * (confirmed with Julien: separate entity, not a field on Guichet/Dispositif).
 *
 * ⚠️ Field names (`categorie`, `nombre_prevu`, `localite_id`) are a
 * best-guess pending backend confirmation — no ticket/Postman doc was
 * available to verify the exact shape. Adjust once the AEJ-XX ticket or the
 * Laravel routes are confirmed.
 *
 * Endpoint assumed as `/beneficiaires-prevus`, following the
 * `/type-organismes` convention (POST create, PUT /{id} update).
 */
export interface BeneficiairePrevu {
  id: number;
  guichet_id: number;
  /** Zone d'intervention — reuses the AEJ localité referential (features/localites). */
  localite_id: number;
  categorie: string;
  nombre_prevu: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateBeneficiairePrevuPayload = {
  guichet_id: number;
  localite_id: number;
  categorie: string;
  nombre_prevu: number;
};

export type UpdateBeneficiairePrevuPayload = CreateBeneficiairePrevuPayload & { id: number };
