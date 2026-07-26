import { z } from 'zod';

/** Form/input validation for creating/editing a fonction (French messages). */
export const fonctionSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().optional(),
  description: z.string().optional(),
  service_id: z
    .number({ message: 'Le service est requis' })
    .int()
    .positive('Le service est requis'),
});

export type FonctionInput = z.infer<typeof fonctionSchema>;