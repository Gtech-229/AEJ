'use client';

import { useCallback, useEffect, useState } from 'react';

export type TypeOrganisme = 'banque' | 'sfd' | 'fonds_garantie';
export type StatutOrganisme = 'actif' | 'inactif';

export interface OrganismePartenaire {
  id: number;
  nom: string;
  type: TypeOrganisme;
  contact: string;
  email: string;
  telephone: string;
  dossiersActifs: number;
  statut: StatutOrganisme;
}

export type OrganismeFormValues = Omit<OrganismePartenaire, 'id' | 'dossiersActifs'>;

const FAKE_DATA: OrganismePartenaire[] = [
  { id: 1, nom: 'Ecobank', type: 'banque', contact: 'Jean Kacou', email: 'contact@ecobank.ci', telephone: '+225 27 20 00 00 00', dossiersActifs: 312, statut: 'actif' },
  { id: 2, nom: 'NSIA Banque', type: 'banque', contact: 'Aya Brou', email: 'contact@nsia.ci', telephone: '+225 27 20 11 11 11', dossiersActifs: 245, statut: 'actif' },
  { id: 3, nom: 'BOA Côte d\'Ivoire', type: 'banque', contact: 'Ibrahim Sylla', email: 'contact@boaci.ci', telephone: '+225 27 20 22 22 22', dossiersActifs: 198, statut: 'actif' },
  { id: 4, nom: 'SGCI', type: 'banque', contact: 'Marie Yao', email: 'contact@sgci.ci', telephone: '+225 27 20 33 33 33', dossiersActifs: 87, statut: 'actif' },
  { id: 5, nom: 'Advans CI', type: 'sfd', contact: 'Kader Traoré', email: 'contact@advans.ci', telephone: '+225 27 21 00 00 00', dossiersActifs: 56, statut: 'inactif' },
  { id: 6, nom: 'Fonds de Garantie AEJ', type: 'fonds_garantie', contact: 'Direction Finances', email: 'fga@aej.ci', telephone: '+225 27 22 00 00 00', dossiersActifs: 900, statut: 'actif' },
];

let store: OrganismePartenaire[] = [...FAKE_DATA];

function nextId(): number {
  return store.reduce((max, o) => Math.max(max, o.id), 0) + 1;
}

export function useOrganismesList() {
  const [data, setData] = useState<OrganismePartenaire[]>(store);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setData([...store]);
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, refetch: load };
}

export function useCreateOrganisme() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = useCallback(async (input: OrganismeFormValues): Promise<OrganismePartenaire> => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 300));
    const created: OrganismePartenaire = { ...input, id: nextId(), dossiersActifs: 0 };
    store = [created, ...store];
    setIsPending(false);
    return created;
  }, []);
  return { mutateAsync, isPending };
}

export function useUpdateOrganisme() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = useCallback(async (input: Partial<OrganismePartenaire> & { id: number }): Promise<OrganismePartenaire> => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 300));
    const { id, ...changes } = input;
    let updated: OrganismePartenaire | undefined;
    store = store.map((o) => {
      if (o.id !== id) return o;
      updated = { ...o, ...changes };
      return updated;
    });
    setIsPending(false);
    if (!updated) throw new Error(`Organisme ${id} introuvable`);
    return updated;
  }, []);
  return { mutateAsync, isPending };
}

export function useDeleteOrganisme() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback((id: number) => {
    setIsPending(true);
    setTimeout(() => {
      store = store.filter((o) => o.id !== id);
      setIsPending(false);
    }, 300);
  }, []);
  return { mutate, isPending };
}
