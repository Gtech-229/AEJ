import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit type d'organisme form. Names match the API 1:1. */
export function getTypeOrganismeFormConfig(): FormConfig {
  return {
    columns: 1,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: BANQUE' },
      { name: 'libelle', label: 'Libellé', type: 'text', required: true, placeholder: 'ex: Banque' },
    ],
  };
}
