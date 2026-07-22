import type { FormConfig } from '@/components/forms';

// TODO: la doc Postman ne montre qu'une seule valeur d'exemple
// ("zone_urbaine") pour couche_cartographique — liste d'options à confirmer
// avec l'équipe backend (zone_rurale ? peri_urbaine ? autre nomenclature ?).
const COUCHE_CARTOGRAPHIQUE_OPTIONS = [
  { value: 'zone_urbaine', label: 'Zone urbaine' },
  { value: 'zone_rurale', label: 'Zone rurale' },
];

/** Field config for the create/edit localite form. Names match the API 1:1. */
export function getLocaliteFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: 'ex: Abidjan',
        colSpan: 'full',
      },
      { name: 'code', label: 'Code', type: 'text', placeholder: 'ex: ABJ01' },
      {
        name: 'couche_cartographique',
        label: 'Couche cartographique',
        type: 'select',
        options: COUCHE_CARTOGRAPHIQUE_OPTIONS,
        helperText: 'Liste provisoire — à confirmer avec le backend',
      },
      {
        name: 'niveau_localite_id',
        label: 'Niveau de localité',
        type: 'number',
        required: true,
        min: 1,
        // TODO: remplacer par un select une fois le module Niveaux localités
        // livré (Sekou).
        helperText: "Sélecteur à venir — en attendant, saisir l'ID du niveau",
        colSpan: 'full',
      },
    ],
  };
}