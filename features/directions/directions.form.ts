import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit direction form. Names match the API 1:1. */
export function getDirectionFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: 'ex: Direction des Finances et Partenariats',
        colSpan: 'full',
      },
      { name: 'code', label: 'Code', type: 'text', placeholder: 'ex: DFP' },
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
