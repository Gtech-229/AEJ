'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateRolePayload, UpdateRolePayload } from './roles.dto';
import { rolesKeys } from './roles.keys';
import { rolesService } from './roles.service';

export function useRoles() {
  return useQuery({
    queryKey: rolesKeys.lists(),
    queryFn: () => rolesService.getAll(),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rolesService.create(payload),
    onSuccess: () => {
      toast.success('Rôle créé');
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
    onError: () => toast.error('Échec de la création du rôle'),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRolePayload) => rolesService.update(payload),
    onSuccess: () => {
      toast.success('Rôle mis à jour');
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du rôle'),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rolesService.remove(id),
    onSuccess: () => {
      toast.success('Rôle supprimé');
      queryClient.invalidateQueries({ queryKey: rolesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du rôle'),
  });
}
