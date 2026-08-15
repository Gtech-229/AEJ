import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { Embauche } from './embauches.dto';

const BASE_URL = '/embauches';

/**
 * Read-only tracking of embauches (§13.2). Each row embeds `promoteur`,
 * `entreprise`, `micro_projet`, `type_emploi`. `data` is the array whether the
 * list is a paginator or a plain array.
 */
export const embauchesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Embauche[]> => {
    const res = await client.request<{ data: Embauche[] }>(`${BASE_URL}?per_page=200`);
    return Array.isArray(res?.data) ? res.data : [];
  },
};
