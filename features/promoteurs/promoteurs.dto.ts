/**
 * API contract for the promoteurs list — hand-written from the public endpoint
 * `GET /api/promoteurs` (apis.aej-ci.net), which returns a **Laravel paginator**
 * (`{ current_page, data: [...], per_page, total, last_page, ... }`). The item
 * shape is fully flat: every relation is a FK id, no nested objects.
 *
 * This screen is **read-only** (a public list) — no create/edit/delete.
 */
export interface Promoteur {
  id: number;
  profile: string | null;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string;
  /** Age bracket, e.g. "18_40". */
  tranche_age: string | null;
  datenaissance: string | null; // yyyy-MM-dd
  lieunaissance: string | null;
  matriculeaej: string | null;
  numerocni: string | null;
  numerocmu: string | null;
  numerocnps: string | null;
  raison_sociale: string | null;
  handicap: string | null;
  nomdupere: string | null;
  nomdelamere: string | null;
  // Relations as FK ids (no labels in the payload).
  sexe_id: number | null;
  personnel_id: number | null;
  lieuhabitation_id: number | null;
  agenceregionale_id: number | null;
  secteuractivite_id: number | null;
  soussecteuractivite_id: number | null;
  situationmatrimoniale_id: number | null;
  typesituationhandicap_id: number | null;
  typepieceidentite_id: number | null;
  niveauetude_id: number | null;
  paysnationalite_id: number | null;
  /** 0/1. */
  statut: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * FK dimensions the list can be filtered by. The query-param name matches the
 * promoteur field 1:1, so the backend can bind them directly.
 */
// `handicap` is the filter key for the situation-handicap id (same type as the
// other FK filters) — it maps to the `typesituationhandicap` referential. On the
// promoteur record the display field is `typesituationhandicap_id`.
export const PROMOTEUR_FK_PARAMS = [
  'sexe_id',
  'agenceregionale_id',
  'secteuractivite_id',
  'soussecteuractivite_id',
  'niveauetude_id',
  'situationmatrimoniale_id',
  'typepieceidentite_id',
  'paysnationalite_id',
  'handicap',
] as const;

export type PromoteurFkParam = (typeof PROMOTEUR_FK_PARAMS)[number];

/**
 * Project-based filters — a promoteur rarely has more than one micro-projet, so
 * filtering the list by the project's enum attributes is meaningful. Values are
 * the `micro_projets` ENUMs (see schema).
 */
export const PROMOTEUR_PROJET_PARAMS = ['projet_statut', 'projet_stade', 'projet_type'] as const;

export type PromoteurProjetParam = (typeof PROMOTEUR_PROJET_PARAMS)[number];

/** Query params for the paginated + filtered list (FK/projet filters are `string`). */
export interface PromoteurQuery
  extends Partial<Record<PromoteurFkParam | PromoteurProjetParam, string>> {
  page: number;
  perPage: number;
  /** Free-text (nom / prénom / email / matricule). */
  search?: string;
  /** '1' = actif, '0' = inactif. */
  statut?: string;
  /** e.g. "18_40". */
  tranche_age?: string;
}

/** Backend's default page size (the API returns 15 when `per_page` is omitted). */
export const DEFAULT_PER_PAGE = 10;
