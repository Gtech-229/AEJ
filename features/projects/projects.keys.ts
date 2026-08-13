import type { ProjetQuery } from './projects.dto';

/** TanStack Query key factory for the projects feature. */
export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (query: ProjetQuery) => [...projectsKeys.all, 'list', query] as const,
  detail: (id: number) => [...projectsKeys.all, 'detail', id] as const,
};
