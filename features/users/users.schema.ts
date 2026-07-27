import { z } from 'zod';

/** Shared fields between create and edit forms. */
const baseUserFields = {
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.email('Adresse email invalide'),
  telephone: z.string().min(1, 'Le téléphone est requis'),
  adresse: z.string().min(1, "L'adresse est requise"),
  role_id: z.number({ message: 'Le rôle est requis' }).int().positive('Le rôle est requis'),
  fonction_id: z
    .number({ message: 'La fonction est requise' })
    .int()
    .positive('La fonction est requise'),
};

/** Create form — mot_de_passe required (min 8, matches API expectations). */
export const createUserSchema = z.object({
  ...baseUserFields,
  mot_de_passe: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

/** Edit form — no mot_de_passe field (the API's PUT payload excludes it). */
export const updateUserSchema = z.object(baseUserFields);

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;