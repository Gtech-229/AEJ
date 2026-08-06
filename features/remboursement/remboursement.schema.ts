import { z } from 'zod';

export const enregistrerPaiementSchema = z.object({
  montantPaye: z.coerce.number().positive('Le montant doit être positif'),
  datePaiement: z.string().min(1, 'Date de paiement requise'),
  modePaiement: z.enum(['especes', 'mobile_money', 'virement', 'cheque']),
});

export type EnregistrerPaiementSchema = z.infer<typeof enregistrerPaiementSchema>;
