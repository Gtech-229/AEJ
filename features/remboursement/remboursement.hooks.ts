'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { remboursementService } from './remboursement.service';
import type { EnregistrerPaiementInput } from './remboursement.types';

export const remboursementKeys = {
  all: ['echeances'] as const,
  list: (creditId: string) => [...remboursementKeys.all, creditId] as const,
};

export function useEcheancesList(creditId: string) {
  return useQuery({
    queryKey: remboursementKeys.list(creditId),
    queryFn: () => remboursementService.listEcheances(creditId),
    enabled: !!creditId,
  });
}

export function useEnregistrerPaiement(creditId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EnregistrerPaiementInput) => remboursementService.enregistrerPaiement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remboursementKeys.list(creditId) });
    },
  });
}
