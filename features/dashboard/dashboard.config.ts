import type { UserRole } from '@/lib/auth/roles';
import { FORCE_ACTEUR } from '@/lib/auth/acteur';

export type KpiId =
    | 'jeunes'
    | 'micro_projets'
    | 'montant_finance'
    | 'taux_remboursement'
    | 'emplois_crees'
    | 'taux_insertion';

export type WidgetId =
    | 'evolution'
    | 'regions'
    | 'secteurs'
    | 'actions_rapides'
    | 'top_organismes'
    | 'alertes';

interface RoleDashboardConfig {
    kpis: KpiId[];
    widgets: WidgetId[];
}

const ALL_KPIS: KpiId[] = [
    'jeunes',
    'micro_projets',
    'montant_finance',
    'taux_remboursement',
    'emplois_crees',
    'taux_insertion',
];
const ALL_WIDGETS: WidgetId[] = [
    'evolution',
    'regions',
    'secteurs',
    'actions_rapides',
    'top_organismes',
    'alertes',
];

export const DASHBOARD_CONFIG: Record<UserRole, RoleDashboardConfig> = {
    admin_general: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },
    directeur_general: { kpis: ALL_KPIS, widgets: ALL_WIDGETS },

    directeur_finances: {
        kpis: ['montant_finance', 'taux_remboursement', 'micro_projets'],
        widgets: ['evolution', 'top_organismes', 'alertes'],
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
        kpis: ['montant_finance', 'taux_remboursement'],
        widgets: ['top_organismes'],
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
    // PREVIEW: with a forced profile (lib/auth/acteur.ts), show the full dashboard.
    if (FORCE_ACTEUR) return { kpis: ALL_KPIS, widgets: ALL_WIDGETS };
    if (!role) return { kpis: [], widgets: [] };
    return DASHBOARD_CONFIG[role];
}
