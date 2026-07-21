import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit user form. Names match the API 1:1. */
export function getUserFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true, placeholder: 'Koné' },
      { name: 'prenom', label: 'Prénom', type: 'text', required: true, placeholder: 'Awa' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'awa@aej.ci', colSpan: 'full' },
      { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+2250700000000' },
      {
        name: 'role',
        label: 'Rôle',
        type: 'select',
        required: true,
        options: [
          { value: 'admin', label: 'Administrateur' },
          { value: 'gestionnaire', label: 'Gestionnaire' },
          { value: 'consultant', label: 'Consultant' },
        ],
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        options: [
          { value: 'actif', label: 'Actif' },
          { value: 'inactif', label: 'Inactif' },
        ],
      },
    ],
  };
}
