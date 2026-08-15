import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  AgencesAlertes,
  AgencesKpis,
  ClassementAgence,
  FinancementAgence,
  ProjetAgenceCount,
  ProjetStatutCount,
} from './agences-dashboard.dto';

const BASE_URL = '/dashboard/agences';

/** Unwraps the `{ data: … }` envelope confirmed on every endpoint here. */
async function unwrap<T>(path: string, client: ApiClient): Promise<T> {
  const res = await client.request<{ data: T }>(`${BASE_URL}${path}`);
  return res.data;
}

export const agencesDashboardService = {
  kpis: (client: ApiClient = apiClient) => unwrap<AgencesKpis>('/kpis', client),
  alertes: (client: ApiClient = apiClient) => unwrap<AgencesAlertes>('/alertes', client),
  projetsStatut: (client: ApiClient = apiClient) =>
    unwrap<ProjetStatutCount[]>('/projets-statut', client).then((v) => v ?? []),
  projetsAgence: (client: ApiClient = apiClient) =>
    unwrap<ProjetAgenceCount[]>('/projets-agence', client).then((v) => v ?? []),
  financementAgence: (client: ApiClient = apiClient) =>
    unwrap<FinancementAgence[]>('/financement-agence', client).then((v) => v ?? []),
  classement: (client: ApiClient = apiClient) =>
    unwrap<ClassementAgence[]>('/classement', client).then((v) => v ?? []),
};
