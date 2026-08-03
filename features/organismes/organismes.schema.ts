import { z } from 'zod';

const optionalEmail = z.union([z.literal(''), z.email('Adresse email invalide')]);
const optionalUrl = z.union([z.literal(''), z.url('Lien invalide')]);

/**
 * Form/input validation for an organisme financeur (French messages).
 * `type` (FK type_organismes) comes from a <select> as a string → coerced.
 */
export const organismeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  sigle: z.string().min(1, 'Le sigle est requis'),
  type: z.coerce.number({ message: 'Le type est requis' }).int().positive('Le type est requis'),
  email: optionalEmail,
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  site_web: optionalUrl,
  description: z.string().optional(),
});

export type OrganismeInput = z.infer<typeof organismeSchema>;
