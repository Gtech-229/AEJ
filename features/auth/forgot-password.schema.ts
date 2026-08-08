import { z } from 'zod';


export const forgotPasswordSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
