import { z } from 'zod';

/** Form/input validation for creating/editing a indicateurSuivi (French messages). */
export const indicateurSuiviSchema = z.object({
  indicateur: z.string().min(1, 'Indicateur est requis'),
  periode: z.string().min(1, 'Période est requis'),
  valeur: z.string().min(1, 'Valeur est requis'),
  evolution: z.string().optional(),
  statut: z.enum(['hausse', 'baisse'], {
    message: 'Le statut est requis',
  }),
});

export type IndicateurSuiviInput = z.infer<typeof indicateurSuiviSchema>;
