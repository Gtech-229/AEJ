import type { FormConfig } from '@/components/forms';
import type { MegaProjet } from '@/features/mega-projets/mega-projets.dto';

/**
 * Field config for the create/edit dispositif form (§11). `projet_id` is a
 * combobox fed by the programmes (mega-projets). The prévisionnels are the
 * "emplois / bénéficiaires / micro-projets prévus".
 */
export function getDispositifFormConfig(programmes: MegaProjet[]): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: DISP-001' },
      {
        name: 'projet_id',
        label: 'Projet',
        type: 'combobox',
        required: true,
        placeholder: 'Sélectionner un projet…',
        options: programmes.map((p) => ({ label: p.titre, value: p.id })),
      },
      {
        name: 'intitule',
        label: 'Intitulé',
        type: 'text',
        required: true,
        colSpan: 'full',
        placeholder: 'ex: Dispositif de financement agricole',
      },
      { name: 'budget_alloue', label: 'Budget alloué', type: 'amount', required: true },
      { name: 'nbre_emplois_prevu', label: 'Emplois prévus', type: 'number', min: 0 },
      { name: 'nbre_beneficiaire_prevu', label: 'Bénéficiaires prévus', type: 'number', min: 0 },
      { name: 'nbre_micro_projet_prevu', label: 'Micro-projets prévus', type: 'number', min: 0 },
    ],
  };
}
