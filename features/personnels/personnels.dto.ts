import type { CreatePersonnelInput, UpdatePersonnelInput } from './personnels.schema';

/**
 * API contract for the personnels feature.
 * Confirmed against the Postman doc (POST/PUT /api/personnels).
 *
 * The read shape (`Personnel`) is hand-written; the write payloads reuse the
 * schema-inferred types (single source of truth) — create is the full form,
 * update is the partial edit fields plus the `id` the PUT targets.
 *
 * role_id/fonction_id are numeric references; is_active is server-managed
 * (present on read, absent from create/update payloads).
 */
export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role_id: number;
  fonction_id: number;
  /**
   * Scope FKs (nullable) — set for a point focal (organisme) or an agence agent;
   * null for national/DIRECTION staff. Confirmed on /personnel/me + create.
   * NB: entreprise scoping is NOT a personnel field — it's the entreprise space.
   */
  organisme_id?: number | null;
  agence_regionale_id?: number | null;
  /** NB: the API returns 0/1, not a boolean (confirmed on /personnel/me). */
  is_active?: number;
}

export type CreatePersonnelPayload = CreatePersonnelInput;
export type UpdatePersonnelPayload = UpdatePersonnelInput & { id: number };




