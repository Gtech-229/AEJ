import { z } from 'zod';

/** Form/input validation for creating/editing a user (French messages). */
export const userSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.email('Adresse email invalide'),
  telephone: z.string(),
  role: z.enum(['admin', 'gestionnaire', 'consultant'], { message: 'Rôle requis' }),
  statut: z.enum(['actif', 'inactif'], { message: 'Statut requis' }),
});

export type UserInput = z.infer<typeof userSchema>;
