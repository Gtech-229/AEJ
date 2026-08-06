import { apiClient } from '@/lib/api/client';
import type { FormatExport, PlanifierRapportInput, RapportFiltres, RapportResultat } from './rapport.types';

const BASE_URL = '/rapports';

export const rapportService = {
  generer: (filtres: RapportFiltres): Promise<RapportResultat> =>
    apiClient.post<RapportResultat>(`${BASE_URL}/generer`, filtres),
  export: (filtres: RapportFiltres, format: FormatExport): Promise<Blob> =>
    apiClient.post<Blob>(`${BASE_URL}/export`, { ...filtres, format }),
  planifier: (input: PlanifierRapportInput): Promise<void> =>
    apiClient.post<void>(`${BASE_URL}/planifier`, input),
};
