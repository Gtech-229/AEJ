/**
 * API contract for the type-entreprises referential (`type_entreprises`).
 * Endpoint: /api/type-entreprises (POST create, PUT /{id} update).
 * Verified live (2026-08): enveloped `{ Message, data }`, `{ id, code, libelle }`.
 */
export interface TypeEntreprise {
  id: number;
  code: string;
  libelle: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateTypeEntreprisePayload = {
  code: string;
  libelle: string;
};

export type UpdateTypeEntreprisePayload = CreateTypeEntreprisePayload & { id: number };
