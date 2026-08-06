'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateIndicateurSuiviPayload, IndicateurSuivi } from './indicateur-suivis.dto';
import { indicateurSuivisKeys } from './indicateur-suivis.keys';
import { indicateurSuivisService } from './indicateur-suivis.service';

export function useIndicateurSuivis() {
  return useQuery({
    queryKey: indicateurSuivisKeys.lists(),
    queryFn: () => indicateurSuivisService.getAll(),
  });
}

export function useCreateIndicateurSuivi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIndicateurSuiviPayload) => indicateurSuivisService.create(payload),
    onSuccess: () => {
      toast.success('IndicateurSuivi créé');
      queryClient.invalidateQueries({ queryKey: indicateurSuivisKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdateIndicateurSuivi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IndicateurSuivi) => indicateurSuivisService.update(payload),
    onSuccess: () => {
      toast.success('IndicateurSuivi mis à jour');
      queryClient.invalidateQueries({ queryKey: indicateurSuivisKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeleteIndicateurSuivi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => indicateurSuivisService.remove(id),
    onSuccess: () => {
      toast.success('IndicateurSuivi supprimé');
      queryClient.invalidateQueries({ queryKey: indicateurSuivisKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
