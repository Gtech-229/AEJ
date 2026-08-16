import { z } from 'zod';

/** Form validation for a programme (mega-projet, §9). */
export const megaProjetSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  secteur_id: z.coerce.number().int().positive().optional(),
});

export type MegaProjetInput = z.infer<typeof megaProjetSchema>;
