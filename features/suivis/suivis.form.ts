import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit suivi form. */
export function getSuiviFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'projet',
        label: 'Projet',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'agent',
        label: 'Agent',
        type: 'text',
        required: true,
      },
      {
        name: 'dateVisite',
        label: 'Date de visite',
        type: 'date',
        required: true,
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: [
        {
          "value": "Trimestrielle",
          "label": "Trimestrielle"
        },
        {
          "value": "Ponctuelle",
          "label": "Ponctuelle"
        }
      ],
        required: true,
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'realisee', label: 'Réalisée' },
        { value: 'planifiee', label: 'Planifiée' },
        { value: 'retard', label: 'En retard' },
        ],
      },
    ],
  };
}
