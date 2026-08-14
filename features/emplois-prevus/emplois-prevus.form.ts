import type { FormConfig } from '@/components/forms';
import type { Guichet } from '@/features/guichets/guichets.dto';
import type { Localite } from '@/features/localites/localites.dto';

/**
 * Field config for the create/edit emploi prévu form. Names match the API 1:1.
 * `guichet_id` and `localite_id` are <select>s fed by their respective lists
 * (pass empty arrays while they load).
 */
export function getEmploiPrevuFormConfig(guichets: Guichet[], localites: Localite[]): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'intitule_poste',
        label: 'Intitulé du poste',
        type: 'text',
        required: true,
        placeholder: 'ex: Agent de maintenance',
        colSpan: 'full',
      },
      {
        name: 'guichet_id',
        label: 'Guichet',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner un guichet…',
        options: guichets.map((g) => ({ label: g.libelle, value: g.id })),
      },
      {
        name: 'localite_id',
        label: 'Zone (localité)',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner une zone…',
        options: localites.map((l) => ({ label: l.nom, value: l.id })),
      },
      {
        name: 'nombre_prevu',
        label: "Nombre d'emplois prévus",
        type: 'number',
        required: true,
        min: 1,
        placeholder: 'ex: 50',
      },
    ],
  };
}
