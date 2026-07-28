import { z } from 'zod';

/** Form/input validation for creating/editing a fonction (French messages). */
export const fonctionSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().optional(),
  description: z.string().optional(),
  // Fed by a <select> whose value arrives as a string → coerce before validating.
  service_id: z.coerce
    .number({ message: 'Le service est requis' })
    .int()
    .positive('Le service est requis'),
});

export type FonctionInput = z.infer<typeof fonctionSchema>;