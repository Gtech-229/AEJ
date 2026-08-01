'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from './permissions.dto';
import { permissionsKeys } from './permissions.keys';
import { permissionsService } from './permissions.service';

/** Permissions of a single role. Disabled until a `roleId` is known. */
export function usePermissionsByRole(roleId: number | undefined) {
  return useQuery({
    queryKey: permissionsKeys.byRole(roleId ?? 0),
    queryFn: () => permissionsService.getByRole(roleId as number),
    enabled: !!roleId,
    // Access rights change rarely — keep them warm to avoid re-fetch churn.
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePermissionPayload) => permissionsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permissionsKeys.all }),
    onError: () => toast.error("Échec de l'enregistrement d'une permission"),
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePermissionPayload) => permissionsService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permissionsKeys.all }),
    onError: () => toast.error("Échec de la mise à jour d'une permission"),
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => permissionsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: permissionsKeys.all }),
    onError: () => toast.error("Échec de la suppression d'une permission"),
  });
}
