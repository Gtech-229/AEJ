import { apiClient } from '@/lib/api/client';
import type { Echeance, EnregistrerPaiementInput } from './remboursement.types';

const BASE_URL = '/credits';

export const remboursementService = {
  listEcheances: (creditId: string): Promise<Echeance[]> =>
    apiClient.get<Echeance[]>(`${BASE_URL}/${creditId}/echeances`),
  enregistrerPaiement: (input: EnregistrerPaiementInput): Promise<Echeance> =>
    apiClient.post<Echeance>(`/echeances/${input.echeanceId}/paiement`, input),
};
