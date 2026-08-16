'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/errors';
import { personnelsKeys } from './personnels.keys';
import { personnelsService } from './personnels.service';
import type { CreatePersonnelPayload, UpdatePersonnelPayload } from './personnels.dto';

export function usePersonnels() {
  return useQuery({
    queryKey: personnelsKeys.lists(),
    queryFn: () => personnelsService.getAll(),
  });
}

export function useCreatePersonnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePersonnelPayload) => personnelsService.create(payload),
    onSuccess: () => {
      toast.success('Membre créé');
      queryClient.invalidateQueries({ queryKey: personnelsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Échec de la création du membre')),
  });
}

export function useUpdatePersonnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePersonnelPayload) => personnelsService.update(payload),
    onSuccess: () => {
      toast.success('Membre mis à jour');
      queryClient.invalidateQueries({ queryKey: personnelsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Échec de la mise à jour du membre')),
  });
}

export function useDeletePersonnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => personnelsService.remove(id),
    onSuccess: () => {
      toast.success('Membre supprimé');
      queryClient.invalidateQueries({ queryKey: personnelsKeys.all });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Échec de la suppression du membre')),
  });
}