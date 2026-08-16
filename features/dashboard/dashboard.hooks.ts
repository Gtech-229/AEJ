'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from './dashboard.service';

// Dashboard metrics change slowly → keep them warm.
const STALE = 5 * 60 * 1000;

export const useDashboardKpis = () =>
  useQuery({ queryKey: ['dashboard', 'kpis'], queryFn: () => dashboardService.getKpis(), staleTime: STALE });

export const useDashboardProjetsStatut = () =>
  useQuery({
    queryKey: ['dashboard', 'projets-statut'],
    queryFn: () => dashboardService.getProjetsStatut(),
    staleTime: STALE,
  });

export const useDashboardAlertes = () =>
  useQuery({ queryKey: ['dashboard', 'alertes'], queryFn: () => dashboardService.getAlertes(), staleTime: STALE });

export const useDashboardProjetsAgence = () =>
  useQuery({
    queryKey: ['dashboard', 'projets-agence'],
    queryFn: () => dashboardService.getProjetsAgence(),
    staleTime: STALE,
  });

export const useDashboardFinancementAgence = () =>
  useQuery({
    queryKey: ['dashboard', 'financement-agence'],
    queryFn: () => dashboardService.getFinancementAgence(),
    staleTime: STALE,
  });

export const useDashboardClassement = () =>
  useQuery({
    queryKey: ['dashboard', 'classement'],
    queryFn: () => dashboardService.getClassement(),
    staleTime: STALE,
  });
