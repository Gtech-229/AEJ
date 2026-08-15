'use client';

import { useQuery } from '@tanstack/react-query';
import { localitesKeys } from './localites.keys';
import { localitesService } from './localites.service';

// Geographic referentials change rarely → keep them warm across the session.
const STALE = 30 * 60 * 1000;

export const useDivisionsRegionales = () =>
  useQuery({
    queryKey: localitesKeys.divisionsRegionales(),
    queryFn: () => localitesService.divisionsRegionales(),
    staleTime: STALE,
  });

export const useVilles = () =>
  useQuery({
    queryKey: localitesKeys.villes(),
    queryFn: () => localitesService.villes(),
    staleTime: STALE,
  });

export const useCommunes = () =>
  useQuery({
    queryKey: localitesKeys.communes(),
    queryFn: () => localitesService.communes(),
    staleTime: STALE,
  });

export const useLieuxHabitation = () =>
  useQuery({
    queryKey: localitesKeys.lieuxHabitation(),
    queryFn: () => localitesService.lieuxHabitation(),
    staleTime: STALE,
  });
