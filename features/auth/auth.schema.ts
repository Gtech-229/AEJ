import { z } from 'zod';

/** Sign-in form validation (French messages). */
export const loginSchema = z.object({
  email: z.email('Adresse email invalide'),
  mot_de_passe: z.string().min(1, 'Le mot de passe est requis'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** OTP form validation — exactly 6 digits. */
export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir 6 chiffres'),
});
export type OtpInput = z.infer<typeof otpSchema>;
