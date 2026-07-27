import { apiClient } from '@/lib/api/client';
import type {
    CreatePersonnelInput,
    Personnel,
    PersonnelListParams,
    PersonnelListResponse,
    UpdatePersonnelInput,
} from '@/lib/types';

const BASE_URL = '/personnel';

function toQueryString(params: PersonnelListParams = {}): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            search.set(key, String(value));
        }
    });
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

export const personnelService = {
    list: (params: PersonnelListParams = {}): Promise<PersonnelListResponse> =>
        apiClient.get<PersonnelListResponse>(`${BASE_URL}${toQueryString(params)}`),

    getById: (id: string): Promise<Personnel> =>
        apiClient.get<Personnel>(`${BASE_URL}/${id}`),

    create: (payload: CreatePersonnelInput): Promise<Personnel> =>
        apiClient.post<Personnel>(BASE_URL, payload),

    update: ({ id, ...payload }: UpdatePersonnelInput): Promise<Personnel> =>
        apiClient.put<Personnel>(`${BASE_URL}/${id}`, payload),

    remove: (id: string): Promise<void> =>
        apiClient.delete<void>(`${BASE_URL}/${id}`),
};