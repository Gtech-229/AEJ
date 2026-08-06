'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateSuiviPayload, Suivi } from './suivis.dto';
import { suivisKeys } from './suivis.keys';
import { suivisService } from './suivis.service';

export function useSuivis() {
  return useQuery({
    queryKey: suivisKeys.lists(),
    queryFn: () => suivisService.getAll(),
  });
}

export function useCreateSuivi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSuiviPayload) => suivisService.create(payload),
    onSuccess: () => {
      toast.success('Suivi créé');
      queryClient.invalidateQueries({ queryKey: suivisKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdateSuivi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Suivi) => suivisService.update(payload),
    onSuccess: () => {
      toast.success('Suivi mis à jour');
      queryClient.invalidateQueries({ queryKey: suivisKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeleteSuivi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => suivisService.remove(id),
    onSuccess: () => {
      toast.success('Suivi supprimé');
      queryClient.invalidateQueries({ queryKey: suivisKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
