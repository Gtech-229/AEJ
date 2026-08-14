/**
 * API contracts for the workflow configuration module (`/workflow/*`).
 * Verified live (2026-08). NB: relationships link by **`code` strings**, not
 * numeric ids — every FK is a `*_code`.
 */

// ── models ─────────────────────────────────────────────────────────────────
export interface WorkflowModel {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  /** Embedded on the list response. */
  versions?: WorkflowVersion[];
  created_at?: string;
  updated_at?: string;
}
export type CreateWorkflowModelPayload = {
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
};
export type UpdateWorkflowModelPayload = CreateWorkflowModelPayload & { id: number };

// ── versions ───────────────────────────────────────────────────────────────
export interface WorkflowVersion {
  id: number;
  workflow_code: string;
  version: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}
export type CreateWorkflowVersionPayload = {
  workflow_code: string;
  version: string;
  name: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
};
export type UpdateWorkflowVersionPayload = CreateWorkflowVersionPayload & { id: number };

// ── roles (referential) ──────────────────────────────────────────────────────
export interface WorkflowRole {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
}
export type CreateWorkflowRolePayload = {
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
};
export type UpdateWorkflowRolePayload = CreateWorkflowRolePayload & { id: number };

// ── deliverables (referential) ───────────────────────────────────────────────
export interface WorkflowDeliverable {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
}
export type CreateWorkflowDeliverablePayload = {
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
};
export type UpdateWorkflowDeliverablePayload = CreateWorkflowDeliverablePayload & { id: number };

// ── decision outcomes (referential) ──────────────────────────────────────────
export interface WorkflowDecisionOutcome {
  id: number;
  code: string;
  label: string;
}
export type CreateWorkflowDecisionOutcomePayload = { code: string; label: string };
export type UpdateWorkflowDecisionOutcomePayload = CreateWorkflowDecisionOutcomePayload & {
  id: number;
};

// ── étapes (Phase 2) ─────────────────────────────────────────────────────────
export interface WorkflowEtape {
  id: number;
  code: string;
  name: string;
  order: number;
  /** The version this étape belongs to — embedded object on read, `code` on write. */
  workflow_version: WorkflowVersion | string;
  parent_etape_code: string | null;
  impact: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
export type CreateWorkflowEtapePayload = {
  workflow_version: string;
  code: string;
  name: string;
  order: number;
  parent_etape_code?: string;
  impact?: string;
  description?: string;
};
export type UpdateWorkflowEtapePayload = CreateWorkflowEtapePayload & { id: number };

// ── étape config joins (Phase 3) ─────────────────────────────────────────────
export interface WorkflowEtapeSla {
  id: number;
  etape_code: string;
  duration_value: number;
  duration_unit: string;
  delay_type?: string;
  description: string | null;
}
export type CreateWorkflowEtapeSlaPayload = {
  etape_code: string;
  duration_value: number;
  duration_unit: string;
  delay_type: string;
  description?: string;
};
export type UpdateWorkflowEtapeSlaPayload = CreateWorkflowEtapeSlaPayload & { id: number };

export interface WorkflowEtapeDeliverable {
  id: number;
  etape_code: string;
  deliverable_code: string | null;
  name?: string;
  is_required: boolean;
}
export type CreateWorkflowEtapeDeliverablePayload = {
  etape_code: string;
  name: string;
  deliverable_code?: string;
  is_required?: boolean;
};
export type UpdateWorkflowEtapeDeliverablePayload = CreateWorkflowEtapeDeliverablePayload & {
  id: number;
};

export interface WorkflowEtapeRole {
  id: number;
  etape_code: string;
  role_code: string;
  responsibility: string | null;
}
export type CreateWorkflowEtapeRolePayload = {
  etape_code: string;
  role_code: string;
  responsibility?: string;
};
export type UpdateWorkflowEtapeRolePayload = CreateWorkflowEtapeRolePayload & { id: number };

export interface WorkflowEtapeDecision {
  id: number;
  etape_code: string;
  code: string;
  name: string;
  description: string | null;
  /** Pipe-delimited outcome codes, e.g. "APPROUVE|REJETE". */
  outcomes: string | null;
}
export type CreateWorkflowEtapeDecisionPayload = {
  etape_code: string;
  name: string;
  code?: string;
  description?: string;
  outcomes?: string;
};
export type UpdateWorkflowEtapeDecisionPayload = CreateWorkflowEtapeDecisionPayload & { id: number };
