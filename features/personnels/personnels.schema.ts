import { z } from 'zod';
import { DEPARTEMENTS, POSTES, SEXES, STATUTS_PERSONNEL, TYPES_CONTRAT } from './personnels.constants';

/**
 * Schéma unique — source de vérité pour la validation ET les types du
 * formulaire (`DynamicForm` s'appuie dessus via `zodResolver`).
 */
export const personnelSchema = z.object({
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
    prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
    email: z.string().email('Adresse e-mail invalide.'),
    telephone: z
        .string()
        .min(8, 'Numéro de téléphone invalide.')
        .max(20, 'Numéro de téléphone invalide.'),
    poste: z.enum(POSTES, { message: 'Sélectionnez un poste.' }),
    departement: z.enum(DEPARTEMENTS, { message: 'Sélectionnez un département.' }),
    typeContrat: z.enum(TYPES_CONTRAT, { message: 'Sélectionnez un type de contrat.' }),
    statut: z.enum(STATUTS_PERSONNEL).default('actif'),
    dateEmbauche: z.string().min(1, "La date d'embauche est requise."),
    dateNaissance: z.string().optional(),
    sexe: z.enum(SEXES).optional(),
    adresse: z.string().optional(),
    salaire: z.coerce.number().min(0, 'Le salaire doit être positif.').optional(),
    superviseurId: z.string().nullable().optional(),
    notes: z.string().optional(),
});

export type PersonnelFormValues = z.infer<typeof personnelSchema>;