'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateDispositifPayload, Dispositif } from './dispositifs.dto';
import { dispositifsKeys } from './dispositifs.keys';
import { dispositifsService } from './dispositifs.service';

export function useDispositifs() {
  return useQuery({
    queryKey: dispositifsKeys.lists(),
    queryFn: () => dispositifsService.getAll(),
    staleTime: 5 * 60 * 1000, // referential — rarely changes
  });
}

export function useCreateDispositif() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDispositifPayload) => dispositifsService.create(payload),
    onSuccess: () => {
      toast.success('Dispositif créé');
      queryClient.invalidateQueries({ queryKey: dispositifsKeys.all });
    },
    onError: () => toast.error('Échec de la création du dispositif'),
  });
}

export function useUpdateDispositif() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Dispositif) => dispositifsService.update(payload),
    onSuccess: () => {
      toast.success('Dispositif mis à jour');
      queryClient.invalidateQueries({ queryKey: dispositifsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du dispositif'),
  });
}

export function useDeleteDispositif() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dispositifsService.remove(id),
    onSuccess: () => {
      toast.success('Dispositif supprimé');
      queryClient.invalidateQueries({ queryKey: dispositifsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du dispositif'),
  });
}
