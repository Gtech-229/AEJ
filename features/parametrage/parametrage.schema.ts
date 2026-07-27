import { z } from 'zod';

export const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, 'Le mot de passe actuel est requis.'),
        new_password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères.'),
        new_password_confirmation: z.string().min(1, 'La confirmation est requise.'),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
        message: 'Les mots de passe ne correspondent pas.',
        path: ['new_password_confirmation'],
    });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;