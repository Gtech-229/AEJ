'use client';

import { useQuery } from '@tanstack/react-query';
import { referentialsKeys } from './referentials.keys';
import { referentialsService } from './referentials.service';

// Referentials rarely change → keep them warm.
const STALE = 10 * 60 * 1000;

export const useSecteurs = () =>
  useQuery({ queryKey: referentialsKeys.list('secteurs'), queryFn: referentialsService.secteurs, staleTime: STALE });

export const useSousSecteurs = () =>
  useQuery({ queryKey: referentialsKeys.list('sous-secteurs'), queryFn: referentialsService.sousSecteurs, staleTime: STALE });

export const useNiveauxEtudes = () =>
  useQuery({ queryKey: referentialsKeys.list('niveaux-etudes'), queryFn: referentialsService.niveauxEtudes, staleTime: STALE });

export const useAgencesRegionales = () =>
  useQuery({ queryKey: referentialsKeys.list('agences-regionales'), queryFn: referentialsService.agencesRegionales, staleTime: STALE });

export const useTypesPiecesIdentites = () =>
  useQuery({ queryKey: referentialsKeys.list('types-pieces-identites'), queryFn: referentialsService.typesPiecesIdentites, staleTime: STALE });

export const useSituationsMatrimoniales = () =>
  useQuery({ queryKey: referentialsKeys.list('situations-matrimoniales'), queryFn: referentialsService.situationsMatrimoniales, staleTime: STALE });
