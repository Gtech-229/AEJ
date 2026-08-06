'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreatePromoteurPayload, Promoteur } from './promoteurs.dto';
import { promoteursKeys } from './promoteurs.keys';
import { promoteursService } from './promoteurs.service';

export function usePromoteurs() {
  return useQuery({
    queryKey: promoteursKeys.lists(),
    queryFn: () => promoteursService.getAll(),
  });
}

export function useCreatePromoteur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromoteurPayload) => promoteursService.create(payload),
    onSuccess: () => {
      toast.success('Promoteur créé');
      queryClient.invalidateQueries({ queryKey: promoteursKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdatePromoteur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Promoteur) => promoteursService.update(payload),
    onSuccess: () => {
      toast.success('Promoteur mis à jour');
      queryClient.invalidateQueries({ queryKey: promoteursKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeletePromoteur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => promoteursService.remove(id),
    onSuccess: () => {
      toast.success('Promoteur supprimé');
      queryClient.invalidateQueries({ queryKey: promoteursKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
