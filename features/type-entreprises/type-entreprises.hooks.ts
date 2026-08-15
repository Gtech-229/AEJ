'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateTypeEntreprisePayload, UpdateTypeEntreprisePayload } from './type-entreprises.dto';
import { typeEntreprisesKeys } from './type-entreprises.keys';
import { typeEntreprisesService } from './type-entreprises.service';

export function useTypeEntreprises() {
  return useQuery({
    queryKey: typeEntreprisesKeys.lists(),
    queryFn: () => typeEntreprisesService.getAll(),
    staleTime: 5 * 60 * 1000, // referential — rarely changes
  });
}

export function useCreateTypeEntreprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTypeEntreprisePayload) => typeEntreprisesService.create(payload),
    onSuccess: () => {
      toast.success("Type d'entreprise créé");
      queryClient.invalidateQueries({ queryKey: typeEntreprisesKeys.all });
    },
    onError: () => toast.error('Échec de la création du type'),
  });
}

export function useUpdateTypeEntreprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTypeEntreprisePayload) => typeEntreprisesService.update(payload),
    onSuccess: () => {
      toast.success('Type mis à jour');
      queryClient.invalidateQueries({ queryKey: typeEntreprisesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du type'),
  });
}

export function useDeleteTypeEntreprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => typeEntreprisesService.remove(id),
    onSuccess: () => {
      toast.success('Type supprimé');
      queryClient.invalidateQueries({ queryKey: typeEntreprisesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du type'),
  });
}
