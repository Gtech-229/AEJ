/**
 * `/dashboard/agences/*` — a global (all-agencies) reporting dashboard, not a
 * per-agency view (`kpis.nombre_agences` counts all 33 agencies).
 *
 * Shape confidence, per endpoint (verified live against dev data 2026-08):
 *  - kpis, alertes, projets-statut: CONFIRMED — real payloads seen.
 *  - projets-agence, financement-agence, classement: UNCONFIRMED — these
 *    return `{ data: [] }` in dev (no rows yet), so the item shape below is a
 *    best guess from the endpoint name and the sibling `projets-statut`
 *    shape (`{ label, count }`-style). Every field access on these three
 *    types goes through defensive fallbacks in the client (see
 *    agences-dashboard.client.tsx) so a wrong guess degrades to "no data"
 *    instead of crashing. Re-verify once the backend seeds real rows.
 */
export interface AgencesKpis {
  nombre_agences: number;
  nombre_projets: number;
  nombre_promoteurs: number;
  /** Laravel DECIMAL → JSON string (large sums lose precision as a number). */
  montant_financé: string;
  montant_décaissé: number;
  emplois_créés: number;
}

export interface AgencesAlertes {
  dossiers_en_attente: number;
  financements_non_decaisses: number;
  projets_en_retard: number;
}

export interface ProjetStatutCount {
  statut: string;
  count: number;
}

/** UNCONFIRMED shape — see file header. */
export interface ProjetAgenceCount {
  agence?: string;
  agence_id?: number | string;
  nom_agence?: string;
  libelle?: string;
  count?: number;
  nombre_projets?: number;
  total?: number;
}

/** UNCONFIRMED shape — see file header. */
export interface FinancementAgence {
  agence?: string;
  agence_id?: number | string;
  nom_agence?: string;
  libelle?: string;
  montant?: string | number;
  montant_finance?: string | number;
  total?: string | number;
}

/** UNCONFIRMED shape — see file header. */
export interface ClassementAgence {
  agence?: string;
  agence_id?: number | string;
  nom_agence?: string;
  libelle?: string;
  rang?: number;
  rank?: number;
  score?: number;
  nombre_projets?: number;
  montant?: string | number;
}
