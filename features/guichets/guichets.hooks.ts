'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateGuichetPayload, Guichet } from './guichets.dto';
import { guichetsKeys } from './guichets.keys';
import { guichetsService } from './guichets.service';

export function useGuichets() {
  return useQuery({
    queryKey: guichetsKeys.lists(),
    queryFn: () => guichetsService.getAll(),
    staleTime: 5 * 60 * 1000, // referential — rarely changes
  });
}

export function useCreateGuichet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGuichetPayload) => guichetsService.create(payload),
    onSuccess: () => {
      toast.success('Guichet créé');
      queryClient.invalidateQueries({ queryKey: guichetsKeys.all });
    },
    onError: () => toast.error('Échec de la création du guichet'),
  });
}

export function useUpdateGuichet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Guichet) => guichetsService.update(payload),
    onSuccess: () => {
      toast.success('Guichet mis à jour');
      queryClient.invalidateQueries({ queryKey: guichetsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du guichet'),
  });
}

export function useDeleteGuichet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => guichetsService.remove(id),
    onSuccess: () => {
      toast.success('Guichet supprimé');
      queryClient.invalidateQueries({ queryKey: guichetsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du guichet'),
  });
}
