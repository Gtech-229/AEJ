'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateMicroProjetPayload, MicroProjet } from './micro-projets.dto';
import { microProjetsKeys } from './micro-projets.keys';
import { microProjetsService } from './micro-projets.service';

export function useMicroProjets() {
  return useQuery({
    queryKey: microProjetsKeys.lists(),
    queryFn: () => microProjetsService.getAll(),
  });
}

export function useCreateMicroProjet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMicroProjetPayload) => microProjetsService.create(payload),
    onSuccess: () => {
      toast.success('Micro-projet créé');
      queryClient.invalidateQueries({ queryKey: microProjetsKeys.all });
    },
    onError: () => toast.error('Échec de la création du micro-projet'),
  });
}

export function useUpdateMicroProjet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MicroProjet) => microProjetsService.update(payload),
    onSuccess: () => {
      toast.success('Micro-projet mis à jour');
      queryClient.invalidateQueries({ queryKey: microProjetsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du micro-projet'),
  });
}

export function useDeleteMicroProjet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => microProjetsService.remove(id),
    onSuccess: () => {
      toast.success('Micro-projet supprimé');
      queryClient.invalidateQueries({ queryKey: microProjetsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du micro-projet'),
  });
}