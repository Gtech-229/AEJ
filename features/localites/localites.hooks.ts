'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateLocalitePayload, Localite } from './localites.dto';
import { localitesKeys } from './localites.keys';
import { localitesService } from './localites.service';

export function useLocalites() {
  return useQuery({
    queryKey: localitesKeys.lists(),
    queryFn: () => localitesService.getAll(),
  });
}

export function useCreateLocalite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLocalitePayload) => localitesService.create(payload),
    onSuccess: () => {
      toast.success('Localité créée');
      queryClient.invalidateQueries({ queryKey: localitesKeys.all });
    },
    onError: () => toast.error('Échec de la création de la localité'),
  });
}

export function useUpdateLocalite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Localite) => localitesService.update(payload),
    onSuccess: () => {
      toast.success('Localité mise à jour');
      queryClient.invalidateQueries({ queryKey: localitesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour de la localité'),
  });
}

export function useDeleteLocalite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => localitesService.remove(id),
    onSuccess: () => {
      toast.success('Localité supprimée');
      queryClient.invalidateQueries({ queryKey: localitesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression de la localité'),
  });
}