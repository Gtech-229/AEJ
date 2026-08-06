'use client';

import { useQuery } from '@tanstack/react-query';
import { dossierBeneficiaireService } from './dossier-beneficiaire.service';

export const dossierBeneficiaireKeys = {
  all: ['dossier-beneficiaire'] as const,
  detail: (beneficiaireId: number) => [...dossierBeneficiaireKeys.all, beneficiaireId] as const,
};

/** Lecture seule — un dossier agrège un bénéficiaire et ses crédits, rien ne se crée ici. */
export function useDossierBeneficiaire(beneficiaireId: number) {
  return useQuery({
    queryKey: dossierBeneficiaireKeys.detail(beneficiaireId),
    queryFn: () => dossierBeneficiaireService.get(beneficiaireId),
    enabled: !!beneficiaireId,
  });
}
