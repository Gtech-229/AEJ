import { z } from 'zod';

/** Form/input validation for creating/editing a operation (French messages). */
export const operationSchema = z.object({
  beneficiaire: z.string().min(1, 'Bénéficiaire est requis'),
  montant: z.number({ message: 'Montant (FCFA) est requis' }).positive('Montant (FCFA) doit être positif'),
  typeOperation: z.string().min(1, 'Opération est requis'),
  date: z.string().min(1, 'Date est requis'),
  statut: z.enum(['effectue', 'attente', 'rejete'], {
    message: 'Le statut est requis',
  }),
});

export type OperationInput = z.infer<typeof operationSchema>;
