'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateGuichetPayload, UpdateGuichetPayload } from './guichets.dto';
import { guichetsKeys } from './guichets.keys';
import { guichetsService } from './guichets.service';

export function useGuichets() {
  return useQuery({ queryKey: guichetsKeys.lists(), queryFn: () => guichetsService.getAll() });
}

export function useCreateGuichet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGuichetPayload) => guichetsService.create(payload),
    onSuccess: () => {
      toast.success('Guichet créé');
      qc.invalidateQueries({ queryKey: guichetsKeys.all });
    },
    onError: () => toast.error('Échec de la création du guichet'),
  });
}

export function useUpdateGuichet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateGuichetPayload) => guichetsService.update(payload),
    onSuccess: () => {
      toast.success('Guichet mis à jour');
      qc.invalidateQueries({ queryKey: guichetsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du guichet'),
  });
}

export function useDeleteGuichet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => guichetsService.remove(id),
    onSuccess: () => {
      toast.success('Guichet supprimé');
      qc.invalidateQueries({ queryKey: guichetsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du guichet'),
  });
}
