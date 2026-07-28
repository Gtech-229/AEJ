import { z } from 'zod';

export const passwordSchema = z
  .object({
    mot_de_passe_actuel: z.string().min(1, 'Le mot de passe actuel est requis'),
    nouveau_mot_de_passe: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmation_mot_de_passe: z.string().min(1, 'La confirmation est requise'),
  })
  .refine((data) => data.nouveau_mot_de_passe === data.confirmation_mot_de_passe, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmation_mot_de_passe'],
  });

export type PasswordInput = z.infer<typeof passwordSchema>;