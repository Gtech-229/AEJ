import { z } from 'zod';

/** Form/input validation for creating/editing a role (French messages). */
export const roleSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  libelle: z.string().min(1, 'Le libellé est requis'),
  description: z.string().optional(),
});
export type RoleInput = z.infer<typeof roleSchema>;
