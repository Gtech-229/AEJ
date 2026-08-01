'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateJeunePayload, UpdateJeunePayload } from './jeunes.dto';
import { jeunesKeys } from './jeunes.keys';
import { jeunesService } from './jeunes.service';

export function useJeunes() {
  return useQuery({
    queryKey: jeunesKeys.lists(),
    queryFn: () => jeunesService.getAll(),
  });
}

export function useCreateJeune() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJeunePayload) => jeunesService.create(payload),
    onSuccess: () => {
      toast.success('Jeune enregistré');
      queryClient.invalidateQueries({ queryKey: jeunesKeys.all });
    },
    onError: () => toast.error("Échec de l'enregistrement du jeune"),
  });
}

export function useUpdateJeune() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateJeunePayload) => jeunesService.update(payload),
    onSuccess: () => {
      toast.success('Jeune mis à jour');
      queryClient.invalidateQueries({ queryKey: jeunesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du jeune'),
  });
}

export function useDeleteJeune() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => jeunesService.remove(id),
    onSuccess: () => {
      toast.success('Jeune supprimé');
      queryClient.invalidateQueries({ queryKey: jeunesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du jeune'),
  });
}
