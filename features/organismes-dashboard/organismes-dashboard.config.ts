import type { OrganismeRole } from '@/lib/auth/roles.organismes';
import { FORCE_ACTEUR } from '@/lib/auth/acteur';

export type OrganismeKpiId =
    | 'portefeuille_global'
    | 'montant_total_finance'
    | 'nombre_credits'
    | 'encours_credit'
    | 'taux_remboursement'
    | 'taux_retard';

export type OrganismeWidgetId = 'credits' | 'agences' | 'repartition' | 'evolution';

interface OrganismeDashboardConfig {
    kpis: OrganismeKpiId[];
    widgets: OrganismeWidgetId[];
}

const ALL_KPIS: OrganismeKpiId[] = [
    'portefeuille_global',
    'montant_total_finance',
    'nombre_credits',
    'encours_credit',
    'taux_remboursement',
    'taux_retard',
];
const ALL_WIDGETS: OrganismeWidgetId[] = ['credits', 'agences', 'repartition', 'evolution'];

export const ORGANISMES_DASHBOARD_CONFIG: Record<OrganismeRole, OrganismeDashboardConfig> = {
    gestionnaire_microfinance: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
    gestionnaire_banque: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
    agent_credit: {
        kpis: ['nombre_credits', 'taux_retard'],
        widgets: ['credits'],
    },
};

export function getOrganismesDashboardConfig(role: OrganismeRole | undefined): OrganismeDashboardConfig {
    // PREVIEW: with a forced profile (lib/auth/acteur.ts), show the full dashboard.
    if (FORCE_ACTEUR) return { kpis: ALL_KPIS, widgets: ALL_WIDGETS };
    if (!role) return { kpis: [], widgets: [] };
    return ORGANISMES_DASHBOARD_CONFIG[role];
}
