import { z } from 'zod';

/** Form/input validation for creating/editing an organisme (French messages). */
export const organismeSchema = z.object({
  nom: z.string().min(1, "Le nom de l'organisme est requis"),

  sigle: z.string().optional(),

  type: z
    .number({
      message: "Le type d'organisme est requis",
    })
    .int()
    .positive("Le type d'organisme est requis"),

  adresse: z.string().optional(),

  telephone: z.string().optional(),

  email: z
    .string()
    .email("Adresse e-mail invalide")
    .optional()
    .or(z.literal("")),

  site_web: z
    .string()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),

  description: z.string().optional(),
});

export type OrganismeInput = z.infer<typeof organismeSchema>;