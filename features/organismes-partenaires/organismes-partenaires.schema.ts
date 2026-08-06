import { z } from 'zod';

export const organismeSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis'),
  type: z.enum(['banque', 'sfd', 'fonds_garantie']),
  contact: z.string().min(2, 'Le contact est requis'),
  email: z.string().email('Adresse e-mail invalide'),
  telephone: z.string().regex(/^[0-9+ ]{8,20}$/, 'Numéro invalide'),
  statut: z.enum(['actif', 'inactif']),
});

export type OrganismeSchema = z.infer<typeof organismeSchema>;
