import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit element form. */
export function getElementFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Élément',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: [
        {
          "value": "Export",
          "label": "Export"
        },
        {
          "value": "Import",
          "label": "Import"
        },
        {
          "value": "Système",
          "label": "Système"
        }
      ],
        required: true,
      },
      {
        name: 'dateModification',
        label: 'Dernière modification',
        type: 'date',
        required: true,
      },
      {
        name: 'responsable',
        label: 'Par',
        type: 'text',
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'termine', label: 'Terminé' },
        { value: 'encours', label: 'En cours' },
        ],
      },
    ],
  };
}
