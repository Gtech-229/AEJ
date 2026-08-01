import { z } from 'zod';

/** Form/input validation for creating/editing a direction (French messages). */
export const directionSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  description: z.string().optional(),
});

export type DirectionInput = z.infer<typeof directionSchema>;
