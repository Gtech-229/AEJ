import type { StatutWorkflow } from '../credits/credits.types';

export interface DossierWorkflow {
  creditId: string;
  code: string;
  beneficiaireNom: string;
  banque: string;
  statutWorkflow: StatutWorkflow;
  joursDansEtape: number;
}

export interface WorkflowListParams {
  statutWorkflow?: StatutWorkflow;
}

/** Payload pour faire avancer un lot de dossiers d'une étape à la suivante. */
export interface AdvanceWorkflowInput {
  creditIds: string[];
  from: StatutWorkflow;
  to: StatutWorkflow;
}
