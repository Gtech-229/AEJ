'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Configuration } from './configurations.dto';
import { configurationsKeys } from './configurations.keys';
import { configurationsService } from './configurations.service';

/** Reads the full configuration object. */
export function useConfigurations() {
  return useQuery({
    queryKey: configurationsKeys.detail(),
    queryFn: () => configurationsService.getConfigurations(),
  });
}

/**
 * Saves the configuration. The caller merges a section's fields into the current
 * config and passes the whole object here (the API accepts the full object).
 */
export function useUpdateConfigurations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Configuration) => configurationsService.updateConfigurations(payload),
    onSuccess: () => {
      toast.success('Configuration enregistrée');
      queryClient.invalidateQueries({ queryKey: configurationsKeys.all });
    },
    onError: () => {
      toast.error("Échec de l'enregistrement de la configuration");
    },
  });
}
