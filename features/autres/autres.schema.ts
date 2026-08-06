import { z } from 'zod';

/** Form/input validation for creating/editing a element (French messages). */
export const elementSchema = z.object({
  nom: z.string().min(1, 'Élément est requis'),
  type: z.string().min(1, 'Type est requis'),
  dateModification: z.string().min(1, 'Dernière modification est requis'),
  responsable: z.string().optional(),
  statut: z.enum(['termine', 'encours'], {
    message: 'Le statut est requis',
  }),
});

export type ElementInput = z.infer<typeof elementSchema>;
