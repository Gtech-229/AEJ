import { z } from 'zod';
import { STAGE_STATUTS } from './stages.constants';

export const stageSchema = z.object({
    intitule: z.string().min(3, "L'intitulé doit contenir au moins 3 caractères."),
    description: z.string().optional(),
    nombrePlaces: z.coerce.number().min(1, 'Au moins une place.'),
    dateDebut: z.string().min(1, 'La date de début est requise.'),
    dateFin: z.string().min(1, 'La date de fin est requise.'),
    remuneration: z.coerce.number().min(0).optional(),
    statut: z.enum(STAGE_STATUTS).default('ouvert'),
});

export type StageFormValues = z.infer<typeof stageSchema>;