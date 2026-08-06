import type { FormConfig } from '@/components/forms';

export const ORGANISME_FORM_CONFIG: FormConfig = {
  columns: 2,
  fields: [
    { name: 'nom', label: 'Nom de l\'organisme', type: 'text', required: true, colSpan: 'half' },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      colSpan: 'half',
      options: [
        { value: 'banque', label: 'Banque' },
        { value: 'sfd', label: 'Système financier décentralisé (SFD)' },
        { value: 'fonds_garantie', label: 'Fonds de garantie' },
      ],
    },
    { name: 'contact', label: 'Personne de contact', type: 'text', required: true, colSpan: 'half' },
    { name: 'email', label: 'E-mail', type: 'email', required: true, colSpan: 'half' },
    { name: 'telephone', label: 'Téléphone', type: 'tel', required: true, colSpan: 'half' },
    {
      name: 'statut',
      label: 'Statut',
      type: 'select',
      required: true,
      colSpan: 'half',
      options: [
        { value: 'actif', label: 'Actif' },
        { value: 'inactif', label: 'Inactif' },
      ],
    },
  ],
};
