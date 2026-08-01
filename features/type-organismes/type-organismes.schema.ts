import { z } from 'zod';

/** Form/input validation for a type d'organisme (French messages). */
export const typeOrganismeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  libelle: z.string().min(1, 'Le libellé est requis'),
});

export type TypeOrganismeInput = z.infer<typeof typeOrganismeSchema>;
