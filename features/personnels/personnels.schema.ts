import { z } from 'zod';

/** Create form — all fields required. */
export const createPersonnelSchema = z.object({
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
});

/**
 * Edit form — same fields, all optional so a PUT can send only what changed.
 */
export const updatePersonnelSchema = createPersonnelSchema.partial();

export type CreatePersonnelInput = z.infer<typeof createPersonnelSchema>;
export type UpdatePersonnelInput = z.infer<typeof updatePersonnelSchema>;
