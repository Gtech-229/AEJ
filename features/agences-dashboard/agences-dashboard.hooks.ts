'use client';

import { useQuery } from '@tanstack/react-query';
import { agencesDashboardKeys } from './agences-dashboard.keys';
import { agencesDashboardService } from './agences-dashboard.service';

const STALE = 5 * 60 * 1000; // reporting data — doesn't need to be live-fresh

export function useAgencesKpis() {
  return useQuery({
    queryKey: agencesDashboardKeys.kpis(),
    queryFn: () => agencesDashboardService.kpis(),
    staleTime: STALE,
  });
}

export function useAgencesAlertes() {
  return useQuery({
    queryKey: agencesDashboardKeys.alertes(),
    queryFn: () => agencesDashboardService.alertes(),
    staleTime: STALE,
  });
}

export function useProjetsStatut() {
  return useQuery({
    queryKey: agencesDashboardKeys.projetsStatut(),
    queryFn: () => agencesDashboardService.projetsStatut(),
    staleTime: STALE,
  });
}

export function useProjetsAgence() {
  return useQuery({
    queryKey: agencesDashboardKeys.projetsAgence(),
    queryFn: () => agencesDashboardService.projetsAgence(),
    staleTime: STALE,
  });
}

export function useFinancementAgence() {
  return useQuery({
    queryKey: agencesDashboardKeys.financementAgence(),
    queryFn: () => agencesDashboardService.financementAgence(),
    staleTime: STALE,
  });
}

export function useClassementAgences() {
  return useQuery({
    queryKey: agencesDashboardKeys.classement(),
    queryFn: () => agencesDashboardService.classement(),
    staleTime: STALE,
  });
}
