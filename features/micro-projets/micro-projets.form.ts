import type { FormConfig } from '@/components/forms';

const SECTEUR_OPTIONS = [
  { value: 'Agro-élevage', label: 'Agro-élevage' },
  { value: 'Agroalimentaire', label: 'Agroalimentaire' },
  { value: 'Artisanat', label: 'Artisanat' },
  { value: 'Services', label: 'Services' },
];

const STATUT_OPTIONS = [
  { value: 'instruction', label: 'En instruction' },
  { value: 'finance', label: 'Financé' },
  { value: 'rejete', label: 'Rejeté' },
  { value: 'cloture', label: 'Clôturé' },
];

/** Field config for the create/edit micro-projet form. */
export function getMicroProjetFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Intitulé du projet',
        type: 'text',
        required: true,
        placeholder: 'ex: Élevage avicole Bouaké',
        colSpan: 'full',
      },
      {
        name: 'promoteur',
        label: 'Promoteur',
        type: 'text',
        required: true,
        placeholder: 'Nom du promoteur',
      },
      {
        name: 'secteur',
        label: 'Secteur',
        type: 'select',
        options: SECTEUR_OPTIONS,
      },
      {
        name: 'montant',
        label: 'Montant (FCFA)',
        type: 'number',
        required: true,
        min: 1,
        placeholder: '2500000',
      },
      {
        name: 'dateDepot',
        label: 'Date de dépôt',
        type: 'date',
        required: true,
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        options: STATUT_OPTIONS,
        colSpan: 'full',
      },
    ],
  };
}