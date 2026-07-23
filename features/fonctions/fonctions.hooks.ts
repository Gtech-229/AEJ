'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateFonctionPayload, Fonction } from './fonctions.dto';
import { fonctionsKeys } from './fonctions.keys';
import { fonctionsService } from './fonctions.service';

export function useFonctions() {
  return useQuery({
    queryKey: fonctionsKeys.lists(),
    queryFn: () => fonctionsService.getAll(),
  });
}

export function useCreateFonction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFonctionPayload) => fonctionsService.create(payload),
    onSuccess: () => {
      toast.success('Fonction créée');
      queryClient.invalidateQueries({ queryKey: fonctionsKeys.all });
    },
    onError: () => toast.error('Échec de la création de la fonction'),
  });
}

export function useUpdateFonction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Fonction) => fonctionsService.update(payload),
    onSuccess: () => {
      toast.success('Fonction mise à jour');
      queryClient.invalidateQueries({ queryKey: fonctionsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour de la fonction'),
  });
}

export function useDeleteFonction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fonctionsService.remove(id),
    onSuccess: () => {
      toast.success('Fonction supprimée');
      queryClient.invalidateQueries({ queryKey: fonctionsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression de la fonction'),
  });
}