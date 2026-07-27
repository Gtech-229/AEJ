import apiClient from '@/lib/api/client';
import type {
    CreateEmploiInput,
    Emploi,
    EmploiListParams,
    EmploiListResponse,
    UpdateEmploiInput,
} from './emplois.types';

const BASE_URL = '/emplois';

function toQueryString(params: EmploiListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const emploisService = {
    list: (params: EmploiListParams = {}): Promise<EmploiListResponse> =>
        apiClient.get<EmploiListResponse>(`${BASE_URL}${toQueryString(params)}`),

    getById: (id: number): Promise<Emploi> => apiClient.get<Emploi>(`${BASE_URL}/${id}`),

    create: (payload: CreateEmploiInput): Promise<Emploi> => apiClient.post<Emploi>(BASE_URL, payload),

    update: ({ id, ...payload }: UpdateEmploiInput): Promise<Emploi> =>
        apiClient.put<Emploi>(`${BASE_URL}/${id}`, payload),

    remove: (id: number): Promise<void> => apiClient.delete<void>(`${BASE_URL}/${id}`),
};