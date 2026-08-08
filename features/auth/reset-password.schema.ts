import { z } from 'zod';

/** Aligné sur `PasswordSetPayload` (auth.dto) : `{ uid, new_password, confirm_new_password }`. */
export const resetPasswordSchema = z
  .object({
    uid: z.string().min(1),
    token: z.string().min(1),
    new_password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
    confirm_new_password: z.string().min(1, 'La confirmation est requise.'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirm_new_password'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;