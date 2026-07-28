import type { CreateOrganismePayload, Organisme, UpdateOrganismePayload } from './organismes.dto';

/**
 * SIMULATED — intégrations API suspendues (directive du chef d'équipe,
 * 23/07/2026 : "on va pour le moment suspendre les intégrations étant donné
 * que les données continuent de changer au backend"). Store en mémoire
 * uniquement, aucune tentative d'appel réseau.
 *
 * Point de branchement unique pour reconnexion future : remplacer le corps
 * de chaque méthode par un vrai appel `apiClient.request(...)` une fois le
 * contrat confirmé côté backend (route non documentée à ce jour).
 */
const SEED_ORGANISMES: Organisme[] = [
  { id: 1, nom: 'Banque Nationale pour le Développement', sigle: 'BND', type_id: 1, region_id: 1 },
  { id: 2, nom: 'Fonds International Agricole', sigle: 'FIA', type_id: 4, region_id: 1 },
  { id: 3, nom: 'Institut de Microfinance Ivoirien', sigle: 'IMI', type_id: 2, region_id: 2 },
  { id: 4, nom: 'ONG Espoir Jeunesse', sigle: 'OEJ', type_id: 3, region_id: 3 },
];

let store: Organisme[] = [...SEED_ORGANISMES];

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300));
}

export const organismesService = {
  getAll: (): Promise<Organisme[]> => delay([...store]),

  create: (payload: CreateOrganismePayload): Promise<Organisme> => {
    const created: Organisme = { ...payload, sigle: payload.sigle ?? null, id: Date.now() };
    store = [created, ...store];
    return delay(created);
  },

  update: (payload: UpdateOrganismePayload): Promise<Organisme> => {
    store = store.map((o) => (o.id === payload.id ? payload : o));
    return delay(payload);
  },

  remove: (id: number): Promise<void> => {
    store = store.filter((o) => o.id !== id);
    return delay(undefined);
  },
};