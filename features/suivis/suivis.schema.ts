import { z } from 'zod';

/** Form/input validation for creating/editing a suivi (French messages). */
export const suiviSchema = z.object({
  projet: z.string().min(1, 'Projet est requis'),
  agent: z.string().min(1, 'Agent est requis'),
  dateVisite: z.string().min(1, 'Date de visite est requis'),
  type: z.string().min(1, 'Type est requis'),
  statut: z.enum(['realisee', 'planifiee', 'retard'], {
    message: 'Le statut est requis',
  }),
});

export type SuiviInput = z.infer<typeof suiviSchema>;
