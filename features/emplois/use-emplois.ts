'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { emploisService } from './emplois.service';
import type { CreateEmploiInput, EmploiListParams, UpdateEmploiInput } from './emplois.types';

export const emploisKeys = {
    all: ['emplois'] as const,
    lists: () => [...emploisKeys.all, 'list'] as const,
    list: (params: EmploiListParams) => [...emploisKeys.lists(), params] as const,
    detail: (id: number) => [...emploisKeys.all, 'detail', id] as const,
};

export function useEmploisList(params: EmploiListParams = {}) {
    return useQuery({
        queryKey: emploisKeys.list(params),
        queryFn: () => emploisService.list(params),
        placeholderData: keepPreviousData,
    });
}

export function useCreateEmploi() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateEmploiInput) => emploisService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: emploisKeys.lists() });
            toast.success("Offre d'emploi créée avec succès.");
        },
        onError: () => toast.error("Impossible de créer l'offre d'emploi."),
    });
}

export function useUpdateEmploi() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateEmploiInput) => emploisService.update(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: emploisKeys.lists() });
            toast.success("Offre d'emploi mise à jour.");
        },
        onError: () => toast.error("Impossible de mettre à jour l'offre d'emploi."),
    });
}

export function useDeleteEmploi() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => emploisService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: emploisKeys.lists() });
            toast.success("Offre d'emploi supprimée.");
        },
        onError: () => toast.error("Impossible de supprimer l'offre d'emploi."),
    });
}