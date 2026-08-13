import { z } from 'zod';

/** Form/input validation for a type d'entreprise (French messages). */
export const typeEntrepriseSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  libelle: z.string().min(1, 'Le libellé est requis'),
});

export type TypeEntrepriseInput = z.infer<typeof typeEntrepriseSchema>;
