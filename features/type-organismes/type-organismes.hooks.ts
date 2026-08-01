'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateTypeOrganismePayload, TypeOrganisme } from './type-organismes.dto';
import { typeOrganismesKeys } from './type-organismes.keys';
import { typeOrganismesService } from './type-organismes.service';

export function useTypeOrganismes() {
  return useQuery({
    queryKey: typeOrganismesKeys.lists(),
    queryFn: () => typeOrganismesService.getAll(),
    staleTime: 5 * 60 * 1000, // referential — rarely changes
  });
}

export function useCreateTypeOrganisme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTypeOrganismePayload) => typeOrganismesService.create(payload),
    onSuccess: () => {
      toast.success("Type d'organisme créé");
      queryClient.invalidateQueries({ queryKey: typeOrganismesKeys.all });
    },
    onError: () => toast.error('Échec de la création du type'),
  });
}

export function useUpdateTypeOrganisme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TypeOrganisme) => typeOrganismesService.update(payload),
    onSuccess: () => {
      toast.success('Type mis à jour');
      queryClient.invalidateQueries({ queryKey: typeOrganismesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du type'),
  });
}

export function useDeleteTypeOrganisme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => typeOrganismesService.remove(id),
    onSuccess: () => {
      toast.success('Type supprimé');
      queryClient.invalidateQueries({ queryKey: typeOrganismesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du type'),
  });
}
