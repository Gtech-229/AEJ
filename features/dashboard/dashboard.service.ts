import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toNumber } from '@/lib/number';
import type {
  DashboardAlertes,
  DashboardClassement,
  DashboardFinancementAgence,
  DashboardKpis,
  DashboardProjetAgence,
  DashboardProjetStatut,
} from './dashboard.dto';

const BASE = '/dashboard/agences';

/** Raw KPI payload — the API keys carry French accents; normalized below. */
interface RawKpis {
  nombre_agences?: number;
  nombre_projets?: number;
  nombre_promoteurs?: number;
  'montant_financé'?: string | number;
  'montant_décaissé'?: string | number;
  'emplois_créés'?: number;
}

async function getObject<T>(path: string, client: ApiClient): Promise<T> {
  const res = await client.request<{ data: T }>(path);
  return res.data;
}
async function getList<T>(path: string, client: ApiClient): Promise<T[]> {
  const res = await client.request<{ data: T[] }>(path);
  return Array.isArray(res?.data) ? res.data : [];
}

/**
 * Agence dashboard — reads the dedicated `GET /dashboard/agences/*` endpoints
 * (replaces the earlier client-side aggregation). KPI accented keys are mapped
 * to plain camelCase and decimals coerced to numbers.
 */
export const dashboardService = {
  getKpis: async (client: ApiClient = apiClient): Promise<DashboardKpis> => {
    const d = await getObject<RawKpis>(`${BASE}/kpis`, client);
    return {
      nombreAgences: d?.nombre_agences ?? 0,
      nombreProjets: d?.nombre_projets ?? 0,
      nombrePromoteurs: d?.nombre_promoteurs ?? 0,
      montantFinance: toNumber(d?.['montant_financé']) ?? 0,
      montantDecaisse: toNumber(d?.['montant_décaissé']) ?? 0,
      emploisCrees: d?.['emplois_créés'] ?? 0,
    };
  },
  getProjetsStatut: (client: ApiClient = apiClient) =>
    getList<DashboardProjetStatut>(`${BASE}/projets-statut`, client),
  getProjetsAgence: (client: ApiClient = apiClient) =>
    getList<DashboardProjetAgence>(`${BASE}/projets-agence`, client),
  getFinancementAgence: (client: ApiClient = apiClient) =>
    getList<DashboardFinancementAgence>(`${BASE}/financement-agence`, client),
  getClassement: (client: ApiClient = apiClient) =>
    getList<DashboardClassement>(`${BASE}/classement`, client),
  getAlertes: (client: ApiClient = apiClient) =>
    getObject<DashboardAlertes>(`${BASE}/alertes`, client),
};
