import { z } from 'zod';

/** Form/input validation for creating/editing an indicateur (French messages). */
export const indicateurSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  type_valeur: z.string().optional(),
  unite: z.string().optional(),
  description: z.string().optional(),
});
export type IndicateurInput = z.infer<typeof indicateurSchema>;

/** Capturing a single measurement (`indicateurs_suivi`). */
export const indicateurValeurSchema = z.object({
  valeur: z.string().min(1, 'La valeur est requise'),
});
export type IndicateurValeurInput = z.infer<typeof indicateurValeurSchema>;
