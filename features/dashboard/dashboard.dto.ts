/**
 * Agence dashboard contracts — `GET /dashboard/agences/*`. Each endpoint is
 * enveloped `{ data }`. `kpis` and `alertes` return an object; the rest return
 * arrays (some empty until the backend populates the agence breakdowns).
 */

/** `/dashboard/agences/kpis` — headline counters (accented API keys normalized). */
export interface DashboardKpis {
  nombreAgences: number;
  nombreProjets: number;
  nombrePromoteurs: number;
  montantFinance: number;
  montantDecaisse: number;
  emploisCrees: number;
}

/** `/dashboard/agences/projets-statut` — micro-projet count per statut. */
export interface DashboardProjetStatut {
  statut: string;
  count: number;
}

/** `/dashboard/agences/projets-agence` — projets per agence (shape provisional:
 *  endpoint returns `[]` until dossiers carry an agence). */
export interface DashboardProjetAgence {
  agence_id?: number;
  agence?: string;
  count?: number;
}

/** `/dashboard/agences/financement-agence` — financing per agence (provisional). */
export interface DashboardFinancementAgence {
  agence_id?: number;
  agence?: string;
  montant?: number | string;
}

/** `/dashboard/agences/classement` — agence ranking (provisional). */
export interface DashboardClassement {
  rang?: number;
  agence_id?: number;
  agence?: string;
  montant?: number | string;
  count?: number;
}

/** `/dashboard/agences/alertes` — actionable counters. */
export interface DashboardAlertes {
  dossiers_en_attente: number;
  financements_non_decaisses: number;
  projets_en_retard: number;
}
