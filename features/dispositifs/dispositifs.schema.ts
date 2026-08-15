import { z } from 'zod';

const count = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? 0 : v),
  z.coerce.number().int().min(0),
);

/**
 * Form validation for a dispositif (§11). `projet_id` targets a programme
 * (mega-projet) and is UNIQUE — one dispositif per programme. `code` required.
 */
export const dispositifSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  projet_id: z.coerce
    .number({ message: 'Le projet est requis' })
    .int()
    .positive('Le projet est requis'),
  intitule: z.string().min(1, "L'intitulé est requis"),
  budget_alloue: z.coerce
    .number({ message: 'Le budget alloué est requis' })
    .positive('Le budget doit être positif'),
  nbre_emplois_prevu: count,
  nbre_beneficiaire_prevu: count,
  nbre_micro_projet_prevu: count,
});

export type DispositifInput = z.infer<typeof dispositifSchema>;
