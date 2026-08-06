import { apiClient } from '@/lib/api/client';
import type { ImpactIndicateurs } from './impact.types';

const BASE_URL = '/credits';

export const impactService = {
  get: (creditId: string): Promise<ImpactIndicateurs> =>
    apiClient.get<ImpactIndicateurs>(`${BASE_URL}/${creditId}/impact`),
};
