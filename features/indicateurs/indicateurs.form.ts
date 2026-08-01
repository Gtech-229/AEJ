import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit indicateur form. Names match the API 1:1. */
export function getIndicateurFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: "Nom de l'indicateur",
        type: 'text',
        required: true,
        placeholder: "ex: Taux d'insertion professionnelle",
        colSpan: 'full',
      },
      {
        name: 'type_valeur',
        label: 'Type de valeur',
        type: 'select',
        placeholder: 'Sélectionner…',
        options: [
          { label: 'Numérique', value: 'numerique' },
          { label: 'Texte', value: 'texte' },
          { label: 'Pourcentage', value: 'pourcentage' },
        ],
      },
      { name: 'unite', label: 'Unité', type: 'text', placeholder: 'ex: %, FCFA, emplois' },
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
