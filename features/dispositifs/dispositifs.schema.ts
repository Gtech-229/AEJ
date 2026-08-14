import { z } from 'zod';

/** Form/input validation for a dispositif (French messages). */
export const dispositifSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  libelle: z.string().min(1, 'Le libellé est requis'),
  description: z.string().optional(),
});

export type DispositifInput = z.infer<typeof dispositifSchema>;
