import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit type d'entreprise form. Names match the API 1:1. */
export function getTypeEntrepriseFormConfig(): FormConfig {
  return {
    columns: 1,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: SARL' },
      {
        name: 'libelle',
        label: 'Libellé',
        type: 'text',
        required: true,
        placeholder: 'ex: Société à responsabilité limitée',
      },
    ],
  };
}
