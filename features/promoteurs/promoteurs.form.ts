import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit promoteur form. */
export function getPromoteurFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom complet',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'localite',
        label: 'Localité',
        type: 'text',
        required: true,
      },
      {
        name: 'telephone',
        label: 'Téléphone',
        type: 'text',
      },
      {
        name: 'nombreProjets',
        label: 'Projets',
        type: 'number',
        required: true,
        min: 0,
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'actif', label: 'Actif' },
        { value: 'attente', label: 'En attente' },
        { value: 'inactif', label: 'Inactif' },
        ],
      },
    ],
  };
}
