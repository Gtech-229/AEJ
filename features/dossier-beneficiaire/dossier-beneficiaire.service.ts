import { apiClient } from '@/lib/api/client';
import type { DossierBeneficiaire } from './dossier-beneficiaire.types';

const BASE_URL = '/beneficiaires';

export const dossierBeneficiaireService = {
  get: (beneficiaireId: number): Promise<DossierBeneficiaire> =>
    apiClient.get<DossierBeneficiaire>(`${BASE_URL}/${beneficiaireId}/dossier`),
};
