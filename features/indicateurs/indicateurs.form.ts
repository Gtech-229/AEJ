import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit indicateur form. */
export function getIndicateurFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Indicateur',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'cible',
        label: 'Cible',
        type: 'text',
        required: true,
      },
      {
        name: 'valeurActuelle',
        label: 'Valeur actuelle',
        type: 'text',
        required: true,
      },
      {
        name: 'ecart',
        label: 'Écart',
        type: 'text',
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'atteinte', label: 'Atteinte' },
        { value: 'dessous', label: 'En dessous' },
        ],
      },
    ],
  };
}
