import type { MegaProjet } from '@/features/mega-projets/mega-projets.dto';

/**
 * Zone d'intervention (§9) — a geographic area attached to a programme
 * (mega-projet). Endpoint `/zones-intervention`. Shape verified live (2026-08);
 * `departement_id` is optional (no clean referential exposed yet).
 */
export interface ZoneIntervention {
  id: number;
  projet_id: number;
  departement_id: number | null;
  adresse: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at?: string;
  updated_at?: string;
  projet?: MegaProjet | null;
  departement?: { id: number; libelle?: string } | null;
}

export type CreateZonePayload = {
  projet_id: number;
  departement_id?: number | null;
  adresse?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

export type UpdateZonePayload = CreateZonePayload & { id: number };
