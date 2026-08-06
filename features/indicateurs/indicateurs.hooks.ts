'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateIndicateurPayload, Indicateur } from './indicateurs.dto';
import { indicateursKeys } from './indicateurs.keys';
import { indicateursService } from './indicateurs.service';

export function useIndicateurs() {
  return useQuery({
    queryKey: indicateursKeys.lists(),
    queryFn: () => indicateursService.getAll(),
  });
}

export function useCreateIndicateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIndicateurPayload) => indicateursService.create(payload),
    onSuccess: () => {
      toast.success('Indicateur créé');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdateIndicateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Indicateur) => indicateursService.update(payload),
    onSuccess: () => {
      toast.success('Indicateur mis à jour');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeleteIndicateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => indicateursService.remove(id),
    onSuccess: () => {
      toast.success('Indicateur supprimé');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
