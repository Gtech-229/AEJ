/**
 * API contract for the type-organismes referential (`type_organismes`).
 * Endpoint: /api/type-organismes (POST create, PUT /{id} update).
 */
export interface TypeOrganisme {
  id: number;
  code: string;
  libelle: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateTypeOrganismePayload = {
  code: string;
  libelle: string;
};

export type UpdateTypeOrganismePayload = CreateTypeOrganismePayload & { id: number };
