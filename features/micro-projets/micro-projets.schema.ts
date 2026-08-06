import { z } from 'zod';

export const microProjetSchema = z.object({
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  promoteur: z.string().min(2, 'Le promoteur est requis'),
  secteur: z.string().min(2, 'Le secteur est requis'),
  montant: z.coerce.number().positive('Le montant doit être positif'),
  dateDepot: z.string().min(1, 'La date de dépôt est requise'),
  statut: z.enum(['instruction', 'finance', 'rejete', 'cloture']),
});

export type MicroProjetInput = z.infer<typeof microProjetSchema>;