import { z } from 'zod';

/** Form/input validation for creating/editing a promoteur (French messages). */
export const promoteurSchema = z.object({
  nom: z.string().min(1, 'Nom complet est requis'),
  localite: z.string().min(1, 'Localité est requis'),
  telephone: z.string().optional(),
  nombreProjets: z.number({ message: 'Projets est requis' }).nonnegative('Projets doit être positif ou nul'),
  statut: z.enum(['actif', 'attente', 'inactif'], {
    message: 'Le statut est requis',
  }),
});

export type PromoteurInput = z.infer<typeof promoteurSchema>;
