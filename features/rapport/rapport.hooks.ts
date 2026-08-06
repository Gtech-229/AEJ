'use client';

import { useMutation } from '@tanstack/react-query';
import { rapportService } from './rapport.service';
import type { FormatExport, PlanifierRapportInput, RapportFiltres } from './rapport.types';

/** Pas de useQuery ici : un rapport se génère à la demande (filtres soumis), ce n'est pas une ressource listée. */
export function useGenererRapport() {
  return useMutation({
    mutationFn: (filtres: RapportFiltres) => rapportService.generer(filtres),
  });
}

export function useExportRapport() {
  return useMutation({
    mutationFn: ({ filtres, format }: { filtres: RapportFiltres; format: FormatExport }) =>
      rapportService.export(filtres, format),
  });
}

export function usePlanifierRapport() {
  return useMutation({
    mutationFn: (input: PlanifierRapportInput) => rapportService.planifier(input),
  });
}
