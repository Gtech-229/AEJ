import apiClient from '@/lib/api/client';
import type { Credit, CreditListParams, CreditListResponse } from './credits.types';

const BASE_URL = '/credits';

function toQueryString(params: CreditListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const creditsService = {
    list: (params: CreditListParams = {}): Promise<CreditListResponse> =>
        apiClient.get<CreditListResponse>(`${BASE_URL}${toQueryString(params)}`),

    getById: (id: string): Promise<Credit> => apiClient.get<Credit>(`${BASE_URL}/${id}`),
};