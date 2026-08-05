'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsKeys } from './projects.keys';
import { projectsService } from './projects.service';

/**
 * A promoteur's micro-projets. While `/projects` is unpaginated and doesn't
 * honor `?promoteur_id=`, we fetch the full list ONCE (shared cache key) and
 * filter to this promoteur via `select` — so opening several promoteurs reuses
 * the cached list instead of refetching it each time. Swap the queryFn for a
 * scoped `?promoteur_id=` fetch once the backend wires it (see the service).
 */
export function useProjectsByPromoteur(promoteurId: number | undefined) {
  console.log("Reeived project id ", promoteurId)
  return useQuery({
    queryKey: projectsKeys.lists(),
    queryFn: () => projectsService.getAll(),
    enabled: !!promoteurId,
    staleTime: 5 * 60 * 1000,
    select: (all) => all.filter((p) => p.promoteur_id === promoteurId),
  });
}

/** A single project by id — derives from the same shared list cache. */
export function useProject(id: number | undefined) {
  return useQuery({
    queryKey: projectsKeys.lists(),
    queryFn: () => projectsService.getAll(),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    select: (all) => all.find((p) => p.id === id) ?? null,
  });
}
