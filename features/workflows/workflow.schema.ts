import { z } from 'zod';

/** Create/edit a workflow model. */
export const workflowModelSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});
export type WorkflowModelInput = z.infer<typeof workflowModelSchema>;

/** Create/edit a workflow version (its `workflow_code` comes from the parent model). */
export const workflowVersionSchema = z.object({
  version: z.string().min(1, 'La version est requise'),
  name: z.string().min(1, 'Le nom est requis'),
  code: z.string().optional(),
  description: z.string().optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean().optional(),
});
export type WorkflowVersionInput = z.infer<typeof workflowVersionSchema>;

/** Create/edit an étape (its `workflow_version` comes from the parent version). */
export const workflowEtapeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  name: z.string().min(1, 'Le nom est requis'),
  order: z.coerce.number({ message: "L'ordre est requis" }).int().min(0, "L'ordre doit être positif"),
  parent_etape_code: z.string().optional(),
  impact: z.string().optional(),
  description: z.string().optional(),
});
export type WorkflowEtapeInput = z.infer<typeof workflowEtapeSchema>;
