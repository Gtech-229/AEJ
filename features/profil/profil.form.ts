import type { FormConfig } from '@/components/forms';

export function getProfilFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'prenom', label: 'Prénom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true, colSpan: 'full' },
      { name: 'telephone', label: 'Téléphone', type: 'tel', required: true },
      { name: 'adresse', label: 'Adresse', type: 'text', required: true },
    ],
  };
}