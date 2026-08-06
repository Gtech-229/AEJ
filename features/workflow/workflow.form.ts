import type { FormConfig } from '@/components/forms';

/** Field config for the create/edit dossier form. */
export function getDossierFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Dossier',
        type: 'text',
        required: true,
        colSpan: 'full',
      },
      {
        name: 'etape',
        label: 'Étape actuelle',
        type: 'text',
        required: true,
      },
      {
        name: 'responsable',
        label: 'Responsable',
        type: 'text',
        required: true,
      },
      {
        name: 'depuis',
        label: 'Depuis',
        type: 'text',
      },
      {
        name: 'statut',
        label: 'Statut',
        type: 'select',
        required: true,
        colSpan: 'full',
        options: [
        { value: 'valide', label: 'Validé' },
        { value: 'attente', label: 'En attente' },
        { value: 'rejete', label: 'Rejeté' },
        ],
      },
    ],
  };
}
