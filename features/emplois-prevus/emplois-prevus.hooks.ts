'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateEmploiPrevuPayload, EmploiPrevu } from './emplois-prevus.dto';
import { emploisPrevusKeys } from './emplois-prevus.keys';
import { emploisPrevusService } from './emplois-prevus.service';

export function useEmploisPrevus() {
  return useQuery({
    queryKey: emploisPrevusKeys.lists(),
    queryFn: () => emploisPrevusService.getAll(),
  });
}

export function useCreateEmploiPrevu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmploiPrevuPayload) => emploisPrevusService.create(payload),
    onSuccess: () => {
      toast.success('Emploi prévu créé');
      queryClient.invalidateQueries({ queryKey: emploisPrevusKeys.all });
    },
    onError: () => toast.error("Échec de la création de l'emploi prévu"),
  });
}

export function useUpdateEmploiPrevu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmploiPrevu) => emploisPrevusService.update(payload),
    onSuccess: () => {
      toast.success('Emploi prévu mis à jour');
      queryClient.invalidateQueries({ queryKey: emploisPrevusKeys.all });
    },
    onError: () => toast.error("Échec de la mise à jour de l'emploi prévu"),
  });
}

export function useDeleteEmploiPrevu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => emploisPrevusService.remove(id),
    onSuccess: () => {
      toast.success('Emploi prévu supprimé');
      queryClient.invalidateQueries({ queryKey: emploisPrevusKeys.all });
    },
    onError: () => toast.error("Échec de la suppression de l'emploi prévu"),
  });
}
