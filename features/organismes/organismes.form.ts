import type { FormConfig } from '@/components/forms';

type TypeOption = {
  value: number;
  label: string;
};

/**
 * Configuration du formulaire Organismes.
 * Les types sont injectés dynamiquement depuis l'API.
 */
export function getOrganismeFormConfig(
  typeOptions: TypeOption[],
): FormConfig {
  return {
    columns: 2,

    fields: [
      {
        name: 'nom',
        label: "Nom de l'organisme",
        type: 'text',
        required: true,
        placeholder: 'Ex : Agence Emploi Jeunes',
        colSpan: 'full',
      },

      {
        name: 'sigle',
        label: 'Sigle',
        type: 'text',
        placeholder: 'Ex : AEJ',
      },

      {
        name: 'type',
        label: "Type d'organisme",
        type: 'select',
        required: true,
        options: typeOptions,
      },

      {
        name: 'telephone',
        label: 'Téléphone',
        type: 'text',
        placeholder: '+225 07 XX XX XX XX',
      },

      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'contact@organisme.org',
      },

      {
        name: 'site_web',
        label: 'Site web',
        type: 'url',
        placeholder: 'https://www.organisme.org',
        colSpan: 'full',
      },

      {
        name: 'adresse',
        label: 'Adresse',
        type: 'textarea',
        rows: 3,
        colSpan: 'full',
      },

      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 4,
        colSpan: 'full',
      },
    ],
  };
}