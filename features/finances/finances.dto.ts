/**
 * API contract for the finances feature — hand-written (independent of Zod).
 */
export type StatutFinances = 'effectue' | 'attente' | 'rejete';

export interface Operation {
  id: number;
  beneficiaire: string;
  montant: number;
  typeOperation: string;
  date: string;
  statut: StatutFinances;
}

export type CreateOperationPayload = {
  beneficiaire: string;
  montant: number;
  typeOperation: string;
  date: string;
  statut: StatutFinances;
};
export type UpdateOperationPayload = Operation;
