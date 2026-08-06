/**
 * API contract for the workflow feature — hand-written (independent of Zod).
 */
export type StatutWorkflow = 'valide' | 'attente' | 'rejete';

export interface Dossier {
  id: number;
  nom: string;
  etape: string;
  responsable: string;
  depuis: string | null;
  statut: StatutWorkflow;
}

export type CreateDossierPayload = {
  nom: string;
  etape: string;
  responsable: string;
  depuis?: string | null;
  statut: StatutWorkflow;
};
export type UpdateDossierPayload = Dossier;
