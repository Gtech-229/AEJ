import type { EntrepriseRole } from '@/lib/auth/roles.entreprise';

export type EntrepriseKpiId =
    | 'projets_finances'
    | 'financements_obtenus'
    | 'stages_proposes'
    | 'emplois_crees'
    | 'taux_recrutement';

export type EntrepriseWidgetId = 'evolution' | 'repartition' | 'activite';

interface EntrepriseDashboardConfig {
    kpis: EntrepriseKpiId[];
    widgets: EntrepriseWidgetId[];
}

const ALL_KPIS: EntrepriseKpiId[] = [
    'projets_finances',
    'financements_obtenus',
    'stages_proposes',
    'emplois_crees',
    'taux_recrutement',
];
const ALL_WIDGETS: EntrepriseWidgetId[] = ['evolution', 'repartition', 'activite'];

export const ENTREPRISE_DASHBOARD_CONFIG: Record<EntrepriseRole, EntrepriseDashboardConfig> = {
    responsable_entreprise: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
};

export function getEntrepriseDashboardConfig(role: EntrepriseRole | undefined): EntrepriseDashboardConfig {
    if (!role) return { kpis: [], widgets: [] };
    return ENTREPRISE_DASHBOARD_CONFIG[role];
}