'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { BeneficiairePrevu, CreateBeneficiairePrevuPayload } from './beneficiaires-prevus.dto';
import { beneficiairesPrevusKeys } from './beneficiaires-prevus.keys';
import { beneficiairesPrevusService } from './beneficiaires-prevus.service';

export function useBeneficiairesPrevus() {
  return useQuery({
    queryKey: beneficiairesPrevusKeys.lists(),
    queryFn: () => beneficiairesPrevusService.getAll(),
  });
}

export function useCreateBeneficiairePrevu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBeneficiairePrevuPayload) =>
      beneficiairesPrevusService.create(payload),
    onSuccess: () => {
      toast.success('Bénéficiaire prévu créé');
      queryClient.invalidateQueries({ queryKey: beneficiairesPrevusKeys.all });
    },
    onError: () => toast.error('Échec de la création du bénéficiaire prévu'),
  });
}

export function useUpdateBeneficiairePrevu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BeneficiairePrevu) => beneficiairesPrevusService.update(payload),
    onSuccess: () => {
      toast.success('Bénéficiaire prévu mis à jour');
      queryClient.invalidateQueries({ queryKey: beneficiairesPrevusKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du bénéficiaire prévu'),
  });
}

export function useDeleteBeneficiairePrevu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => beneficiairesPrevusService.remove(id),
    onSuccess: () => {
      toast.success('Bénéficiaire prévu supprimé');
      queryClient.invalidateQueries({ queryKey: beneficiairesPrevusKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du bénéficiaire prévu'),
  });
}
