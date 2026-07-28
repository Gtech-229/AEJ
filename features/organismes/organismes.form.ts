import type { FormConfig } from '@/components/forms';

// TODO: liste provisoire — à remplacer par un chargement dynamique depuis
// /api/type-organismes une fois l'intégration API réactivée (directive
// équipe : intégrations suspendues en attendant stabilisation du backend).
const TYPE_ORGANISME_OPTIONS = [
  { value: 1, label: 'Banque' },
  { value: 2, label: 'Institution de microfinance' },
  { value: 3, label: 'ONG' },
  { value: 4, label: 'Bailleur de fonds' },
];

// TODO: liste provisoire — à remplacer par un chargement dynamique depuis
// /api/regions une fois le module Géographie stabilisé côté backend.
const REGION_OPTIONS = [
  { value: 1, label: 'Abidjan' },
  { value: 2, label: 'Yamoussoukro' },
  { value: 3, label: 'Bouaké' },
];

export function getOrganismeFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: 'ex: Banque Nationale pour le Développement',
        colSpan: 'full',
      },
      { name: 'sigle', label: 'Sigle', type: 'text', placeholder: 'ex: BND' },
      {
        name: 'type_id',
        label: 'Type',
        type: 'select',
        required: true,
        options: TYPE_ORGANISME_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
        helperText: 'Liste provisoire — non connectée au backend',
      },
      {
        name: 'region_id',
        label: 'Région',
        type: 'select',
        required: true,
        options: REGION_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
        helperText: 'Liste provisoire — non connectée au backend',
      },
    ],
  };
}