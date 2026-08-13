'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateBudgetPayload, UpdateBudgetPayload } from './financements.dto';
import {
  budgetsKeys,
  categoriesTransactionsKeys,
  comptesKeys,
  decaissementDeclarationsKeys,
  decaissementsKeys,
  plansKeys,
  remboursementDeclarationsKeys,
  remboursementsKeys,
  transactionsKeys,
} from './financements.keys';
import {
  budgetsService,
  categoriesTransactionsService,
  comptesService,
  decaissementDeclarationsService,
  decaissementsService,
  plansService,
  remboursementDeclarationsService,
  remboursementsService,
  transactionsService,
} from './financements.service';

// ── Budgets (read + write) ───────────────────────────────────────────────────
export function useBudgets() {
  return useQuery({ queryKey: budgetsKeys.lists(), queryFn: () => budgetsService.getAll() });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => budgetsService.create(payload),
    onSuccess: () => {
      toast.success('Financement créé');
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
    },
    onError: () => toast.error('Échec de la création du financement'),
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBudgetPayload) => budgetsService.update(payload),
    onSuccess: () => {
      toast.success('Financement mis à jour');
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du financement'),
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => budgetsService.remove(id),
    onSuccess: () => {
      toast.success('Financement supprimé');
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du financement'),
  });
}

// ── Read-only lists (write hooks to be added with their forms) ────────────────
export function useComptes() {
  return useQuery({ queryKey: comptesKeys.lists(), queryFn: () => comptesService.getAll() });
}

export function useDecaissements() {
  return useQuery({
    queryKey: decaissementsKeys.lists(),
    queryFn: () => decaissementsService.getAll(),
  });
}

export function useRemboursements() {
  return useQuery({
    queryKey: remboursementsKeys.lists(),
    queryFn: () => remboursementsService.getAll(),
  });
}

export function usePlansDecaissement() {
  return useQuery({ queryKey: plansKeys.lists(), queryFn: () => plansService.getAll() });
}

export function useTransactions() {
  return useQuery({
    queryKey: transactionsKeys.lists(),
    queryFn: () => transactionsService.getAll(),
  });
}

export function useDecaissementDeclarations() {
  return useQuery({
    queryKey: decaissementDeclarationsKeys.lists(),
    queryFn: () => decaissementDeclarationsService.getAll(),
  });
}

export function useRemboursementDeclarations() {
  return useQuery({
    queryKey: remboursementDeclarationsKeys.lists(),
    queryFn: () => remboursementDeclarationsService.getAll(),
  });
}

export function useCategoriesTransactions() {
  return useQuery({
    queryKey: categoriesTransactionsKeys.lists(),
    queryFn: () => categoriesTransactionsService.getAll(),
  });
}
