import { z } from 'zod';

export const organismeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  sigle: z.string().optional(),
  type_id: z.number({ message: 'Le type est requis' }).int().positive('Le type est requis'),
  region_id: z.number({ message: 'La région est requise' }).int().positive('La région est requise'),
});

export type OrganismeInput = z.infer<typeof organismeSchema>;