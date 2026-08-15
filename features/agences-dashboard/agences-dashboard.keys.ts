export const agencesDashboardKeys = {
  all: ['agences-dashboard'] as const,
  kpis: () => [...agencesDashboardKeys.all, 'kpis'] as const,
  alertes: () => [...agencesDashboardKeys.all, 'alertes'] as const,
  projetsStatut: () => [...agencesDashboardKeys.all, 'projets-statut'] as const,
  projetsAgence: () => [...agencesDashboardKeys.all, 'projets-agence'] as const,
  financementAgence: () => [...agencesDashboardKeys.all, 'financement-agence'] as const,
  classement: () => [...agencesDashboardKeys.all, 'classement'] as const,
};
