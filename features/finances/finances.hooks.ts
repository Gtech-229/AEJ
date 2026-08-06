'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateOperationPayload, Operation } from './finances.dto';
import { operationsKeys } from './finances.keys';
import { operationsService } from './finances.service';

export function useFinances() {
  return useQuery({
    queryKey: operationsKeys.lists(),
    queryFn: () => operationsService.getAll(),
  });
}

export function useCreateOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOperationPayload) => operationsService.create(payload),
    onSuccess: () => {
      toast.success('Operation créé');
      queryClient.invalidateQueries({ queryKey: operationsKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdateOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Operation) => operationsService.update(payload),
    onSuccess: () => {
      toast.success('Operation mis à jour');
      queryClient.invalidateQueries({ queryKey: operationsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeleteOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => operationsService.remove(id),
    onSuccess: () => {
      toast.success('Operation supprimé');
      queryClient.invalidateQueries({ queryKey: operationsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
