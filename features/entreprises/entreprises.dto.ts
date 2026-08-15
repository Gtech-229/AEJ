import type { TypeEntreprise } from '@/features/type-entreprises/type-entreprises.dto';

/**
 * API contract for the entreprises feature (`entreprises`).
 * Endpoint: /api/entreprises (POST create, PUT /{id} update, DELETE /{id}).
 *
 * Verified live (2026-08): list is enveloped `{ message, data: [...] }`. Only
 * `raison_sociale` is required on create; everything else is optional.
 * `type_entreprise_id` → type_entreprises; `commune_id` → /aej/communes.
 * The row embeds `type_entreprise`, `commune`, `region`, and `embauches[]`.
 */
export interface Entreprise {
  id: number;
  numero: string | null;
  raison_sociale: string;
  sigle: string | null;
  rccm: string | null;
  ninea: string | null;
  type_entreprise_id: number | null;
  adresse: string | null;
  contact: string | null;
  email: string | null;
  region_id?: number | null;
  commune_id?: number | null;
  /** Embedded on read — resolved type (preferred source for its label). */
  type_entreprise?: TypeEntreprise | null;
  /** Embedded on read — resolved commune (partial). */
  commune?: { id: number; nom: string } | null;
  /** Embedded on read — hires linked to this company. */
  embauches?: Array<{ id: number; promoteur_id: number; poste: string | null }>;
  created_at?: string;
  updated_at?: string;
}

export type CreateEntreprisePayload = {
  raison_sociale: string;
  numero?: string;
  sigle?: string;
  rccm?: string;
  ninea?: string;
  type_entreprise_id?: number;
  adresse?: string;
  contact?: string;
  email?: string;
  commune_id?: number;
};

export type UpdateEntreprisePayload = CreateEntreprisePayload & { id: number };
