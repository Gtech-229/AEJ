export type BeneficiaireSexe = 'M' | 'F';

export interface Beneficiaire {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    sexe: BeneficiaireSexe;
    region: string;
    secteurActivite: string;
    nombreCredits: number;
    montantTotalFinance: number;
}

export interface BeneficiaireListParams {
    page?: number;
    size?: number;
    q?: string;
    region?: string;
}

export interface BeneficiaireListResponse {
    data: Beneficiaire[];
    total: number;
    page: number;
    size: number;
}