import type { FormConfig } from '@/components/forms';
import type { Dispositif } from '@/features/dispositifs/dispositifs.dto';

/**
 * Field config for the create/edit guichet form. Names match the API 1:1.
 * The dispositif is a <select> fed by the dispositifs list (pass an empty
 * array while it loads).
 */
export function getGuichetFormConfig(dispositifs: Dispositif[]): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'libelle', label: 'Libellé', type: 'text', required: true, placeholder: 'ex: Guichet Abidjan Nord', colSpan: 'full' },
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: GUI_ABJ_N' },
      {
        name: 'dispositif_id',
        label: 'Dispositif',
        type: 'select',
        required: true,
        placeholder: 'Sélectionner un dispositif…',
        options: dispositifs.map((d) => ({ label: d.libelle, value: d.id })),
      },
    ],
  };
}
