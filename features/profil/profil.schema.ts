import { z } from 'zod';

/**
 * Form validation for the "Mon profil" page. Mirrors the real `User` shape
 * (features/auth/auth.dto.ts) minus server-managed fields (id, role_id,
 * fonction_id, is_active).
 */
export const profilSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.email('Adresse email invalide'),
  telephone: z.string().min(1, 'Le téléphone est requis'),
  adresse: z.string().min(1, "L'adresse est requise"),
});

export type ProfilInput = z.infer<typeof profilSchema>;