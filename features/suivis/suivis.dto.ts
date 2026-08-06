/**
 * API contract for the suivis feature — hand-written (independent of Zod).
 */
export type StatutSuivis = 'realisee' | 'planifiee' | 'retard';

export interface Suivi {
  id: number;
  projet: string;
  agent: string;
  dateVisite: string;
  type: string;
  statut: StatutSuivis;
}

export type CreateSuiviPayload = {
  projet: string;
  agent: string;
  dateVisite: string;
  type: string;
  statut: StatutSuivis;
};
export type UpdateSuiviPayload = Suivi;
