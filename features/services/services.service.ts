import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateServicePayload, Service, UpdateServicePayload } from './services.dto';

// TODO(backend): confirm the real path. Assumed /services (no trailing slash,
// like /fonctions). Same dev-store fallback as fonctions.service.ts while the
// CORS/auth issue on the real API is being resolved — remove once it's live.
const BASE_URL = '/services';
const isDev = process.env.NODE_ENV !== 'production';

const SEED_SERVICES: Service[] = [
  { id: 1, nom: "Service Accompagnement à l'insertion", code: 'SAI', description: 'Accompagnement des promoteurs', direction_id: 1 },
  { id: 2, nom: 'Service Développement des ressources de financement', code: 'SDRF', description: 'Relations avec les partenaires financiers', direction_id: 2 },
  { id: 3, nom: 'Service Développement applicatif', code: 'SDA', description: 'Conception et maintenance des applications', direction_id: 3 },
  { id: 4, nom: 'Service Suivi-Évaluation', code: 'SSE', description: 'Indicateurs et reporting', direction_id: 4 },
];

let devStore: Service[] | null = null;
function store(): Service[] {
  if (!devStore) devStore = [...SEED_SERVICES];
  return devStore;
}

export const servicesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Service[]> => {
    try {
      const data = await client.request<Service[]>(BASE_URL);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (
    payload: CreateServicePayload,
    client: ApiClient = apiClient,
  ): Promise<Service> => {
    try {
      return await client.request<Service>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Service = {
          ...payload,
          code: payload.code ?? null,
          description: payload.description ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (
    payload: UpdateServicePayload,
    client: ApiClient = apiClient,
  ): Promise<Service> => {
    try {
      return await client.request<Service>(`${BASE_URL}/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
    } catch (err) {
      if (isDev) {
        devStore = store().map((s) => (s.id === payload.id ? payload : s));
        return payload;
      }
      throw err;
    }
  },

  remove: async (id: number, client: ApiClient = apiClient): Promise<void> => {
    try {
      await client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (isDev) {
        devStore = store().filter((s) => s.id !== id);
        return;
      }
      throw err;
    }
  },
};
