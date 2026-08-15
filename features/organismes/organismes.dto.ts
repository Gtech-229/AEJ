import type { TypeOrganisme } from '@/features/type-organismes/type-organismes.dto';

/**
 * API contract for the organismes (financeurs) feature — `organisme_financements`.
 * Endpoint: /api/organismes (POST create, PUT /{id} update).
 *
 * `type` is a FK to `type_organismes`. Required create fields (per backend):
 * nom, sigle, type, adresse, telephone, email, site_web, description.
 *
 * Verified live (2026-08): the list endpoint also **embeds** the resolved
 * `type_organisme` object (and a `region`), so the type label is available on
 * the row without a second fetch.
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
  /** Embedded on read — the resolved type (preferred source for its label). */
  type_organisme?: TypeOrganisme | null;
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
