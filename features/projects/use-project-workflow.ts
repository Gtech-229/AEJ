'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/auth.context';
import type { WorkflowEtape } from '@/features/workflows/workflow.dto';
import {
  useWorkflowEtapeRoles,
  useWorkflowEtapes,
  useWorkflowRoles,
} from '@/features/workflows/workflow.hooks';
import type { WorkflowInstance } from '@/features/workflow-instances/workflow-instances.dto';
import {
  useWorkflowInstance,
  useWorkflowInstances,
} from '@/features/workflow-instances/workflow-instances.hooks';
import {
  canActOnCurrentStep,
  type StepActionGate,
} from '@/features/workflow-instances/workflow-authorization';
import type { Projet } from './projects.dto';

const etapeVersionCode = (e: WorkflowEtape) =>
  typeof e.workflow_version === 'string' ? e.workflow_version : e.workflow_version?.code;

/**
 * Resolves a dossier's live workflow state: the active instance, its current
 * étape, the role(s) that étape expects, and — crucially — whether the current
 * user may act on it (`gate`). Shared by the sticky action bar and the
 * Progression tab so the "who acts next / can I act" answer never diverges.
 *
 * All queries here are the same keys the Progression tab uses, so TanStack Query
 * dedupes them — mounting both costs no extra network.
 */
export function useProjectWorkflow(projet: Projet) {
  const { user } = useAuth();
  const instances = useWorkflowInstances();
  const etapes = useWorkflowEtapes();
  const etapeRoles = useWorkflowEtapeRoles();
  const roles = useWorkflowRoles();

  // A dossier can carry several instances — prefer the active one (EN_COURS),
  // then the most recently started.
  const listInstance = useMemo<WorkflowInstance | undefined>(() => {
    const mine = (instances.data ?? []).filter((i) => i.micro_projet_id === projet.id);
    if (mine.length === 0) return undefined;
    const byRecent = [...mine].sort((a, b) =>
      (b.started_at ?? '').localeCompare(a.started_at ?? ''),
    );
    return byRecent.find((i) => i.statut === 'EN_COURS') ?? byRecent[0];
  }, [instances.data, projet.id]);

  // The detail endpoint carries history / deliverables / comments in one call.
  const detailQuery = useWorkflowInstance(listInstance?.id);
  const instance = detailQuery.data ?? listInstance;

  const currentEtape = useMemo(() => {
    if (!instance) return undefined;
    if (instance.current_etape) return instance.current_etape;
    return (etapes.data ?? []).find(
      (e) =>
        etapeVersionCode(e) === instance.workflow_version &&
        e.code === instance.current_etape_code,
    );
  }, [instance, etapes.data]);

  // Role code(s) the current étape authorizes (§8.1 etape-roles config).
  const responsibleRoleCodes = useMemo(() => {
    if (!instance?.current_etape_code) return [];
    return (etapeRoles.data ?? [])
      .filter((r) => r.etape_code === instance.current_etape_code)
      .map((r) => r.role_code);
  }, [etapeRoles.data, instance?.current_etape_code]);

  const responsibleRoleLabels = useMemo(
    () =>
      responsibleRoleCodes.map(
        (code) => roles.data?.find((r) => r.code === code)?.name ?? code,
      ),
    [responsibleRoleCodes, roles.data],
  );

  // Gating only makes sense for a live (EN_COURS) step.
  const gate: StepActionGate | null = useMemo(() => {
    if (!instance || instance.statut !== 'EN_COURS') return null;
    return canActOnCurrentStep({
      user,
      projet,
      authorizedRoleCodes: responsibleRoleCodes,
    });
  }, [instance, user, projet, responsibleRoleCodes]);

  return {
    isLoading: instances.isLoading,
    instance,
    detail: detailQuery.data,
    status: instance?.statut,
    currentEtape,
    responsibleRoleCodes,
    responsibleRoleLabels,
    gate,
  };
}
