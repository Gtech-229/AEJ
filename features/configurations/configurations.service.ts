import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { Configuration } from './configurations.dto';

const BASE_URL = '/configurations';

/**
 * Sensible defaults so the settings UI renders before the backend exists.
 * TODO(backend): remove the dev fallback in `getConfigurations` once
 * `GET /configurations` is live.
 */
export const DEFAULT_CONFIGURATION: Configuration = {
  sigle_systeme: '',
  intitule_systeme: '',
  sigle_structure: '',
  intitule_structure: '',
  logo_structure: '',
  adresse_sociale_structure: '',
  email_structure: '',
  whatsapp_structure: '',
  telephone_structure: '',
  sigle_monnaie_pays: 'XOF',
  sigle_devise_principale: 'XOF',
  taux_devise_principale: 0,
  mise_en_maintenance: false,
  delai_inactivite_minutes: 30,
  nombre_session_possible: 3,
  nombre_tentatives_connexion: 5,
  delai_code_tp_minutes: 10,
  delai_changement_mdp_mois: 3,
  delai_suppression_secondes: 60,
  code_instance_whatsapp: '',
  email_notifications: '',
  mot_de_passe_email_notifications: '',
  smtp_email_notifications: '',
  lien_api_parent: '',
};

/**
 * Configurations API service. Methods default to the browser `apiClient`; a
 * Server Component can inject `serverApiClient` for prefetch (cookie
 * forwarding) — this is why `client` is a parameter, not hardcoded.
 */
export const configurationsService = {
  /** GET the full configuration object. */
  getConfigurations: async (client: ApiClient = apiClient): Promise<Configuration> => {
    try {
      return await client.request<Configuration>(BASE_URL);
    } catch (err) {
      // Dev fallback: endpoint not built yet → show defaults instead of an
      // empty screen. In production a real failure must propagate.
      if (process.env.NODE_ENV !== 'production') return DEFAULT_CONFIGURATION;
      throw err;
    }
  },

  /** POST the whole configuration object (the API accepts the full object). */
  updateConfigurations: async (
    payload: Configuration,
    client: ApiClient = apiClient,
  ): Promise<Configuration> => {
    return await client.request<Configuration>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
  },
};
