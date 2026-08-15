'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from './dashboard.service';

/** Interim dashboard KPIs computed from list endpoints (see dashboard.service). */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000, // metrics change slowly — keep them warm
  });
}
