import type { StageStatut } from './stages.constants';

export interface Stage {
    id: string;
    intitule: string;
    description?: string;
    nombrePlaces: number;
    dateDebut: string;
    dateFin: string;
    remuneration?: number;
    statut: StageStatut;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateStageInput = Omit<Stage, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStageInput = Partial<CreateStageInput> & { id: string };

export interface StageListParams {
    page?: number;
    size?: number;
    q?: string;
    statut?: StageStatut;
}

export interface StageListResponse {
    data: Stage[];
    total: number;
    page: number;
    size: number;
}