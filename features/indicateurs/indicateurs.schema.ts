import { z } from 'zod';

/** Form/input validation for creating/editing a indicateur (French messages). */
export const indicateurSchema = z.object({
  nom: z.string().min(1, 'Indicateur est requis'),
  cible: z.string().min(1, 'Cible est requis'),
  valeurActuelle: z.string().min(1, 'Valeur actuelle est requis'),
  ecart: z.string().optional(),
  statut: z.enum(['atteinte', 'dessous'], {
    message: 'Le statut est requis',
  }),
});

export type IndicateurInput = z.infer<typeof indicateurSchema>;
