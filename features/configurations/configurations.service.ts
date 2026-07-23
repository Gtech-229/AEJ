import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  Configuration,
  ConfigurationApi,
  ConfigurationEnvelope,
} from './configurations.dto';

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
/** Raw backend record → clean app `Configuration` (coerce decimal + 0/1 flag). */
function fromApi(data: ConfigurationApi): Configuration {
  return {
    sigle_systeme: data.sigle_systeme,
    intitule_systeme: data.intitule_systeme,
    sigle_structure: data.sigle_structure,
    intitule_structure: data.intitule_structure,
    logo_structure: data.logo_structure,
    adresse_sociale_structure: data.adresse_sociale_structure,
    email_structure: data.email_structure,
    whatsapp_structure: data.whatsapp_structure,
    telephone_structure: data.telephone_structure,
    sigle_monnaie_pays: data.sigle_monnaie_pays,
    sigle_devise_principale: data.sigle_devise_principale,
    taux_devise_principale: Number(data.taux_devise_principale) || 0,
    mise_en_maintenance: Boolean(data.mise_en_maintenance),
    delai_inactivite_minutes: data.delai_inactivite_minutes,
    nombre_session_possible: data.nombre_session_possible,
    nombre_tentatives_connexion: data.nombre_tentatives_connexion,
    delai_code_tp_minutes: data.delai_code_tp_minutes,
    delai_changement_mdp_mois: data.delai_changement_mdp_mois,
    delai_suppression_secondes: data.delai_suppression_secondes,
    code_instance_whatsapp: data.code_instance_whatsapp,
    email_notifications: data.email_notifications,
    mot_de_passe_email_notifications: data.mot_de_passe_email_notifications,
    smtp_email_notifications: data.smtp_email_notifications,
    lien_api_parent: data.lien_api_parent,
  };
}

/** Clean `Configuration` → the shape the backend expects on write (0/1 flag). */
function toApi(config: Configuration) {
  return {
    ...config,
    mise_en_maintenance: config.mise_en_maintenance ? 1 : 0,
  };
}

export const configurationsService = {
  /** GET the full configuration object (unwrapped + normalized). */
  getConfigurations: async (client: ApiClient = apiClient): Promise<Configuration> => {
    try {
      const res = await client.request<ConfigurationEnvelope>(BASE_URL);
      console.log("Received inside service", res)
      return fromApi(res.data);
    } catch (err) {
      //  console.log("err fetching the config params", err)
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
     
    const res = await client.request<ConfigurationEnvelope | null>(`${BASE_URL}/1`, {
      method: 'PUT',
      body: toApi(payload),
    });

  
    // The backend echoes the saved record (wrapped); fall back to the payload.
    return res?.data ? fromApi(res.data) : payload;
  },
};
