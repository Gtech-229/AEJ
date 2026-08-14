'use client';

import { useQuery } from '@tanstack/react-query';
import { workflowInstancesKeys } from './workflow-instances.keys';
import { workflowInstancesService } from './workflow-instances.service';

export function useWorkflowInstances() {
  return useQuery({
    queryKey: workflowInstancesKeys.instances(),
    queryFn: () => workflowInstancesService.getInstances(),
  });
}

/** Single instance with embedded history / deliverables / comments. */
export function useWorkflowInstance(id: number | undefined) {
  return useQuery({
    queryKey: workflowInstancesKeys.instance(id ?? 0),
    queryFn: () => workflowInstancesService.getInstance(id as number),
    enabled: id != null,
  });
}

export function useWorkflowInstanceHistories() {
  return useQuery({
    queryKey: workflowInstancesKeys.histories(),
    queryFn: () => workflowInstancesService.getHistories(),
  });
}

export function useWorkflowInstanceDeliverables() {
  return useQuery({
    queryKey: workflowInstancesKeys.deliverables(),
    queryFn: () => workflowInstancesService.getDeliverables(),
  });
}

export function useWorkflowInstanceComments() {
  return useQuery({
    queryKey: workflowInstancesKeys.comments(),
    queryFn: () => workflowInstancesService.getComments(),
  });
}
