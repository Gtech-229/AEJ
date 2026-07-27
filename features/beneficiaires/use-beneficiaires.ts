'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { beneficiairesService } from './beneficiaires.service';
import type { BeneficiaireListParams } from './beneficiaires.types';

export const beneficiairesKeys = {
    all: ['beneficiaires'] as const,
    lists: () => [...beneficiairesKeys.all, 'list'] as const,
    list: (params: BeneficiaireListParams) => [...beneficiairesKeys.lists(), params] as const,
};

/** Lecture seule — un bénéficiaire se crée via l'octroi d'un crédit, pas depuis ce back-office. */
export function useBeneficiairesList(params: BeneficiaireListParams = {}) {
    return useQuery({
        queryKey: beneficiairesKeys.list(params),
        queryFn: () => beneficiairesService.list(params),
        placeholderData: keepPreviousData,
    });
}