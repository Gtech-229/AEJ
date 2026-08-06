import type { FormConfig } from '@/components/forms';
import { MODES_PAIEMENT } from './remboursement.constants';

export const ENREGISTRER_PAIEMENT_FORM_CONFIG: FormConfig = {
  columns: 2,
  fields: [
    { name: 'montantPaye', label: 'Montant payé (GNF)', type: 'number', required: true, colSpan: 'half' },
    { name: 'datePaiement', label: 'Date de paiement', type: 'date', required: true, colSpan: 'half' },
    {
      name: 'modePaiement',
      label: 'Mode de paiement',
      type: 'select',
      required: true,
      colSpan: 'full',
      options: MODES_PAIEMENT,
    },
  ],
};
