import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit dispositif form. Names match the API 1:1. */
export function getDispositifFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: AGR' },
      {
        name: 'libelle',
        label: 'Libellé',
        type: 'text',
        required: true,
        placeholder: 'ex: Activités Génératrices de Revenus',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        colSpan: 'full',
      },
    ],
  };
}
