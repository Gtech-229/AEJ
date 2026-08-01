'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateServicePayload, Service } from './services.dto';
import { servicesKeys } from './services.keys';
import { servicesService } from './services.service';

export function useServices() {
  return useQuery({
    queryKey: servicesKeys.lists(),
    queryFn: () => servicesService.getAll(),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServicePayload) => servicesService.create(payload),
    onSuccess: () => {
      toast.success('Service créé');
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
    onError: () => toast.error('Échec de la création du service'),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Service) => servicesService.update(payload),
    onSuccess: () => {
      toast.success('Service mis à jour');
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du service'),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => servicesService.remove(id),
    onSuccess: () => {
      toast.success('Service supprimé');
      queryClient.invalidateQueries({ queryKey: servicesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du service'),
  });
}
