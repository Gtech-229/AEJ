import type { UserRole } from '@/lib/auth/roles';

export type KpiId =
    | 'stagiaires'
    | 'stages_cours'
    | 'stages_acheves'
    | 'emplois'
    | 'taux_insertion'
    | 'budget_consomme';

export type WidgetId =
    | 'evolution'
    | 'regions'
    | 'secteurs'
    | 'actions_rapides'
    | 'top_entreprises'
    | 'alertes';

interface RoleDashboardConfig {
    kpis: KpiId[];
    widgets: WidgetId[];
}

const ALL_KPIS: KpiId[] = [
    'stagiaires',
    'stages_cours',
    'stages_acheves',
    'emplois',
    'taux_insertion',
    'budget_consomme',
];
const ALL_WIDGETS: WidgetId[] = [
    'evolution',
    'regions',
    'secteurs',
    'actions_rapides',
    'top_entreprises',
    'alertes',
];


export const DASHBOARD_CONFIG: Record<UserRole, RoleDashboardConfig> = {
    admin_general: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
    directeur_general: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },

    directeur_finances: {
        kpis: ['budget_consomme'],
        widgets: ['top_entreprises', 'alertes'],
    },
    directeur_suivi_evaluation: {
        kpis: ALL_KPIS,
        widgets: ['evolution', 'regions', 'secteurs', 'alertes'],
    },
    directeur_si: {
        
        kpis: [],
        widgets: [],
    },

    comptable: {
        kpis: ['budget_consomme'],
        widgets: ['top_entreprises'],
    },
    analyste: {
        kpis: ALL_KPIS,
        widgets: ['evolution', 'regions', 'secteurs'],
    },
    auditeur: {
        kpis: ALL_KPIS,
        widgets: ALL_WIDGETS,
    },
};

export function getDashboardConfig(role: UserRole | undefined): RoleDashboardConfig {
    if (!role) return { kpis: [], widgets: [] };
    return DASHBOARD_CONFIG[role];
}