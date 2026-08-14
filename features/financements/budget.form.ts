import type { FormConfig } from '@/components/forms';
import {
  BUDGET_STATUT_LABELS,
  CONVENTION_LABELS,
  OUI_NON_LABELS,
} from './financements.constants';

const statutOptions = (Object.keys(BUDGET_STATUT_LABELS) as (keyof typeof BUDGET_STATUT_LABELS)[]).map(
  (v) => ({ value: v, label: BUDGET_STATUT_LABELS[v] }),
);
const conventionOptions = (Object.keys(CONVENTION_LABELS) as (keyof typeof CONVENTION_LABELS)[]).map(
  (v) => ({ value: v, label: CONVENTION_LABELS[v] }),
);
const acteOptions = (Object.keys(OUI_NON_LABELS) as (keyof typeof OUI_NON_LABELS)[]).map((v) => ({
  value: v,
  label: OUI_NON_LABELS[v],
}));
const deblocageOptions = [
  { value: 'OUI', label: 'Débloqué' },
  { value: 'NON', label: 'Non débloqué' },
];

/**
 * Field config for the create/edit budget form (§9.1). `micro_projet_id` is set
 * by the dossier, not here. Names match the API 1:1.
 */
export const budgetFormConfig: FormConfig = {
  columns: 2,
  fields: [
    {
      name: 'intitule',
      label: 'Intitulé',
      type: 'text',
      required: true,
      colSpan: 'full',
      placeholder: 'ex: Budget de financement',
    },
    { name: 'montant_accorde', label: 'Montant accordé', type: 'amount', required: true },
    { name: 'devise', label: 'Devise', type: 'text', required: true, placeholder: 'XOF' },
    { name: 'source', label: 'Source', type: 'text', placeholder: 'ex: AEJ / Partenaire' },
    { name: 'date_accord', label: "Date d'accord", type: 'date' },
    { name: 'statut', label: 'Statut', type: 'select', required: true, options: statutOptions },
    {
      name: 'signature_convention',
      label: 'Convention',
      type: 'select',
      required: true,
      options: conventionOptions,
    },
    { name: 'date_signature', label: 'Date de signature', type: 'date' },
    {
      name: 'reception_acte_credit',
      label: 'Acte de crédit',
      type: 'select',
      required: true,
      options: acteOptions,
    },
    { name: 'date_reception', label: 'Date de réception', type: 'date' },
    {
      name: 'deblocage',
      label: 'Déblocage',
      type: 'select',
      required: true,
      options: deblocageOptions,
    },
    { name: 'date_deblocage', label: 'Date de déblocage', type: 'date' },
    {
      name: 'observations',
      label: 'Observations',
      type: 'textarea',
      rows: 2,
      colSpan: 'full',
    },
  ],
};
