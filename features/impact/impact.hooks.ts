'use client';

import { useQuery } from '@tanstack/react-query';
import { impactService } from './impact.service';

export const impactKeys = {
  all: ['impact'] as const,
  detail: (creditId: string) => [...impactKeys.all, creditId] as const,
};

/** Lecture seule — les indicateurs d'impact sont calculés côté serveur, jamais saisis manuellement. */
export function useImpact(creditId: string) {
  return useQuery({
    queryKey: impactKeys.detail(creditId),
    queryFn: () => impactService.get(creditId),
    enabled: !!creditId,
  });
}
