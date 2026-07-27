import { z } from 'zod';
import { EMPLOI_STATUTS, EMPLOI_TYPES_CONTRAT } from './emplois.constants';

export const emploiSchema = z.object({
    intitule: z.string().min(3, "L'intitulé doit contenir au moins 3 caractères."),
    description: z.string().optional(),
    typeContrat: z.enum(EMPLOI_TYPES_CONTRAT, { message: 'Sélectionnez un type de contrat.' }),
    salaire: z.coerce.number().min(0).optional(),
    datePublication: z.string().min(1, 'La date de publication est requise.'),
    statut: z.enum(EMPLOI_STATUTS).default('ouvert'),
});

export type EmploiFormValues = z.infer<typeof emploiSchema>;