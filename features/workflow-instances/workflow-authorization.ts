import type { User } from '@/features/auth/auth.dto';
import type { Projet } from '@/features/projects/projects.dto';

/**
 * The outcome of gating a step action for a given user:
 *  - `allowed`      — the user may act on the current étape.
 *  - `denied`       — resolvable, and the answer is no (wrong role / wrong agence).
 *  - `unavailable`  — cannot be resolved yet because the account is missing data
 *                     (`/me` has no role, or an agence-scoped user with no agence).
 *                     UI shows the reason and keeps the action disabled — never a
 *                     false "allowed".
 */
export type StepActionGate =
  | { state: 'allowed' }
  | { state: 'denied'; reason: string }
  | { state: 'unavailable'; reason: string };

/**
 * Roles whose authority is scoped to a **regional agence** — the dossier's agence
 * must match the user's. Every other role is **national** (acts across agences).
 *
 * The backend unified `workflow_roles` into `roles`, so `role.code` is now the
 * single source both for RBAC and for `workflow_etapes_roles`. Scope isn't a
 * server field yet, so this list is the frontend guard: currently only `CIP`
 * (Conseiller Insertion Professionnelle) and `CAR` are agence-linked.
 */
export const AGENCE_SCOPED_ROLE_CODES = ['CIP', 'CAR'] as const;

export function isAgenceScopedRole(code: string | null | undefined): boolean {
  return !!code && (AGENCE_SCOPED_ROLE_CODES as readonly string[]).includes(code);
}

/**
 * May `user` act on the instance's current step? The rule (Option 1):
 *
 *   user.role.code ∈ étape.role_code(s)
 *   AND (role is agence-scoped ⇒ user.agence_regionale_id === projet.agence_id)
 *
 * `role.code` comes straight off `/me` (unified role table). Agence scoping is
 * decided by `AGENCE_SCOPED_ROLE_CODES` above until the backend ships a `scope`.
 * This is the single seam — the action bar/hook never change when the rule does.
 */
export function canActOnCurrentStep(params: {
  user: User | null | undefined;
  projet: Projet;
  /** The role code(s) the current étape authorizes (from `workflow_etapes_roles`). */
  authorizedRoleCodes: string[];
}): StepActionGate {
  const { user, projet, authorizedRoleCodes } = params;

  if (!user) return { state: 'denied', reason: 'Session non authentifiée.' };

  const myRole = user.role?.code ?? null;
  if (!myRole) {
    return { state: 'unavailable', reason: "Votre rôle n'est pas disponible sur votre compte." };
  }

  if (!authorizedRoleCodes.includes(myRole)) {
    return { state: 'denied', reason: "Cette étape n'attend pas votre rôle." };
  }

  // Agence scoping — enforced only for agence-linked roles (CIP / CAR).
  if (isAgenceScopedRole(myRole)) {
    const myAgence = user.agence_regionale_id ?? null;
    if (myAgence == null) {
      return { state: 'unavailable', reason: "Votre agence n'est pas renseignée sur votre compte." };
    }
    if (projet.agence_id == null || projet.agence_id !== myAgence) {
      return { state: 'denied', reason: "Ce dossier relève d'une autre agence." };
    }
  }

  return { state: 'allowed' };
}
