'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateUserPayload, UpdateUserPayload } from './users.dto';
import { usersKeys } from './users.keys';
import { usersService } from './users.service';

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: () => usersService.getAll(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      toast.success('Utilisateur créé');
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: () => toast.error("Échec de la création de l'utilisateur"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersService.update(payload),
    onSuccess: () => {
      toast.success('Utilisateur mis à jour');
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: () => toast.error("Échec de la mise à jour de l'utilisateur"),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersService.remove(id),
    onSuccess: () => {
      toast.success('Utilisateur supprimé');
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: () => toast.error("Échec de la suppression de l'utilisateur"),
  });
}