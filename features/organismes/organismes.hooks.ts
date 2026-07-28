'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateOrganismePayload, Organisme } from './organismes.dto';
import { organismesKeys } from './organismes.keys';
import { organismesService } from './organismes.service';

export function useOrganismes() {
  return useQuery({
    queryKey: organismesKeys.lists(),
    queryFn: () => organismesService.getAll(),
  });
}

export function useCreateOrganisme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganismePayload) => organismesService.create(payload),
    onSuccess: () => {
      toast.success('Organisme créé (simulation — non connecté au backend)');
      queryClient.invalidateQueries({ queryKey: organismesKeys.all });
    },
    onError: () => toast.error("Échec de la création de l'organisme"),
  });
}

export function useUpdateOrganisme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Organisme) => organismesService.update(payload),
    onSuccess: () => {
      toast.success('Organisme mis à jour (simulation — non connecté au backend)');
      queryClient.invalidateQueries({ queryKey: organismesKeys.all });
    },
    onError: () => toast.error("Échec de la mise à jour de l'organisme"),
  });
}

export function useDeleteOrganisme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => organismesService.remove(id),
    onSuccess: () => {
      toast.success('Organisme supprimé (simulation — non connecté au backend)');
      queryClient.invalidateQueries({ queryKey: organismesKeys.all });
    },
    onError: () => toast.error("Échec de la suppression de l'organisme"),
  });
}