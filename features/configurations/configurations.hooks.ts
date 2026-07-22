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
 *
 * Optimistic: the cache is updated to the new config immediately, snapshotted
 * for rollback on error, then reconciled with the server's normalized record.
 */
export function useUpdateConfigurations() {
  const queryClient = useQueryClient();
  const detailKey = configurationsKeys.detail();

  return useMutation({
    mutationFn: (payload: Configuration) => configurationsService.updateConfigurations(payload),

    onMutate: async (payload: Configuration) => {
      // Prevent an in-flight refetch from clobbering the optimistic value.
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous = queryClient.getQueryData<Configuration>(detailKey);
      queryClient.setQueryData<Configuration>(detailKey, payload);
      return { previous };
    },

    onError: (_err, _payload, context) => {
      // Roll back to the snapshot taken in onMutate.
      if (context?.previous !== undefined) {
        queryClient.setQueryData(detailKey, context.previous);
      }
      console.log("Error while updating the sys params :", _err)
      toast.error("Échec de l'enregistrement de la configuration");
    },

    onSuccess: (saved) => {
      // Replace the optimistic value with the server's normalized record.
      queryClient.setQueryData(detailKey, saved);
      toast.success('Configuration enregistrée');
    },
  });
}
