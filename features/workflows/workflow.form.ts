import type { FormConfig } from '@/components/forms';
import type { WorkflowEtape } from './workflow.dto';

/** Field config for the create/edit workflow model form. */
export function getWorkflowModelFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: AGR_CLASSIQUE' },
      { name: 'name', label: 'Nom', type: 'text', required: true, colSpan: 'full' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2, colSpan: 'full' },
      { name: 'is_active', label: 'Actif', type: 'switch' },
    ],
  };
}

/** Field config for the create/edit workflow version form. */
export function getWorkflowVersionFormConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'version', label: 'Version', type: 'text', required: true, placeholder: 'ex: 2026' },
      { name: 'code', label: 'Code', type: 'text', placeholder: 'ex: AGR_CLASSIQUE_2026' },
      { name: 'name', label: 'Nom', type: 'text', required: true, colSpan: 'full' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2, colSpan: 'full' },
      { name: 'is_default', label: 'Version par défaut', type: 'switch' },
      { name: 'is_active', label: 'Active', type: 'switch' },
    ],
  };
}

/**
 * Field config for the create/edit étape form. `parent_etape_code` is a
 * searchable combobox over the version's other étapes (excludes the one being
 * edited); leave it empty for a root étape.
 */
export function getWorkflowEtapeFormConfig(etapes: WorkflowEtape[], currentCode?: string): FormConfig {
  const parentOptions = etapes
    .filter((e) => e.code !== currentCode)
    .map((e) => ({ label: `${e.code} — ${e.name}`, value: e.code }));
  return {
    columns: 2,
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ex: AGRC_PRCO_1' },
      { name: 'order', label: 'Ordre', type: 'number', required: true, min: 0 },
      { name: 'name', label: 'Nom', type: 'text', required: true, colSpan: 'full' },
      {
        name: 'parent_etape_code',
        label: 'Étape parente',
        type: 'combobox',
        placeholder: 'Aucune (étape racine)',
        options: parentOptions,
      },
      { name: 'impact', label: 'Impact', type: 'text', placeholder: 'ex: PLAN_AFFAIRES' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2, colSpan: 'full' },
    ],
  };
}
