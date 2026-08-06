export type StatutWorkflow =
  | 'instruction'
  | 'plan_affaires'
  | 'transmission_partenaire'
  | 'traitement_partenaire'
  | 'suivi_exploitation';

export type CreditStatut = 'actif' | 'solde' | 'retard';


export interface Credit {
  id: string;
  beneficiaireId: number;
  code: string;
  banque: string;
  agence: string;
  montantFinance: number;
  montantRembourse: number;
  soldeRestant: number;
  tauxRemboursement: number;
  dateDecaissement: string;
  statutWorkflow: StatutWorkflow;
  statutCredit: CreditStatut;
  joursDansEtape: number;
  echeanceEnRetard?: { mois: string; jours: number };
}

export interface CreditListParams {
  page?: number;
  size?: number;
  beneficiaireId?: number;
  banque?: string;
  statutWorkflow?: StatutWorkflow;
  statutCredit?: CreditStatut;
}

export interface CreditListResponse {
  data: Credit[];
  total: number;
  page: number;
  size: number;
}
