/**
 * API contract for the organismes (financeurs) feature — `organisme_financements`.
 * Endpoint: /api/organismes (POST create, PUT /{id} update).
 *
 * `type` is a FK to `type_organismes`. Required create fields (per backend):
 * nom, sigle, type, adresse, telephone, email, site_web, description.
 */
export interface Organisme {
  id: number;
  nom: string;
  sigle: string;
  type: number;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  site_web: string | null;
  description: string | null;
  /** Present on read (schema); not part of the confirmed create payload. */
  region_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateOrganismePayload = {
  nom: string;
  sigle: string;
  type: number;
  adresse?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  description?: string;
};

export type UpdateOrganismePayload = CreateOrganismePayload & { id: number };
