import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit fonction form. Names match the API 1:1. */
export function getFonctionFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: "ex: Chef d'agence régionale",
        colSpan: 'full',
      },
      { name: 'code', label: 'Code', type: 'text', placeholder: 'ex: CHEF_AGR' },
      {
        name: 'service_id',
        label: 'Service',
        type: 'number',
        required: true,
        min: 1,
        // TODO: remplacer par un select une fois le module Services livré (Noum).
        helperText: 'Sélecteur à venir — en attendant, saisir l\'ID du service',
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