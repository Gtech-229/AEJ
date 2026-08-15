'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CreateFormulairePayload,
  UpdateFormulairePayload,
} from './formulaires-evaluation.dto';
import { formulairesEvaluationKeys } from './formulaires-evaluation.keys';
import { formulairesEvaluationService } from './formulaires-evaluation.service';

export function useFormulairesEvaluation() {
  return useQuery({
    queryKey: formulairesEvaluationKeys.lists(),
    queryFn: () => formulairesEvaluationService.getAll(),
  });
}

export function useCreateFormulaireEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFormulairePayload) => formulairesEvaluationService.create(payload),
    onSuccess: () => {
      toast.success('Formulaire créé');
      queryClient.invalidateQueries({ queryKey: formulairesEvaluationKeys.all });
    },
    onError: () => toast.error('Échec de la création du formulaire'),
  });
}

export function useUpdateFormulaireEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFormulairePayload) => formulairesEvaluationService.update(payload),
    onSuccess: () => {
      toast.success('Formulaire mis à jour');
      queryClient.invalidateQueries({ queryKey: formulairesEvaluationKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour du formulaire'),
  });
}

export function useDeleteFormulaireEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => formulairesEvaluationService.remove(id),
    onSuccess: () => {
      toast.success('Formulaire supprimé');
      queryClient.invalidateQueries({ queryKey: formulairesEvaluationKeys.all });
    },
    onError: () => toast.error('Échec de la suppression du formulaire'),
  });
}
