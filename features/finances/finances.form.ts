import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit operation form. */
export function getOperationFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'beneficiaire',
        label: 'Bénéficiaire',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'montant',
        label: 'Montant (FCFA)',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'typeOperation',
        label: 'Opération',
        type: 'select',
        options: [
        {
          "value": "Décaissement",
          "label": "Décaissement"
        },
        {
          "value": "Remboursement",
          "label": "Remboursement"
        }
      ],
        required: true,
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'effectue', label: 'Effectué' },
        { value: 'attente', label: 'En attente' },
        { value: 'rejete', label: 'Rejeté' },
        ],
      },
    ],
  };
}
