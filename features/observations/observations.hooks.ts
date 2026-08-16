'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateObservationPayload } from './observations.dto';
import { observationsKeys } from './observations.keys';
import { observationsService } from './observations.service';

export function useObservations() {
  return useQuery({
    queryKey: observationsKeys.lists(),
    queryFn: () => observationsService.getAll(),
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateObservationPayload) => observationsService.create(payload),
    onSuccess: () => {
      toast.success('Observation ajoutée');
      queryClient.invalidateQueries({ queryKey: observationsKeys.all });
    },
    onError: () => toast.error("Échec de l'ajout de l'observation"),
  });
}
