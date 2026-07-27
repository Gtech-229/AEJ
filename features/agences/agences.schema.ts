import { z } from 'zod';
import { AGENCE_STATUTS } from './agences.constants';

export const agenceSchema = z.object({
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
    ville: z.string().min(2, 'La ville est requise.'),
    adresse: z.string().optional(),
    telephone: z.string().optional(),
    responsable: z.string().min(2, 'Le responsable est requis.'),
    nbEmployes: z.coerce.number().min(0, 'Doit être positif ou nul.'),
    statut: z.enum(AGENCE_STATUTS).default('active'),
});

export type AgenceFormValues = z.infer<typeof agenceSchema>;