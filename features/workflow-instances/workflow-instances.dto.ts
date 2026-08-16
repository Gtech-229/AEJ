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
  statut: WorkflowInstanceStatus;
  started_at: string | null;
  completed_at: string | null;
  /** Forward hint toward the transition target (null until resolved). */
  next_etape_code?: string | null;
  // Embeds on read.
  micro_projet?: Projet;
  current_etape?: WorkflowEtape | null;
  next_etape?: WorkflowEtape | null;
}

/**
 * `GET /workflow-instances/instances/{id}` — the instance WITH its history,
 * deliverables and comments embedded in one call (the separate list endpoints
 * are unfiltered + `/histories` is empty, so this is the source of truth).
 */
export interface WorkflowInstanceDetail extends WorkflowInstance {
  history: WorkflowInstanceHistory[];
  deliverables: WorkflowInstanceDeliverable[];
  comments: WorkflowInstanceComment[];
}

export interface WorkflowInstanceHistory {
  id: number;
  workflow_instance_id: number;
  etape_code: string;
  role_code: string | null;
  acted_by: number | null;
  acted_at: string | null;
  /** Free-text notes on the step (the detail endpoint uses `comments`). */
  comments: string | null;
  action: string | null;
  comment: string | null;
  observation: string | null;
  // Optional embeds (present on the list endpoint, absent on the detail one).
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
  observation?: string | null;
  /** The livrable definition (§8.1) — embedded only on the list endpoint. */
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

/** `POST /workflow-instances/comments`. `created_at`/`commented_by_id` are
 *  usually filled from the session + now by the hook. */
export interface CreateWorkflowInstanceCommentPayload {
  workflow_instance_id: number;
  etape_code: string;
  commented_by_id: number;
  comment: string;
  created_at?: string;
}

/** `POST /workflow-instances/deliverables`. Records a produced livrable by its
 *  stored `file_path` (metadata, not a multipart upload). NB: the create field
 *  is `observations` (plural) vs the read `observation`. */
export interface CreateWorkflowInstanceDeliverablePayload {
  workflow_instance_id: number;
  deliverable_code: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  observations?: string;
  produced_at?: string;
  produced_by_id: number;
}
