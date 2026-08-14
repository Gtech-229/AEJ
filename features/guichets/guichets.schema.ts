import { z } from 'zod';

/** Form/input validation for a guichet (French messages). */
export const guichetSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  libelle: z.string().min(1, 'Le libellé est requis'),
  // Fed by a <select> whose value arrives as a string → coerce before validating.
  dispositif_id: z.coerce
    .number({ message: 'Le dispositif est requis' })
    .int()
    .positive('Le dispositif est requis'),
});

export type GuichetInput = z.infer<typeof guichetSchema>;
