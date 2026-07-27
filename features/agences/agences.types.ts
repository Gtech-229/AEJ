import type { AgenceStatut } from './agences.constants';

export interface Agence {
    id: number;
    nom: string;
    ville: string;
    adresse?: string;
    telephone?: string;
    responsable: string;
    nbEmployes: number;
    statut: AgenceStatut;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateAgenceInput = Omit<Agence, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAgenceInput = Partial<CreateAgenceInput> & { id: number };

export interface AgenceListParams {
    page?: number;
    size?: number;
    q?: string;
    statut?: AgenceStatut;
}

export interface AgenceListResponse {
    data: Agence[];
    total: number;
    page: number;
    size: number;
}