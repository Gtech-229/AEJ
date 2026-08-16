import type { FormConfig } from '@/components/forms';
import type { WorkflowModel } from '@/features/workflows/workflow.dto';

/**
 * Field config for the create/edit guichet form. `workflow_code` is a select fed
 * by the workflow models — it's the circuit a dossier routed through this guichet
 * follows. Names match the API 1:1.
 */
export function getGuichetFormConfig(workflows: WorkflowModel[]): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: GUI-001' },
      {
        name: 'libelle',
        label: 'Libellé',
        type: 'text',
        required: true,
        placeholder: 'ex: AGR Classique',
      },
      {
        name: 'workflow_code',
        label: 'Workflow',
        type: 'select',
        placeholder: 'Aucun — sélectionner un circuit…',
        options: workflows.map((w) => ({ label: w.name, value: w.code })),
        colSpan: 'full',
      },
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
}
