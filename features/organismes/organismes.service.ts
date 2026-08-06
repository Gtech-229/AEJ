import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';

import type {
  CreateOrganismePayload,
  Organisme,
  UpdateOrganismePayload,
} from './organismes.dto';

const BASE_URL = '/organismes';

// ---------------------------------------------------------------------------
// Type d'enveloppe utilisé par l'API (voir bug KPI Localités : l'API ne
// renvoie jamais un tableau/objet brut mais toujours { Message, data }).
// ---------------------------------------------------------------------------

interface ApiEnvelope<T> {
  Message: string;
  data: T;
}

// ---------------------------------------------------------------------------
// Fallback développement (à supprimer lorsque le problème CORS sera résolu)
// ---------------------------------------------------------------------------

const isDev = process.env.NODE_ENV !== 'production';

const SEED_ORGANISMES: Organisme[] = [
  {
    id: 1,
    nom: 'Agence Jeunesse Développement',
    sigle: 'AJD',
    type: 1,
    adresse: 'Abidjan',
    telephone: '+2250102030405',
    email: 'contact@ajd.org',
    site_web: 'https://ajd.org',
    description: 'Organisme d’accompagnement des jeunes',
  },
];

let devStore: Organisme[] | null = null;

function store(): Organisme[] {
  if (!devStore) devStore = [...SEED_ORGANISMES];
  return devStore;
}

export const organismesService = {
  getAll: async (
    client: ApiClient = apiClient,
  ): Promise<Organisme[]> => {
    try {
      const response = await client.request<
        ApiEnvelope<Organisme[]> | Organisme[]
      >(BASE_URL);

      // Supporte à la fois l'enveloppe { Message, data } et un tableau brut
      const data = Array.isArray(response)
        ? response
        : response?.data;

      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (
    payload: CreateOrganismePayload,
    client: ApiClient = apiClient,
  ): Promise<Organisme> => {
    try {
      const response = await client.request<
        ApiEnvelope<Organisme> | Organisme
      >(BASE_URL, {
        method: 'POST',
        body: payload,
      });

      // Supporte à la fois l'enveloppe { Message, data } et l'objet brut
      return 'data' in response && response.data
        ? response.data
        : (response as Organisme);
    } catch (err) {
      if (isDev) {
        const created: Organisme = {
          id: Date.now(),
          ...payload,
          sigle: payload.sigle ?? null,
          adresse: payload.adresse ?? null,
          telephone: payload.telephone ?? null,
          email: payload.email ?? null,
          site_web: payload.site_web ?? null,
          description: payload.description ?? null,
        };

        store().unshift(created);

        return created;
      }

      throw err;
    }
  },

  update: async (
    payload: UpdateOrganismePayload,
    client: ApiClient = apiClient,
  ): Promise<Organisme> => {
    try {
      const response = await client.request<
        ApiEnvelope<Organisme> | Organisme
      >(`${BASE_URL}/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });

      return 'data' in response && response.data
        ? response.data
        : (response as Organisme);
    } catch (err) {
      if (isDev) {
        devStore = store().map((o) =>
          o.id === payload.id ? payload : o,
        );

        return payload;
      }

      throw err;
    }
  },

  remove: async (
    id: number,
    client: ApiClient = apiClient,
  ): Promise<void> => {
    try {
      await client.request<void>(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      if (isDev) {
        devStore = store().filter((o) => o.id !== id);
        return;
      }

      throw err;
    }
  },
};