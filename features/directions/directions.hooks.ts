'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateDirectionPayload, Direction } from './directions.dto';
import { directionsKeys } from './directions.keys';
import { directionsService } from './directions.service';

export function useDirections() {
  return useQuery({
    queryKey: directionsKeys.lists(),
    queryFn: () => directionsService.getAll(),
  });
}

export function useCreateDirection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDirectionPayload) => directionsService.create(payload),
    onSuccess: () => {
      toast.success('Direction créée');
      queryClient.invalidateQueries({ queryKey: directionsKeys.all });
    },
    onError: () => toast.error('Échec de la création de la direction'),
  });
}

export function useUpdateDirection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Direction) => directionsService.update(payload),
    onSuccess: () => {
      toast.success('Direction mise à jour');
      queryClient.invalidateQueries({ queryKey: directionsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour de la direction'),
  });
}

export function useDeleteDirection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => directionsService.remove(id),
    onSuccess: () => {
      toast.success('Direction supprimée');
      queryClient.invalidateQueries({ queryKey: directionsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression de la direction'),
  });
}
