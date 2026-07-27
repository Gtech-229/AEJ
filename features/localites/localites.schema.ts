import { z } from 'zod';

/** Form/input validation for creating/editing a localite (French messages). */
export const localiteSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().optional(),
  couche_cartographique: z.string().optional(),
  niveau_localite_id: z
    .number({ message: 'Le niveau de localité est requis' })
    .int()
    .positive('Le niveau de localité est requis'),
});

export type LocaliteInput = z.infer<typeof localiteSchema>;