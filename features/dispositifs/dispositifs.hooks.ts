'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateDispositifPayload, UpdateDispositifPayload } from './dispositifs.dto';
import { dispositifsKeys } from './dispositifs.keys';
import { dispositifsService } from './dispositifs.service';

export function useDispositifs() {
  return useQuery({ queryKey: dispositifsKeys.lists(), queryFn: () => dispositifsService.getAll() });
}

export function useCreateDispositif() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDispositifPayload) => dispositifsService.create(payload),
    onSuccess: () => {
      toast.success('Dispositif créé');
      qc.invalidateQueries({ queryKey: dispositifsKeys.all });
    },
    onError: () => toast.error('Échec de la création du dispositif'),
  });
}

export function useUpdateDispositif() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDispositifPayload) => dispositifsService.update(payload),
    onSuccess: () => {
      toast.success('Dispositif mis à jour');
      qc.invalidateQueries({ queryKey: dispositifsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du dispositif'),
  });
}

export function useDeleteDispositif() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dispositifsService.remove(id),
    onSuccess: () => {
      toast.success('Dispositif supprimé');
      qc.invalidateQueries({ queryKey: dispositifsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du dispositif'),
  });
}
