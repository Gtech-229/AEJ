import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit guichet form. Names match the API 1:1. */
export const guichetFormConfig: FormConfig = {
  columns: 2,
  fields: [
    { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: GUICH-001' },
    { name: 'libelle', label: 'Libellé', type: 'text', required: true, placeholder: 'ex: Guichet AGR Classique' },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 2,
      colSpan: 'full',
    },
    { name: 'montant_min', label: 'Montant min', type: 'amount' },
    { name: 'montant_max', label: 'Montant max', type: 'amount' },
    { name: 'couleur', label: 'Couleur', type: 'color' },
    { name: 'is_active', label: 'Actif', type: 'switch' },
    { name: 'is_form_active', label: 'Formulaire actif', type: 'switch' },
  ],
};
