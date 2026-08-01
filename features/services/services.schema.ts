import { z } from 'zod';

/**
 * Form/input validation for creating/editing a service (French messages).
 * `direction_id` is fed by a <select> whose value arrives as a string, so we
 * coerce to a number before validating.
 */
export const serviceSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  description: z.string().optional(),
  direction_id: z.coerce
    .number({ message: 'La direction est requise' })
    .int()
    .positive('La direction est requise'),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
