'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateIndicateurPayload, UpdateIndicateurPayload } from './indicateurs.dto';
import { indicateursKeys } from './indicateurs.keys';
import { indicateursService } from './indicateurs.service';

export function useIndicateurs() {
  return useQuery({
    queryKey: indicateursKeys.lists(),
    queryFn: () => indicateursService.getAll(),
  });
}

export function useCreateIndicateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIndicateurPayload) => indicateursService.create(payload),
    onSuccess: () => {
      toast.success('Indicateur créé');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.all });
    },
    onError: () => toast.error("Échec de la création de l'indicateur"),
  });
}

export function useUpdateIndicateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateIndicateurPayload) => indicateursService.update(payload),
    onSuccess: () => {
      toast.success('Indicateur mis à jour');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.all });
    },
    onError: () => toast.error("Échec de la mise à jour de l'indicateur"),
  });
}

export function useDeleteIndicateur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => indicateursService.remove(id),
    onSuccess: () => {
      toast.success('Indicateur supprimé');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.all });
    },
    onError: () => toast.error("Échec de la suppression de l'indicateur"),
  });
}

// ── Renseignement (indicateurs_suivi) ────────────────────────────────────────

export function useIndicateurSuivi(indicateurId: number, enabled = true) {
  return useQuery({
    queryKey: indicateursKeys.suivi(indicateurId),
    queryFn: () => indicateursService.listSuivi(indicateurId),
    enabled,
  });
}

export function useAddIndicateurValeur(indicateurId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { valeur: string }) =>
      indicateursService.addValeur({ indicateur_id: indicateurId, valeur: input.valeur }),
    onSuccess: () => {
      toast.success('Valeur enregistrée');
      queryClient.invalidateQueries({ queryKey: indicateursKeys.suivi(indicateurId) });
    },
    onError: () => toast.error("Échec de l'enregistrement de la valeur"),
  });
}
