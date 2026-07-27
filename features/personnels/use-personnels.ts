'use client';

import { useState, useCallback, useEffect, } from 'react';
import type {
    Personnel,
    CreatePersonnelInput,
    UpdatePersonnelInput,
    PersonnelListParams,
    PersonnelListResponse,
} from '@/lib/types';

// ─── Enums (doivent correspondre à ceux dans lib/types.ts) ───────────────────

type Poste =
    | 'directeur'
    | 'manager'
    | 'charge_recrutement'
    | 'conseiller_emploi'
    | 'assistant_rh'
    | 'comptable'
    | 'commercial'
    | 'receptionniste'

type Departement =
    | 'recrutement'
    | 'relations_entreprises'
    | 'administration'
    | 'comptabilite'
    | 'direction'
    | 'support'

type TypeContrat = 'cdi' | 'cdd' | 'stage' | 'consultant';
type StatutPersonnel = 'actif' | 'inactif' | 'suspendu' | 'en_conge';
type Sexe = 'M' | 'F';

// ─── Fake data ────────────────────────────────────────────────────────────────

const FAKE_DATA: Personnel[] = [
    {
        id: 1,
        matricule: 'AEJ-001',
        nom: 'Koné',
        prenom: 'Aminata',
        email: 'a.kone@aej.ci',
        telephone: '+225 07 01 23 45 67',
        poste: 'directeur_general' as Poste,
        departement: 'direction_generale' as Departement,
        typeContrat: 'cdi',
        statut: 'actif',
        dateEmbauche: '2020-01-01',
        dateNaissance: '1985-03-15',
        sexe: 'F',
        salaire: 1500000,
        adresse: 'Cocody, Abidjan',
        createdAt: '2020-01-01T08:00:00Z',
    },
    {
        id: 2,
        matricule: 'AEJ-002',
        nom: 'Diallo',
        prenom: 'Moussa',
        email: 'm.diallo@aej.ci',
        telephone: '+225 07 02 34 56 78',
        poste: 'chef_service' as Poste,
        departement: 'dpf' as Departement,
        typeContrat: 'cdi',
        statut: 'actif',
        dateEmbauche: '2021-03-15',
        dateNaissance: '1980-07-22',
        sexe: 'M',
        salaire: 900000,
        adresse: 'Plateau, Abidjan',
        createdAt: '2021-03-15T08:00:00Z',
    },
    {
        id: 3,
        matricule: 'AEJ-003',
        nom: 'Touré',
        prenom: 'Fatoumata',
        email: 'f.toure@aej.ci',
        telephone: '+225 07 03 45 67 89',
        poste: 'cip' as Poste,
        departement: 'agence_abidjan' as Departement,
        typeContrat: 'cdi',
        statut: 'actif',
        dateEmbauche: '2022-06-01',
        dateNaissance: '1990-11-08',
        sexe: 'F',
        salaire: 650000,
        adresse: 'Yopougon, Abidjan',
        createdAt: '2022-06-01T08:00:00Z',
    },
    {
        id: 4,
        matricule: 'AEJ-004',
        nom: 'Bamba',
        prenom: 'Seydou',
        email: 's.bamba@aej.ci',
        telephone: '+225 07 04 56 78 90',
        poste: 'analyste_financier' as Poste,
        departement: 'dpf' as Departement,
        typeContrat: 'cdi',
        statut: 'actif',
        dateEmbauche: '2021-09-01',
        dateNaissance: '1988-05-14',
        sexe: 'M',
        salaire: 850000,
        adresse: 'Marcory, Abidjan',
        createdAt: '2021-09-01T08:00:00Z',
    },
    {
        id: 5,
        matricule: 'AEJ-005',
        nom: 'Coulibaly',
        prenom: 'Mariam',
        email: 'm.coulibaly@aej.ci',
        telephone: '+225 07 05 67 89 01',
        poste: 'responsable_communication' as Poste,
        departement: 'service_communication' as Departement,
        typeContrat: 'cdd',
        statut: 'actif',
        dateEmbauche: '2024-01-01',
        dateNaissance: '1992-01-30',
        sexe: 'F',
        salaire: 550000,
        adresse: 'Treichville, Abidjan',
        createdAt: '2024-01-01T08:00:00Z',
    },
    {
        id: 6,
        matricule: 'AEJ-006',
        nom: 'Traoré',
        prenom: 'Ibrahim',
        email: 'i.traore@aej.ci',
        telephone: '+225 07 06 78 90 12',
        poste: 'chef_agence' as Poste,
        departement: 'agence_bouake' as Departement,
        typeContrat: 'cdd',
        statut: 'actif',
        dateEmbauche: '2020-04-01',
        dateNaissance: '1987-09-17',
        sexe: 'M',
        salaire: 780000,
        adresse: 'Bouaké',
        createdAt: '2020-04-01T08:00:00Z',
    },
    {
        id: 7,
        matricule: 'AEJ-007',
        nom: 'Sylla',
        prenom: 'Kadiatou',
        email: 'k.sylla@aej.ci',
        telephone: '+225 07 07 89 01 23',
        poste: 'comptable' as Poste,
        departement: 'service_comptabilite' as Departement,
        typeContrat: 'cdd',
        statut: 'en_conge',
        dateEmbauche: '2022-10-01',
        dateNaissance: '1993-12-25',
        sexe: 'F',
        salaire: 500000,
        adresse: 'Adjamé, Abidjan',
        createdAt: '2022-10-01T08:00:00Z',
    },
    {
        id: 8,
        matricule: 'AEJ-008',
        nom: 'Ouattara',
        prenom: 'Youssouf',
        email: 'y.ouattara@aej.ci',
        telephone: '+225 07 08 90 12 34',
        poste: 'informaticien' as Poste,
        departement: 'dsi' as Departement,
        typeContrat: 'stage',
        statut: 'actif',
        dateEmbauche: '2023-02-15',
        dateNaissance: '1995-06-03',
        sexe: 'M',
        salaire: 600000,
        adresse: 'Cocody, Abidjan',
        createdAt: '2023-02-15T08:00:00Z',
    },
    {
        id: 9,
        matricule: 'AEJ-009',
        nom: 'Cissé',
        prenom: 'Oumou',
        email: 'o.cisse@aej.ci',
        telephone: '+225 07 09 01 23 45',
        poste: 'agent_aej' as Poste,
        departement: 'agence_korhogo' as Departement,
        typeContrat: 'consultant',
        statut: 'suspendu',
        dateEmbauche: '2021-07-01',
        dateNaissance: '1991-08-11',
        sexe: 'F',
        salaire: 350000,
        adresse: 'Korhogo',
        createdAt: '2021-07-01T08:00:00Z',
    },
    {
        id: 10,
        matricule: 'AEJ-010',
        nom: 'Fofana',
        prenom: 'Bakary',
        email: 'b.fofana@aej.ci',
        telephone: '+225 07 00 12 34 56',
        poste: 'sous_directeur' as Poste,
        departement: 'direction_operations' as Departement,
        typeContrat: 'stage',
        statut: 'actif',
        dateEmbauche: '2020-02-01',
        dateNaissance: '1989-04-19',
        sexe: 'M',
        salaire: 1100000,
        adresse: 'Riviera, Abidjan',
        createdAt: '2020-02-01T08:00:00Z',
    },
    {
        id: 11,
        matricule: 'AEJ-011',
        nom: "N'Guessan",
        prenom: 'Koffi',
        email: 'k.nguessan@aej.ci',
        telephone: '+225 05 01 23 45 67',
        poste: 'directeur' as Poste,
        departement: 'service_monitoring' as Departement,
        typeContrat: 'consultant',
        statut: 'actif',
        dateEmbauche: '2019-10-01',
        dateNaissance: '1986-02-14',
        sexe: 'M',
        salaire: 1200000,
        adresse: 'Plateau, Abidjan',
        createdAt: '2019-10-01T08:00:00Z',
    },
    {
        id: 12,
        matricule: 'AEJ-012',
        nom: 'Barry',
        prenom: 'Aissatou',
        email: 'a.barry@aej.ci',
        telephone: '+225 05 02 34 56 78',
        poste: 'assistante_direction' as Poste,
        departement: 'direction_generale' as Departement,
        typeContrat: 'cdd',
        statut: 'actif',
        dateEmbauche: '2023-06-01',
        dateNaissance: '1994-07-05',
        sexe: 'F',
        salaire: 420000,
        adresse: 'Cocody, Abidjan',
        createdAt: '2023-06-01T08:00:00Z',
    },
    {
        id: 13,
        matricule: 'AEJ-013',
        nom: 'Diabaté',
        prenom: 'Souleymane',
        email: 's.diabate@aej.ci',
        telephone: '+225 05 03 45 67 89',
        poste: 'auditeur' as Poste,
        departement: 'direction_generale' as Departement,
        typeContrat: 'consultant',
        statut: 'actif',
        dateEmbauche: '2018-05-01',
        dateNaissance: '1983-11-28',
        sexe: 'M',
        salaire: 950000,
        adresse: 'Marcory, Abidjan',
        createdAt: '2018-05-01T08:00:00Z',
    },
    {
        id: 14,
        matricule: 'AEJ-014',
        nom: 'Konaté',
        prenom: 'Rokiatou',
        email: 'r.konate@aej.ci',
        telephone: '+225 05 04 56 78 90',
        poste: 'cip' as Poste,
        departement: 'agence_san_pedro' as Departement,
        typeContrat: 'cdi',
        statut: 'actif',
        dateEmbauche: '2023-09-01',
        dateNaissance: '1996-03-20',
        sexe: 'F',
        salaire: 420000,
        adresse: 'San Pedro',
        createdAt: '2023-09-01T08:00:00Z',
    },
    {
        id: 15,
        matricule: 'AEJ-015',
        nom: 'Sanogo',
        prenom: 'Drissa',
        email: 'd.sanogo@aej.ci',
        telephone: '+225 05 05 67 89 01',
        poste: 'agent_aej' as Poste,
        departement: 'agence_abidjan' as Departement,
        typeContrat: 'stage',
        statut: 'inactif',
        dateEmbauche: '2024-03-01',
        dateNaissance: '1990-09-02',
        sexe: 'M',
        salaire: 380000,
        adresse: 'Abobo, Abidjan',
        createdAt: '2024-03-01T08:00:00Z',
    },
];

// ─── Store en mémoire ─────────────────────────────────────────────────────────

let store: Personnel[] = [...FAKE_DATA];
let nextIdNum = store.length + 1;

function nextId(): number {
    return store.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function nextMatricule() {
    nextIdNum += 1;
    return `AEJ-${String(nextIdNum).padStart(3, '0')}`;
}

function applyFilters(params: PersonnelListParams): Personnel[] {
    let result = [...store];

    if (params.q) {
        const q = params.q.toLowerCase();
        result = result.filter(p =>
            p.nom.toLowerCase().includes(q) ||
            p.prenom.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.matricule.toLowerCase().includes(q),
        );
    }

    if (params.departement) {
        result = result.filter(p => p.departement === params.departement);
    }

    if (params.statut) {
        result = result.filter(p => p.statut === params.statut);
    }

    return result;
}

// ─── usePersonnelList ─────────────────────────────────────────────────────────

export function usePersonnelList(params: PersonnelListParams = {}) {
    const [response, setResponse] = useState<PersonnelListResponse>({
        data: [],
        total: 0,
        page: params.page ?? 1,
        size: params.size ?? 20,
    });
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            const filtered = applyFilters(params);
            const page = params.page ?? 1;
            const size = params.size ?? 20;
            const start = (page - 1) * size;
            const paginated = filtered.slice(start, start + size);

            setResponse({
                data: paginated,
                total: filtered.length,
                page,
                size,
            });
            setIsLoading(false);
        }, 400);
    }, [JSON.stringify(params)]);

    useEffect(() => {
        load();
    }, [load]);


    return { data: response, isLoading, refetch: load };
}

// ─── useCreatePersonnel ────────────────────────────────────────────────────────

export function useCreatePersonnel() {
    const [isPending, setIsPending] = useState(false);

    const mutateAsync = useCallback(async (input: CreatePersonnelInput): Promise<Personnel> => {
        setIsPending(true);
        await new Promise(r => setTimeout(r, 350));

        const now = new Date().toISOString();
        const created: Personnel = {
            ...input,
            id: nextId(),
            matricule: nextMatricule(),
            createdAt: now,
            updatedAt: now,
        };

        store = [created, ...store];
        setIsPending(false);
        return created;
    }, []);

    return { mutateAsync, isPending };
}

// ─── useUpdatePersonnel ────────────────────────────────────────────────────────

export function useUpdatePersonnel() {
    const [isPending, setIsPending] = useState(false);

    const mutateAsync = useCallback(async (input: UpdatePersonnelInput): Promise<Personnel> => {
        setIsPending(true);
        await new Promise(r => setTimeout(r, 350));

        const { id, ...changes } = input;
        let updated: Personnel | undefined;

        store = store.map(p => {
            if (p.id !== id) return p;
            updated = { ...p, ...changes, updatedAt: new Date().toISOString() };
            return updated;
        });

        setIsPending(false);

        if (!updated) throw new Error(`Personnel ${id} introuvable`);
        return updated;
    }, []);

    return { mutateAsync, isPending };
}

// ─── useDeletePersonnel ────────────────────────────────────────────────────────

export function useDeletePersonnel() {
    const [isPending, setIsPending] = useState(false);

    const mutate = useCallback((id: number) => {
        setIsPending(true);
        setTimeout(() => {
            store = store.filter(p => p.id !== id);
            setIsPending(false);
        }, 300);
    }, []);

    return { mutate, isPending };
}