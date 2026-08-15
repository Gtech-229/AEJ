import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toNumber } from '@/lib/number';
import type { Budget, Remboursement } from '@/features/financements/financements.dto';
import type { Embauche } from '@/features/embauches/embauches.dto';

/**
 * Interim dashboard metrics — computed from existing list endpoints until a
 * dedicated `GET /dashboard/stats` exists (see backend-asks). Efficiency:
 *  - COUNTS use the paginator `total` (a `?per_page=1` request — one tiny row),
 *    never the full 10k list;
 *  - SUMS/rates come from the modest financing lists, aggregated client-side.
 * Trends (period-over-period) have no interim source and stay out.
 */
export interface DashboardStats {
  jeunes: number;
  microProjets: number;
  montantFinance: number;
  tauxRemboursement: number; // %
  emploisCrees: number;
  remboursementsEnRetard: number;
  budgetsAValider: number;
}

/** Read a Laravel paginator's `total` without pulling the rows. */
/** The paginator's `total` — endpoints put it at the top level (`promoteurs`)
 *  or under a `pagination` / `meta` object (`projets`). Read all three. */
async function countVia(
  path: string,
  init: Parameters<ApiClient['request']>[1],
  client: ApiClient,
): Promise<number> {
  const res = await client.request<{
    total?: number;
    pagination?: { total?: number };
    meta?: { total?: number };
  }>(path, init);
  return res?.total ?? res?.pagination?.total ?? res?.meta?.total ?? 0;
}

async function listData<T>(path: string, client: ApiClient): Promise<T[]> {
  const res = await client.request<{ data: T[] }>(path);
  return Array.isArray(res?.data) ? res.data : [];
}

export const dashboardService = {
  getStats: async (client: ApiClient = apiClient): Promise<DashboardStats> => {
    const [microProjets, jeunes, budgets, remboursements, embauches] = await Promise.all([
      countVia('/projets?per_page=1', undefined, client),
      countVia('/promoteurs/filter-with-projects?per_page=1', { method: 'POST', body: {} }, client),
      listData<Budget>('/budgets', client),
      listData<Remboursement>('/remboursements', client),
      listData<Embauche>('/embauches?per_page=200', client),
    ]);

    const num = (v: string | number | null | undefined) => toNumber(v) ?? 0;
    const montantFinance = budgets
      .filter((b) => b.statut === 'APPROUVE')
      .reduce((s, b) => s + num(b.montant_accorde), 0);
    const totalEchu = remboursements.reduce((s, r) => s + num(r.montant_echu), 0);
    const totalPaye = remboursements.reduce((s, r) => s + num(r.montant_paye), 0);

    return {
      jeunes,
      microProjets,
      montantFinance,
      tauxRemboursement: totalEchu > 0 ? Math.round((totalPaye / totalEchu) * 100) : 0,
      emploisCrees: embauches.length,
      remboursementsEnRetard: remboursements.filter((r) => num(r.montant_impaye) > 0).length,
      budgetsAValider: budgets.filter((b) => b.statut === 'EN_ATTENTE').length,
    };
  },
};
