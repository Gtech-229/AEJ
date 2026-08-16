import type { WorkflowModel } from '@/features/workflows/workflow.dto';

/**
 * Guichets (§10) — financing "windows" a micro-projet is routed through, with a
 * montant range + display color + the **workflow** (circuit) it triggers.
 * Referential CRUD (`/guichets`). Shape verified live (2026-08); `code` is
 * required (DB UNIQUE) though not always validated.
 */
export interface Guichet {
  id: number;
  code: string;
  libelle: string;
  description: string | null;
  couleur: string | null;
  /** Decimals returned as strings. */
  montant_min: string;
  montant_max: string;
  is_active: boolean;
  is_form_active: boolean;
  /** FK → workflow MODEL code (e.g. "AGR_CLASSIQUE"). */
  workflow_code: string | null;
  created_at?: string;
  updated_at?: string;
  /** Embedded workflow model on read. */
  workflow?: WorkflowModel | null;
}

export type CreateGuichetPayload = {
  code: string;
  libelle: string;
  description?: string | null;
  couleur?: string | null;
  montant_min?: number;
  montant_max?: number;
  is_active?: boolean;
  is_form_active?: boolean;
  workflow_code?: string | null;
};

export type UpdateGuichetPayload = CreateGuichetPayload & { id: number };
