import apiClient from '@/lib/api/client';
import type {
    CreateStageInput,
    Stage,
    StageListParams,
    StageListResponse,
    UpdateStageInput,
} from './stages.types';

const BASE_URL = '/stages';

function toQueryString(params: StageListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const stagesService = {
    list: (params: StageListParams = {}): Promise<StageListResponse> =>
        apiClient.get<StageListResponse>(`${BASE_URL}${toQueryString(params)}`),

    getById: (id: string): Promise<Stage> => apiClient.get<Stage>(`${BASE_URL}/${id}`),

    create: (payload: CreateStageInput): Promise<Stage> => apiClient.post<Stage>(BASE_URL, payload),

    update: ({ id, ...payload }: UpdateStageInput): Promise<Stage> =>
        apiClient.put<Stage>(`${BASE_URL}/${id}`, payload),

    remove: (id: string): Promise<void> => apiClient.delete<void>(`${BASE_URL}/${id}`),
};