import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit role form. Names match the API 1:1. */
export function getRoleFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'code',
        label: 'Code',
        type: 'text',
        required: true,
        placeholder: 'ex: ADMIN',
      },
      {
        name: 'libelle',
        label: 'Libellé',
        type: 'text',
        required: true,
        placeholder: 'ex: Administrateur',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        colSpan: 'full',
        placeholder: 'Rôle et périmètre de ce profil…',
      },
    ],
  };
}
