/**
 * API contract for the indicateur-suivis feature — hand-written (independent of Zod).
 */
export type StatutIndicateurSuivis = 'hausse' | 'baisse';

export interface IndicateurSuivi {
  id: number;
  indicateur: string;
  periode: string;
  valeur: string;
  evolution: string | null;
  statut: StatutIndicateurSuivis;
}

export type CreateIndicateurSuiviPayload = {
  indicateur: string;
  periode: string;
  valeur: string;
  evolution?: string | null;
  statut: StatutIndicateurSuivis;
};
export type UpdateIndicateurSuiviPayload = IndicateurSuivi;
