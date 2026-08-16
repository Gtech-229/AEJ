'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateEntreprisePayload, UpdateEntreprisePayload } from './entreprises.dto';
import { entreprisesKeys } from './entreprises.keys';
import { entreprisesService } from './entreprises.service';

export function useEntreprises() {
  return useQuery({
    queryKey: entreprisesKeys.lists(),
    queryFn: () => entreprisesService.getAll(),
  });
}

export function useCreateEntreprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEntreprisePayload) => entreprisesService.create(payload),
    onSuccess: () => {
      toast.success('Entreprise créée');
      queryClient.invalidateQueries({ queryKey: entreprisesKeys.all });
    },
    onError: () => toast.error("Échec de la création de l'entreprise"),
  });
}

export function useUpdateEntreprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEntreprisePayload) => entreprisesService.update(payload),
    onSuccess: () => {
      toast.success('Entreprise mise à jour');
      queryClient.invalidateQueries({ queryKey: entreprisesKeys.all });
    },
    onError: () => toast.error("Échec de la mise à jour de l'entreprise"),
  });
}

export function useDeleteEntreprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => entreprisesService.remove(id),
    onSuccess: () => {
      toast.success('Entreprise supprimée');
      queryClient.invalidateQueries({ queryKey: entreprisesKeys.all });
    },
    onError: () => toast.error("Échec de la suppression de l'entreprise"),
  });
}
