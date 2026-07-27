'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { projetsService } from './projets.service';
import type { ProjetListParams } from './projets.types';

export const projetsKeys = {
    all: ['projets'] as const,
    lists: () => [...projetsKeys.all, 'list'] as const,
    list: (params: ProjetListParams) => [...projetsKeys.lists(), params] as const,
};

/** Lecture seule — un projet financé provient du workflow de financement de l'agence/institution. */
export function useProjetsList(params: ProjetListParams = {}) {
    return useQuery({
        queryKey: projetsKeys.list(params),
        queryFn: () => projetsService.list(params),
        placeholderData: keepPreviousData,
    });
}