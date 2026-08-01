import type { FormConfig } from '@/components/forms';
import type { Service } from '@/features/services/services.dto';

/**
 * Field config for the create/edit fonction form. Names match the API 1:1.
 * The service is a <select> fed by the services list (pass an empty array while
 * it loads).
 */
export function getFonctionFormConfig(services: Service[]): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
        placeholder: "ex: Chef d'agence régionale",
        colSpan: 'full',
      },
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: CHEF_AGR' },
      {
        name: 'service_id',
        label: 'Service',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner un service…',
        options: services.map((s) => ({ label: s.nom, value: s.id })),
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        colSpan: 'full',
      },
    ],
  };
}
