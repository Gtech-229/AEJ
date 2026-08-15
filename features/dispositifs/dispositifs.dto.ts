import type { MegaProjet } from '@/features/mega-projets/mega-projets.dto';

/**
 * Dispositif (§11) — the operational/budgetary declension of a programme
 * (mega-projet), 1:1 via `projet_id` (UNIQUE). Carries the allocated budget and
 * the prévisionnels (emplois / bénéficiaires / micro-projets). Endpoint
 * `/dispositifs`; `code` is required (DB UNIQUE). Shape verified live (2026-08).
 */
export interface Dispositif {
  id: number;
  code: string;
  projet_id: number;
  intitule: string;
  /** Decimal returned as a string. */
  budget_alloue: string;
  nbre_emplois_prevu: number;
  nbre_beneficiaire_prevu: number;
  nbre_micro_projet_prevu: number;
  created_at?: string;
  updated_at?: string;
  /** Embedded programme on read. */
  projet?: MegaProjet | null;
}

export type CreateDispositifPayload = {
  code: string;
  projet_id: number;
  intitule: string;
  budget_alloue: number;
  nbre_emplois_prevu?: number;
  nbre_beneficiaire_prevu?: number;
  nbre_micro_projet_prevu?: number;
};

export type UpdateDispositifPayload = CreateDispositifPayload & { id: number };
