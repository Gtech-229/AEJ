import apiClient from '@/lib/api/client';
import type { ProjetListParams, ProjetListResponse } from './projets.types';

const BASE_URL = '/projets';

function toQueryString(params: ProjetListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const projetsService = {
    list: (params: ProjetListParams = {}): Promise<ProjetListResponse> =>
        apiClient.get<ProjetListResponse>(`${BASE_URL}${toQueryString(params)}`),
};