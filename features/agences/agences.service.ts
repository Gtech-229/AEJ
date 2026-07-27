import apiClient from '@/lib/api/client';
import type {
    Agence,
    AgenceListParams,
    AgenceListResponse,
    CreateAgenceInput,
    UpdateAgenceInput,
} from './agences.types';

const BASE_URL = '/agences';

function toQueryString(params: AgenceListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const agencesService = {
    list: (params: AgenceListParams = {}): Promise<AgenceListResponse> =>
        apiClient.get<AgenceListResponse>(`${BASE_URL}${toQueryString(params)}`),

    getById: (id: number): Promise<Agence> => apiClient.get<Agence>(`${BASE_URL}/${id}`),

    create: (payload: CreateAgenceInput): Promise<Agence> => apiClient.post<Agence>(BASE_URL, payload),

    update: ({ id, ...payload }: UpdateAgenceInput): Promise<Agence> =>
        apiClient.put<Agence>(`${BASE_URL}/${id}`, payload),

    remove: (id: number): Promise<void> => apiClient.delete<void>(`${BASE_URL}/${id}`),
};