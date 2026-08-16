import { z } from 'zod';

/**
 * The workflow **actions** (the `action` on `etape-roles`) — what a role does at
 * a step. The API stores free text, but we constrain the config UI to this known
 * set (collected across the seeded workflows). Add a code here when a new action
 * is introduced. `workflowActionSchema` is the Zod validation list.
 */
export const WORKFLOW_ACTION_CODES = [
  'AJOUT_PLAN_AFFAIRES',
  'AJOUT_PLAN_AFFAIRES_TRANSMISSION',
  'TRANSMISSION',
  'TRAITEMENT',
  'VERIFICATION',
  'IMPUTATION',
  'SAISIE_PLAN_DECAISSEMENT',
  'VALIDATION',
  'VALIDATION_MOBILE',
  'VALIDATION_FINALE',
  'CONSULTATION',
  'VISITE_SUIVI',
  'ENVOI',
] as const;

export type WorkflowActionCode = (typeof WORKFLOW_ACTION_CODES)[number];

/** De-case an action code for display: "AJOUT_PLAN_AFFAIRES" → "Ajout plan affaires". */
export const humanizeAction = (code: string) => {
  const s = code.replace(/_/g, ' ').trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Select options (value = code, label = de-cased). */
export const WORKFLOW_ACTION_OPTIONS = WORKFLOW_ACTION_CODES.map((code) => ({
  value: code,
  label: humanizeAction(code),
}));

/** Zod validation for a workflow action — the known set. */
export const workflowActionSchema = z.enum(WORKFLOW_ACTION_CODES);
