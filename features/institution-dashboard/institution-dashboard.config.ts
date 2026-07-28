import type { InstitutionRole } from '@/lib/auth/roles.institution';

export type InstitutionKpiId =
    | 'portefeuille_global'
    | 'montant_total_finance'
    | 'nombre_credits'
    | 'encours_credit'
    | 'taux_remboursement'
    | 'taux_retard';

export type InstitutionWidgetId = 'credits' | 'agences' | 'repartition' | 'evolution';

interface InstitutionDashboardConfig {
    kpis: InstitutionKpiId[];
    widgets: InstitutionWidgetId[];
}

const ALL_KPIS: InstitutionKpiId[] = [
    'portefeuille_global',
    'montant_total_finance',
    'nombre_credits',
    'encours_credit',
    'taux_remboursement',
    'taux_retard',
];
const ALL_WIDGETS: InstitutionWidgetId[] = ['credits', 'agences', 'repartition', 'evolution'];

export const INSTITUTION_DASHBOARD_CONFIG: Record<InstitutionRole, InstitutionDashboardConfig> = {
    gestionnaire_microfinance: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
    gestionnaire_banque: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
    agent_credit: {
        kpis: ['nombre_credits', 'taux_retard'],
        widgets: ['credits'],
    },
};

export function getInstitutionDashboardConfig(role: InstitutionRole | undefined): InstitutionDashboardConfig {
    if (!role) return { kpis: [], widgets: [] };
    return INSTITUTION_DASHBOARD_CONFIG[role];
}