import { z } from 'zod';

/**
 * Form validation for a budget (§9.1). `micro_projet_id` is injected from the
 * dossier (and is UNIQUE — one budget per dossier). `montant_accorde` is a
 * number on write; `deblocage` is the OUI/NON enum. French messages.
 */
export const budgetSchema = z.object({
  intitule: z.string().min(1, "L'intitulé est requis"),
  montant_accorde: z.coerce
    .number({ message: 'Le montant accordé est requis' })
    .positive('Le montant doit être positif'),
  devise: z.string().min(1, 'La devise est requise'),
  source: z.string().optional(),
  statut: z.enum(['EN_ATTENTE', 'APPROUVE', 'REJETE'], { message: 'Le statut est requis' }),
  signature_convention: z.enum(['NON_SIGNEE', 'SIGNEE'], { message: 'Champ requis' }),
  reception_acte_credit: z.enum(['OUI', 'NON'], { message: 'Champ requis' }),
  deblocage: z.enum(['OUI', 'NON'], { message: 'Champ requis' }),
  date_accord: z.string().optional(),
  date_signature: z.string().optional(),
  date_reception: z.string().optional(),
  date_deblocage: z.string().optional(),
  observations: z.string().optional(),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
