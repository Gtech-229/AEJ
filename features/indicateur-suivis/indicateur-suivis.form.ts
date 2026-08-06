import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit indicateurSuivi form. */
export function getIndicateurSuiviFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'indicateur',
        label: 'Indicateur',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'periode',
        label: 'Période',
        type: 'text',
        required: true,
      },
      {
        name: 'valeur',
        label: 'Valeur',
        type: 'text',
        required: true,
      },
      {
        name: 'evolution',
        label: 'Évolution',
        type: 'text',
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'hausse', label: 'En hausse' },
        { value: 'baisse', label: 'En baisse' },
        ],
      },
    ],
  };
}
