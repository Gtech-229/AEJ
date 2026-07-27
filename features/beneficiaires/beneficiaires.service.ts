import apiClient from '@/lib/api/client';
import type { BeneficiaireListParams, BeneficiaireListResponse } from './beneficiaires.types';

const BASE_URL = '/beneficiaires';

function toQueryString(params: BeneficiaireListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const beneficiairesService = {
    list: (params: BeneficiaireListParams = {}): Promise<BeneficiaireListResponse> =>
        apiClient.get<BeneficiaireListResponse>(`${BASE_URL}${toQueryString(params)}`),
};