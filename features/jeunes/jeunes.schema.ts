import { z } from 'zod';

/** Empty string allowed for optional email. */
const optionalEmail = z.union([z.literal(''), z.email('Adresse email invalide')]);
/** Optional FK id — a positive int, or undefined when the field is left blank. */
const optionalId = z.coerce.number().int().positive().optional();

/**
 * Form/input validation for creating/editing a jeune (French messages). Field
 * names match the API 1:1 so values merge straight into the payload.
 */
export const jeuneSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: optionalEmail,
  telephone: z.string().min(1, 'Le téléphone est requis'),
  // Required; the empty select value fails the enum with this message.
  sexe: z.enum(['MASCULIN', 'FEMININ'], { message: 'Le sexe est requis' }),
  datenaissance: z.string().min(1, 'La date de naissance est requise'),
  lieunaissance: z.string().optional(),
  matriculeaej: z.string().optional(),
  numerocni: z.string().optional(),
  numerocnps: z.string().optional(),
  raison_sociale: z.string().optional(),
  typepieceidentite_id: optionalId,
  secteuractivite_id: optionalId,
  soussecteuractivite_id: optionalId,
  situationmatrimoniale_id: optionalId,
  niveauetude_id: optionalId,
  agence_id: optionalId,
  nomdupere: z.string().optional(),
  nomdelamere: z.string().optional(),
});

export type JeuneInput = z.infer<typeof jeuneSchema>;
