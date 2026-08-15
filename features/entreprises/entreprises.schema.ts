import { z } from 'zod';

const optionalEmail = z.union([z.literal(''), z.email('Adresse email invalide')]);

/**
 * Form/input validation for an entreprise (French messages). Only
 * `raison_sociale` is required (confirmed against the live create endpoint);
 * `type_entreprise_id` comes from a <select> as a string → coerced.
 */
export const entrepriseSchema = z.object({
  raison_sociale: z.string().min(1, 'La raison sociale est requise'),
  type_entreprise_id: z.coerce
    .number({ message: "Le type d'entreprise est requis" })
    .int()
    .positive("Le type d'entreprise est requis"),
  numero: z.string().optional(),
  sigle: z.string().optional(),
  rccm: z.string().optional(),
  ninea: z.string().optional(),
  adresse: z.string().optional(),
  contact: z.string().optional(),
  email: optionalEmail,
  /** FK → /aej/communes. Optional; comes from a searchable combobox. */
  commune_id: z.coerce.number().int().positive().optional(),
});

export type EntrepriseInput = z.infer<typeof entrepriseSchema>;
