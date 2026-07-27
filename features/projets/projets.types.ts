import type { ProjetStatut } from './projets.constants';

export interface Projet {
    id: number;
    code: string;
    intitule: string;
    montantFinance: number;
    dateDebut: string;
    dateFin?: string;
    statut: ProjetStatut;
}

export interface ProjetListParams {
    page?: number;
    size?: number;
    q?: string;
    statut?: ProjetStatut;
}

export interface ProjetListResponse {
    data: Projet[];
    total: number;
    page: number;
    size: number;
}