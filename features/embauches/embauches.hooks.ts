'use client';

import { useQuery } from '@tanstack/react-query';
import { embauchesKeys } from './embauches.keys';
import { embauchesService } from './embauches.service';

/** Read-only tracking of embauches (§13.2 — traçabilité). */
export function useEmbauches() {
  return useQuery({
    queryKey: embauchesKeys.lists(),
    queryFn: () => embauchesService.getAll(),
  });
}
