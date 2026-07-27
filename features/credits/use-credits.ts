'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { creditsService } from './credits.service';
import type { CreditListParams } from './credits.types';

export const creditsKeys = {
    all: ['credits'] as const,
    lists: () => [...creditsKeys.all, 'list'] as const,
    list: (params: CreditListParams) => [...creditsKeys.lists(), params] as const,
    detail: (id: string) => [...creditsKeys.all, 'detail', id] as const,
};

/** Liste en lecture seule — un crédit se crée via le workflow d'octroi, pas depuis ce back-office. */
export function useCreditsList(params: CreditListParams = {}) {
    return useQuery({
        queryKey: creditsKeys.list(params),
        queryFn: () => creditsService.list(params),
        placeholderData: keepPreviousData,
    });
}