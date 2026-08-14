import type { Personnel } from '@/features/personnels/personnels.dto';
import type { Projet } from '@/features/projects/projects.dto';
import type { WorkflowDeliverable, WorkflowEtape } from '@/features/workflows/workflow.dto';

/**
 * Workflow execution runtime (§8.2 / §18) — the live traçabilité of a dossier
 * through its workflow. Endpoints under `/workflow-instances/*`. Read-only here:
 * an instance links a micro-projet to a workflow version + current étape, and
 * carries a history timeline, produced deliverables, and per-étape comments.
 * Shapes verified live (2026-08).
 */
export type WorkflowInstanceStatus = 'EN_COURS' | 'TERMINE' | 'REJETE' | 'ABANDONNE';

export interface WorkflowInstance {
  id: number;
  micro_projet_id: number;
  /** The version code (e.g. "AGR_CLASSIQUE_2026"). */
  workflow_version: string;
  current_etape_code: string | null;
  status: WorkflowInstanceStatus;
  started_at: string | null;
  completed_at: string | null;
  // Embeds on read.
  micro_projet?: Projet;
  current_etape?: WorkflowEtape | null;
}

export interface WorkflowInstanceHistory {
  id: number;
  workflow_instance_id: number;
  etape_code: string;
  role_code: string | null;
  performed_by_id: number | null;
  entered_at: string | null;
  exited_at: string | null;
  comments: string | null;
  etape?: WorkflowEtape | null;
  performed_by?: Personnel | null;
}

export interface WorkflowInstanceDeliverable {
  id: number;
  workflow_instance_id: number;
  deliverable_code: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  produced_at: string | null;
  produced_by_id: number | null;
  /** The livrable definition (§8.1). */
  deliverable?: WorkflowDeliverable | null;
  produced_by?: Personnel | null;
}

export interface WorkflowInstanceComment {
  id: number;
  workflow_instance_id: number;
  etape_code: string;
  commented_by_id: number | null;
  comment: string;
  created_at: string | null;
  etape?: WorkflowEtape | null;
  commented_by?: Personnel | null;
}
