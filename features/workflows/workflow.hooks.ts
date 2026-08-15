'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CreateWorkflowDecisionOutcomePayload,
  CreateWorkflowDeliverablePayload,
  CreateWorkflowEtapeDecisionPayload,
  CreateWorkflowEtapeDeliverablePayload,
  CreateWorkflowEtapePayload,
  CreateWorkflowEtapeRolePayload,
  CreateWorkflowEtapeSlaPayload,
  CreateWorkflowModelPayload,
  CreateWorkflowRolePayload,
  CreateWorkflowVersionPayload,
  UpdateWorkflowDecisionOutcomePayload,
  UpdateWorkflowDeliverablePayload,
  UpdateWorkflowEtapeDecisionPayload,
  UpdateWorkflowEtapeDeliverablePayload,
  UpdateWorkflowEtapePayload,
  UpdateWorkflowEtapeRolePayload,
  UpdateWorkflowEtapeSlaPayload,
  UpdateWorkflowModelPayload,
  UpdateWorkflowRolePayload,
  UpdateWorkflowVersionPayload,
  WorkflowDecisionOutcome,
  WorkflowDeliverable,
  WorkflowEtape,
  WorkflowEtapeDecision,
  WorkflowEtapeDeliverable,
  WorkflowEtapeRole,
  WorkflowEtapeSla,
  WorkflowModel,
  WorkflowRole,
  WorkflowVersion,
} from './workflow.dto';
import { workflowKeys } from './workflow.keys';
import {
  workflowDecisionOutcomesService,
  workflowDeliverablesService,
  workflowEtapeDecisionsService,
  workflowEtapeDeliverablesService,
  workflowEtapeRolesService,
  workflowEtapeSlasService,
  workflowEtapesService,
  workflowModelsService,
  workflowRolesService,
  workflowVersionsService,
} from './workflow.service';

interface CrudService<T, C, U> {
  getAll: () => Promise<T[]>;
  create: (payload: C) => Promise<T>;
  update: (payload: U) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

/** Query + create/update/delete hooks for one workflow resource. */
function makeCrudHooks<T, C, U extends { id: number }>(
  listKey: readonly unknown[],
  service: CrudService<T, C, U>,
  labels: { created: string; updated: string; deleted: string },
) {
  const useList = () =>
    useQuery({ queryKey: listKey, queryFn: () => service.getAll(), staleTime: 5 * 60 * 1000 });

  const useCreate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: C) => service.create(payload),
      onSuccess: () => {
        toast.success(labels.created);
        qc.invalidateQueries({ queryKey: listKey });
      },
      onError: () => toast.error("Échec de l'enregistrement"),
    });
  };

  const useUpdate = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: U) => service.update(payload),
      onSuccess: () => {
        toast.success(labels.updated);
        qc.invalidateQueries({ queryKey: listKey });
      },
      onError: () => toast.error('Échec de la mise à jour'),
    });
  };

  const useDelete = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => service.remove(id),
      onSuccess: () => {
        toast.success(labels.deleted);
        qc.invalidateQueries({ queryKey: listKey });
      },
      onError: () => toast.error('Échec de la suppression'),
    });
  };

  return { useList, useCreate, useUpdate, useDelete };
}

const models = makeCrudHooks<
  WorkflowModel,
  CreateWorkflowModelPayload,
  UpdateWorkflowModelPayload
>(workflowKeys.models(), workflowModelsService, {
  created: 'Workflow créé',
  updated: 'Workflow mis à jour',
  deleted: 'Workflow supprimé',
});
export const useWorkflowModels = models.useList;
export const useCreateWorkflowModel = models.useCreate;
export const useUpdateWorkflowModel = models.useUpdate;
export const useDeleteWorkflowModel = models.useDelete;

const versions = makeCrudHooks<
  WorkflowVersion,
  CreateWorkflowVersionPayload,
  UpdateWorkflowVersionPayload
>(workflowKeys.versions(), workflowVersionsService, {
  created: 'Version créée',
  updated: 'Version mise à jour',
  deleted: 'Version supprimée',
});
export const useWorkflowVersions = versions.useList;
export const useCreateWorkflowVersion = versions.useCreate;
export const useUpdateWorkflowVersion = versions.useUpdate;
export const useDeleteWorkflowVersion = versions.useDelete;

const roles = makeCrudHooks<
  WorkflowRole,
  CreateWorkflowRolePayload,
  UpdateWorkflowRolePayload
>(workflowKeys.roles(), workflowRolesService, {
  created: 'Rôle créé',
  updated: 'Rôle mis à jour',
  deleted: 'Rôle supprimé',
});
export const useWorkflowRoles = roles.useList;
export const useCreateWorkflowRole = roles.useCreate;
export const useUpdateWorkflowRole = roles.useUpdate;
export const useDeleteWorkflowRole = roles.useDelete;

const deliverables = makeCrudHooks<
  WorkflowDeliverable,
  CreateWorkflowDeliverablePayload,
  UpdateWorkflowDeliverablePayload
>(workflowKeys.deliverables(), workflowDeliverablesService, {
  created: 'Livrable créé',
  updated: 'Livrable mis à jour',
  deleted: 'Livrable supprimé',
});
export const useWorkflowDeliverables = deliverables.useList;
export const useCreateWorkflowDeliverable = deliverables.useCreate;
export const useUpdateWorkflowDeliverable = deliverables.useUpdate;
export const useDeleteWorkflowDeliverable = deliverables.useDelete;

const decisionOutcomes = makeCrudHooks<
  WorkflowDecisionOutcome,
  CreateWorkflowDecisionOutcomePayload,
  UpdateWorkflowDecisionOutcomePayload
>(workflowKeys.decisionOutcomes(), workflowDecisionOutcomesService, {
  created: 'Issue de décision créée',
  updated: 'Issue de décision mise à jour',
  deleted: 'Issue de décision supprimée',
});
export const useWorkflowDecisionOutcomes = decisionOutcomes.useList;
export const useCreateWorkflowDecisionOutcome = decisionOutcomes.useCreate;
export const useUpdateWorkflowDecisionOutcome = decisionOutcomes.useUpdate;
export const useDeleteWorkflowDecisionOutcome = decisionOutcomes.useDelete;

const etapes = makeCrudHooks<
  WorkflowEtape,
  CreateWorkflowEtapePayload,
  UpdateWorkflowEtapePayload
>(workflowKeys.etapes(), workflowEtapesService, {
  created: 'Étape créée',
  updated: 'Étape mise à jour',
  deleted: 'Étape supprimée',
});
export const useWorkflowEtapes = etapes.useList;
export const useCreateWorkflowEtape = etapes.useCreate;
export const useUpdateWorkflowEtape = etapes.useUpdate;
export const useDeleteWorkflowEtape = etapes.useDelete;

const etapeSlas = makeCrudHooks<
  WorkflowEtapeSla,
  CreateWorkflowEtapeSlaPayload,
  UpdateWorkflowEtapeSlaPayload
>(workflowKeys.etapeSlas(), workflowEtapeSlasService, {
  created: 'Délai enregistré',
  updated: 'Délai mis à jour',
  deleted: 'Délai supprimé',
});
export const useWorkflowEtapeSlas = etapeSlas.useList;
export const useCreateWorkflowEtapeSla = etapeSlas.useCreate;
export const useUpdateWorkflowEtapeSla = etapeSlas.useUpdate;
export const useDeleteWorkflowEtapeSla = etapeSlas.useDelete;

const etapeDeliverables = makeCrudHooks<
  WorkflowEtapeDeliverable,
  CreateWorkflowEtapeDeliverablePayload,
  UpdateWorkflowEtapeDeliverablePayload
>(workflowKeys.etapeDeliverables(), workflowEtapeDeliverablesService, {
  created: 'Livrable rattaché',
  updated: 'Livrable mis à jour',
  deleted: 'Livrable détaché',
});
export const useWorkflowEtapeDeliverables = etapeDeliverables.useList;
export const useCreateWorkflowEtapeDeliverable = etapeDeliverables.useCreate;
export const useUpdateWorkflowEtapeDeliverable = etapeDeliverables.useUpdate;
export const useDeleteWorkflowEtapeDeliverable = etapeDeliverables.useDelete;

const etapeRoles = makeCrudHooks<
  WorkflowEtapeRole,
  CreateWorkflowEtapeRolePayload,
  UpdateWorkflowEtapeRolePayload
>(workflowKeys.etapeRoles(), workflowEtapeRolesService, {
  created: 'Rôle rattaché',
  updated: 'Rôle mis à jour',
  deleted: 'Rôle détaché',
});
export const useWorkflowEtapeRoles = etapeRoles.useList;
export const useCreateWorkflowEtapeRole = etapeRoles.useCreate;
export const useUpdateWorkflowEtapeRole = etapeRoles.useUpdate;
export const useDeleteWorkflowEtapeRole = etapeRoles.useDelete;

const etapeDecisions = makeCrudHooks<
  WorkflowEtapeDecision,
  CreateWorkflowEtapeDecisionPayload,
  UpdateWorkflowEtapeDecisionPayload
>(workflowKeys.etapeDecisions(), workflowEtapeDecisionsService, {
  created: 'Décision enregistrée',
  updated: 'Décision mise à jour',
  deleted: 'Décision supprimée',
});
export const useWorkflowEtapeDecisions = etapeDecisions.useList;
export const useCreateWorkflowEtapeDecision = etapeDecisions.useCreate;
export const useUpdateWorkflowEtapeDecision = etapeDecisions.useUpdate;
export const useDeleteWorkflowEtapeDecision = etapeDecisions.useDelete;
