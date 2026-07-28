import type { FormConfig } from '@/components/forms';
import type { Direction } from '@/features/directions/directions.dto';

/**
 * Field config for the create/edit service form. Names match the API 1:1.
 * The direction is a <select> fed by the directions list (pass an empty array
 * while it loads).
 */
export function getServiceFormConfig(directions: Direction[]): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: 'ex: Service Développement applicatif',
        colSpan: 'full',
      },
      { name: 'code', label: 'Code', type: 'text', placeholder: 'ex: SDA' },
      {
        name: 'direction_id',
        label: 'Direction',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner une direction…',
        options: directions.map((d) => ({ label: d.nom, value: d.id })),
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
