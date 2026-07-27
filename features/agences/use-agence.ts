'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { agencesService } from './agences.service';
import type { AgenceListParams, CreateAgenceInput, UpdateAgenceInput } from './agences.types';

export const agencesKeys = {
    all: ['agences'] as const,
    lists: () => [...agencesKeys.all, 'list'] as const,
    list: (params: AgenceListParams) => [...agencesKeys.lists(), params] as const,
    detail: (id: number) => [...agencesKeys.all, 'detail', id] as const,
};

export function useAgencesList(params: AgenceListParams = {}) {
    return useQuery({
        queryKey: agencesKeys.list(params),
        queryFn: () => agencesService.list(params),
        placeholderData: keepPreviousData,
    });
}

export function useCreateAgence() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateAgenceInput) => agencesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agencesKeys.lists() });
            toast.success('Agence créée avec succès.');
        },
        onError: () => toast.error("Impossible de créer l'agence."),
    });
}

export function useUpdateAgence() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateAgenceInput) => agencesService.update(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agencesKeys.lists() });
            toast.success('Agence mise à jour.');
        },
        onError: () => toast.error("Impossible de mettre à jour l'agence."),
    });
}

export function useDeleteAgence() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => agencesService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agencesKeys.lists() });
            toast.success('Agence supprimée.');
        },
        onError: () => toast.error("Impossible de supprimer l'agence."),
    });
}