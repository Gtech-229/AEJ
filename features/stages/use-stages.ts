'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { stagesService } from './stages.service';
import type { CreateStageInput, StageListParams, UpdateStageInput } from './stages.types';

export const stagesKeys = {
    all: ['stages'] as const,
    lists: () => [...stagesKeys.all, 'list'] as const,
    list: (params: StageListParams) => [...stagesKeys.lists(), params] as const,
    detail: (id: string) => [...stagesKeys.all, 'detail', id] as const,
};

export function useStagesList(params: StageListParams = {}) {
    return useQuery({
        queryKey: stagesKeys.list(params),
        queryFn: () => stagesService.list(params),
        placeholderData: keepPreviousData,
    });
}

export function useCreateStage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateStageInput) => stagesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: stagesKeys.lists() });
            toast.success('Offre de stage créée avec succès.');
        },
        onError: () => toast.error("Impossible de créer l'offre de stage."),
    });
}

export function useUpdateStage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateStageInput) => stagesService.update(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: stagesKeys.lists() });
            toast.success('Offre de stage mise à jour.');
        },
        onError: () => toast.error("Impossible de mettre à jour l'offre de stage."),
    });
}

export function useDeleteStage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => stagesService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: stagesKeys.lists() });
            toast.success('Offre de stage supprimée.');
        },
        onError: () => toast.error("Impossible de supprimer l'offre de stage."),
    });
}