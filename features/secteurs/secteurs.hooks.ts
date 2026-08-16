'use client';

import { useQuery } from '@tanstack/react-query';
import { secteursKeys } from './secteurs.keys';
import { secteursService } from './secteurs.service';

// Referentials change rarely → keep them warm across the session.
const STALE = 30 * 60 * 1000;

export const useSecteurs = () =>
  useQuery({
    queryKey: secteursKeys.secteurs(),
    queryFn: () => secteursService.secteurs(),
    staleTime: STALE,
  });

export const useSousSecteurs = () =>
  useQuery({
    queryKey: secteursKeys.sousSecteurs(),
    queryFn: () => secteursService.sousSecteurs(),
    staleTime: STALE,
  });
