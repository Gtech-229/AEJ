import { z } from 'zod';

/** Form/input validation for creating/editing a dossier (French messages). */
export const dossierSchema = z.object({
  nom: z.string().min(1, 'Dossier est requis'),
  etape: z.string().min(1, 'Étape actuelle est requis'),
  responsable: z.string().min(1, 'Responsable est requis'),
  depuis: z.string().optional(),
  statut: z.enum(['valide', 'attente', 'rejete'], {
    message: 'Le statut est requis',
  }),
});

export type DossierInput = z.infer<typeof dossierSchema>;
