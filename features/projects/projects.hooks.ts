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
