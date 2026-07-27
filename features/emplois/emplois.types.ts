import type { EmploiStatut, EmploiTypeContrat } from './emplois.constants';

export interface Emploi {
    id: number;
    intitule: string;
    description?: string;
    typeContrat: EmploiTypeContrat;
    salaire?: number;
    datePublication: string;
    statut: EmploiStatut;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateEmploiInput = Omit<Emploi, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmploiInput = Partial<CreateEmploiInput> & { id: number };

export interface EmploiListParams {
    page?: number;
    size?: number;
    q?: string;
    statut?: EmploiStatut;
}

export interface EmploiListResponse {
    data: Emploi[];
    total: number;
    page: number;
    size: number;
}