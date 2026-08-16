import type { FormConfig } from '@/components/forms';
import type { MegaProjet } from '@/features/mega-projets/mega-projets.dto';

/** Field config for the create/edit zone form. `projet_id` = programme combobox. */
export function getZoneFormConfig(programmes: MegaProjet[]): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'projet_id',
        label: 'Projet',
        type: 'combobox',
        required: true,
        placeholder: 'Sélectionner un projet…',
        options: programmes.map((p) => ({ label: p.titre, value: p.id })),
        colSpan: 'full',
      },
      { name: 'adresse', label: 'Adresse', type: 'text', colSpan: 'full', placeholder: 'ex: Zone industrielle Nord' },
      { name: 'latitude', label: 'Latitude', type: 'number', step: 0.00000001, placeholder: 'ex: 5.345' },
      { name: 'longitude', label: 'Longitude', type: 'number', step: 0.00000001, placeholder: 'ex: -4.024' },
    ],
  };
}
