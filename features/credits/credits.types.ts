export type CreditStatut = 'actif' | 'solde' | 'retard';

export interface Credit {
    id: string;
    code: string;
    beneficiaire: string;
    montant: number;
    montantRembourse: number;
    tauxInteret: number;
    dateOctroi: string;
    dateEcheance: string;
    statut: CreditStatut;
    agenceId?: string;
}

export interface CreditListParams {
    page?: number;
    size?: number;
    q?: string;
    statut?: CreditStatut;
}

export interface CreditListResponse {
    data: Credit[];
    total: number;
    page: number;
    size: number;
}