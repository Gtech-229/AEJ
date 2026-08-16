import type { WorkflowEtape, WorkflowModel, WorkflowVersion } from './workflow.dto';
import type {
  WorkflowEtapeInput,
  WorkflowModelInput,
  WorkflowVersionInput,
} from './workflow.schema';

export function getWorkflowModelDefaults(model?: WorkflowModel): WorkflowModelInput {
  return {
    code: model?.code ?? '',
    name: model?.name ?? '',
    description: model?.description ?? '',
    is_active: model?.is_active ?? true,
  };
}

export function getWorkflowVersionDefaults(version?: WorkflowVersion): WorkflowVersionInput {
  return {
    version: version?.version ?? '',
    code: version?.code ?? '',
    name: version?.name ?? '',
    description: version?.description ?? '',
    is_default: version?.is_default ?? false,
    is_active: version?.is_active ?? true,
  };
}

export function getWorkflowEtapeDefaults(
  etape?: WorkflowEtape,
  siblings: WorkflowEtape[] = [],
): WorkflowEtapeInput {
  const nextOrder = siblings.length ? Math.max(...siblings.map((e) => e.order)) + 1 : 1;
  return {
    code: etape?.code ?? '',
    name: etape?.name ?? '',
    order: etape?.order ?? nextOrder,
    parent_etape_code: etape?.parent_etape_code ?? '',
    impact: etape?.impact ?? '',
    description: etape?.description ?? '',
  };
}
