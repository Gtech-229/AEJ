'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateZonePayload, UpdateZonePayload } from './zones-intervention.dto';
import { zonesKeys } from './zones-intervention.keys';
import { zonesService } from './zones-intervention.service';

export function useZones() {
  return useQuery({ queryKey: zonesKeys.lists(), queryFn: () => zonesService.getAll() });
}

export function useCreateZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateZonePayload) => zonesService.create(payload),
    onSuccess: () => {
      toast.success("Zone d'intervention créée");
      qc.invalidateQueries({ queryKey: zonesKeys.all });
    },
    onError: () => toast.error('Échec de la création de la zone'),
  });
}

export function useUpdateZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateZonePayload) => zonesService.update(payload),
    onSuccess: () => {
      toast.success('Zone mise à jour');
      qc.invalidateQueries({ queryKey: zonesKeys.all });
    },
    onError: () => toast.error('Échec de la mise à jour de la zone'),
  });
}

export function useDeleteZone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => zonesService.remove(id),
    onSuccess: () => {
      toast.success('Zone supprimée');
      qc.invalidateQueries({ queryKey: zonesKeys.all });
    },
    onError: () => toast.error('Échec de la suppression de la zone'),
  });
}
