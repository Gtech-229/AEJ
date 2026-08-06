import type { StatutWorkflow } from '../credits/credits.types';

export const WORKFLOW_STAGES: { id: StatutWorkflow; label: string }[] = [
  { id: 'instruction', label: 'Instruction du dossier' },
  { id: 'plan_affaires', label: "Plan d'affaires" },
  { id: 'transmission_partenaire', label: 'Transmission au partenaire' },
  { id: 'traitement_partenaire', label: 'Traitement par le partenaire' },
  { id: 'suivi_exploitation', label: 'Suivi & exploitation' },
];
