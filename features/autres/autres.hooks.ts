'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateElementPayload, Element } from './autres.dto';
import { elementsKeys } from './autres.keys';
import { elementsService } from './autres.service';

export function useAutres() {
  return useQuery({
    queryKey: elementsKeys.lists(),
    queryFn: () => elementsService.getAll(),
  });
}

export function useCreateElement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateElementPayload) => elementsService.create(payload),
    onSuccess: () => {
      toast.success('Element créé');
      queryClient.invalidateQueries({ queryKey: elementsKeys.all });
    },
    onError: () => toast.error('Échec de la création'),
  });
}

export function useUpdateElement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Element) => elementsService.update(payload),
    onSuccess: () => {
      toast.success('Element mis à jour');
      queryClient.invalidateQueries({ queryKey: elementsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });
}

export function useDeleteElement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => elementsService.remove(id),
    onSuccess: () => {
      toast.success('Element supprimé');
      queryClient.invalidateQueries({ queryKey: elementsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression'),
  });
}
