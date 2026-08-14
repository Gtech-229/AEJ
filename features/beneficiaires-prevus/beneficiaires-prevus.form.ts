import type { FormConfig } from '@/components/forms';
import type { Guichet } from '@/features/guichets/guichets.dto';
import type { Localite } from '@/features/localites/localites.dto';

/** Common target categories — adjust to match the AEJ M&E framework once confirmed. */
export const CATEGORIE_BENEFICIAIRE_OPTIONS = [
  { label: 'Jeunes hommes', value: 'Jeunes hommes' },
  { label: 'Jeunes femmes', value: 'Jeunes femmes' },
  { label: 'Personnes vivant avec un handicap', value: 'PVH' },
];

/**
 * Field config for the create/edit bénéficiaire prévu form. Names match the
 * API 1:1. `guichet_id` and `localite_id` are <select>s fed by their
 * respective lists (pass empty arrays while they load). `categorie` is also
 * a <select> — 'combobox' isn't a rendered FieldType on this branch yet.
 */
export function getBeneficiairePrevuFormConfig(
  guichets: Guichet[],
  localites: Localite[],
): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'categorie',
        label: 'Catégorie',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner une catégorie…',
        options: CATEGORIE_BENEFICIAIRE_OPTIONS,
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
        label: 'Nombre de bénéficiaires prévus',
        type: 'number',
        required: true,
        min: 1,
        placeholder: 'ex: 200',
        colSpan: 'full',
      },
    ],
  };
}
