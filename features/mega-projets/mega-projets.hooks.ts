'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateMegaProjetPayload, UpdateMegaProjetPayload } from './mega-projets.dto';
import { megaProjetsKeys } from './mega-projets.keys';
import { megaProjetsService } from './mega-projets.service';

export function useMegaProjets() {
  return useQuery({ queryKey: megaProjetsKeys.lists(), queryFn: () => megaProjetsService.getAll() });
}

export function useCreateMegaProjet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMegaProjetPayload) => megaProjetsService.create(payload),
    onSuccess: () => {
      toast.success('Projet créé');
      qc.invalidateQueries({ queryKey: megaProjetsKeys.all });
    },
    onError: () => toast.error('Échec de la création du projet'),
  });
}

export function useUpdateMegaProjet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMegaProjetPayload) => megaProjetsService.update(payload),
    onSuccess: () => {
      toast.success('Projet mis à jour');
      qc.invalidateQueries({ queryKey: megaProjetsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du projet'),
  });
}

export function useDeleteMegaProjet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => megaProjetsService.remove(id),
    onSuccess: () => {
      toast.success('Projet supprimé');
      qc.invalidateQueries({ queryKey: megaProjetsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du projet'),
  });
}
