'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ProjetQuery } from './projects.dto';
import { projectsKeys } from './projects.keys';
import { projectsService } from './projects.service';

/** Paginated + (soon) filtered micro-projets list. */
export function useProjectsPage(query: ProjetQuery) {
  return useQuery({
    queryKey: projectsKeys.list(query),
    queryFn: () => projectsService.getPage(query),
    placeholderData: keepPreviousData,
  });
}

/** A single project by id — `GET /projets/{id}`. */
export function useProject(id: number | undefined) {
  return useQuery({
    queryKey: projectsKeys.detail(id ?? 0),
    queryFn: () => projectsService.getById(id as number),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * A promoteur's micro-projets. `/projets` doesn't honor `?promoteur_id=` yet, so
 * we fetch a page of the list (shared cache key) and filter client-side. Swap for
 * a scoped fetch once the backend wires it (see the service + backend-asks).
 */
export function useProjectsByPromoteur(promoteurId: number | undefined) {
  return useQuery({
    queryKey: projectsKeys.lists(),
    queryFn: () => projectsService.getAll(),
    enabled: !!promoteurId,
    staleTime: 5 * 60 * 1000,
    select: (all) => all.filter((p) => p.promoteur_id === promoteurId),
  });
}
