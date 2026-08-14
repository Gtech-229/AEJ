import { z } from 'zod';

/** Form/input validation for a bénéficiaire prévu (French messages). */
export const beneficiairePrevuSchema = z.object({
  categorie: z.string().min(1, 'La catégorie est requise'),
  // Fed by <select>s whose value arrives as a string → coerce before validating.
  guichet_id: z.coerce.number({ message: 'Le guichet est requis' }).int().positive('Le guichet est requis'),
  localite_id: z.coerce.number({ message: 'La zone est requise' }).int().positive('La zone est requise'),
  nombre_prevu: z.coerce
    .number({ message: 'Le nombre prévu est requis' })
    .int()
    .positive('Le nombre prévu doit être supérieur à 0'),
});

export type BeneficiairePrevuInput = z.infer<typeof beneficiairePrevuSchema>;
