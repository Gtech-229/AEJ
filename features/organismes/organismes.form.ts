import type { FormConfig } from '@/components/forms';
import type { TypeOrganisme } from '@/features/type-organismes/type-organismes.dto';

/**
 * Field config for the create/edit organisme form. Names match the API 1:1.
 * The `type` is a <select> fed by the type-organismes list (pass [] while loading).
 */
export function getOrganismeFormConfig(types: TypeOrganisme[]): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: 'ex: Agence Jeunesse Développement',
        colSpan: 'full',
      },
      { name: 'sigle', label: 'Sigle', type: 'text', required: true, placeholder: 'ex: AJD' },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner un type…',
        options: types.map((t) => ({ label: t.libelle, value: t.id })),
      },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'contact@organisme.org' },
      { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+2250700000000' },
      { name: 'adresse', label: 'Adresse', type: 'text', colSpan: 'full' },
      { name: 'site_web', label: 'Site web', type: 'url', placeholder: 'https://…', colSpan: 'full' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, colSpan: 'full' },
    ],
  };
}
