import type { Beneficiaire } from '../beneficiaires/beneficiaires.types';
import type { Credit } from '../credits/credits.types';

export interface DossierBeneficiaire {
  beneficiaire: Beneficiaire;
  credits: Credit[];
}
