'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateDossierPayload, Dossier } from './workflow.dto';
import { dossiersKeys } from './workflow.keys';
import { dossiersService } from './workflow.service';

export function useWorkflow() {
  return useQuery({
    queryKey: dossiersKeys.lists(),
    queryFn: () => dossiersService.getAll(),
  });
}

export function useCreateDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDossierPayload) => dossiersService.create(payload),
    onSuccess: () => {
      toast.success('Dossier créé');
      queryClient.invalidateQueries({ queryKey: dossiersKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdateDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Dossier) => dossiersService.update(payload),
    onSuccess: () => {
      toast.success('Dossier mis à jour');
      queryClient.invalidateQueries({ queryKey: dossiersKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeleteDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dossiersService.remove(id),
    onSuccess: () => {
      toast.success('Dossier supprimé');
      queryClient.invalidateQueries({ queryKey: dossiersKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
