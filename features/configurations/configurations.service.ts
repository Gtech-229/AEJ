import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  Configuration,
  ConfigurationApi,
  ConfigurationEnvelope,
} from './configurations.dto';

const BASE_URL = '/configurations';

/**
 * The configuration is a singleton (id 1) — writes target the detail resource.
 * TODO(backend): ideally exposed without the id (e.g. PATCH /configurations).
 */
const DETAIL_URL = `${BASE_URL}`;

/**
 * Sensible defaults so the settings UI renders before the backend exists.
 * TODO(backend): remove the dev fallback in `getConfigurations` once
 * `GET /configurations` is live.
 */
export const DEFAULT_CONFIGURATION: Configuration = {
  sigle_systeme: '',
  intitule_systeme: '',
  logo_systeme: '',
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
  token_instance_whatsapp: '',
  email_notifications: '',
  mot_de_passe_email_notifications: '',
  smtp_email_notifications: '',
  smtp_host_notifications: '',
  smtp_port_notifications: 587,
  smtp_encrypt_notifications: 'tls',
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
    logo_systeme: data.logo_systeme,
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
    token_instance_whatsapp: data.token_instance_whatsapp,
    email_notifications: data.email_notifications,
    mot_de_passe_email_notifications: data.mot_de_passe_email_notifications,
    smtp_email_notifications: data.smtp_email_notifications,
    smtp_host_notifications: data.smtp_host_notifications,
    smtp_port_notifications: data.smtp_port_notifications,
    smtp_encrypt_notifications: data.smtp_encrypt_notifications,
    lien_api_parent: data.lien_api_parent,
  };
}

/**
 * Clean `Configuration` → the shape the backend expects on write (0/1 flag).
 *
 * Partial-safe: `mise_en_maintenance` is only emitted when the caller actually
 * set it. Coercing it unconditionally would append `mise_en_maintenance: 0` to
 * every section's PATCH and silently switch maintenance mode OFF.
 */
function toApi(config: Partial<Configuration>): Record<string, unknown> {
  const { mise_en_maintenance, ...rest } = config;
  return {
    ...rest,
    ...(mise_en_maintenance !== undefined
      ? { mise_en_maintenance: mise_en_maintenance ? 1 : 0 }
      : {}),
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

  /**
   * PATCH the configuration with ONLY the fields the caller changed — each
   * settings section sends its own slice, so one tab can't clobber another
   * admin's concurrent edit to a different section.
   *
   * NB: a real `PATCH` is fine here because the body is JSON — the `_method`
   * spoofing is only needed for multipart (see `uploadStructureLogo`).
   *
   * Returns the echoed record when the backend sends one, otherwise `null`
   * (a partial payload can't be widened into a full Configuration).
   */
  updateConfigurations: async (
    payload: Partial<Configuration>,
    client: ApiClient = apiClient,
  ): Promise<Configuration | null> => {
    const res = await client.request<ConfigurationEnvelope | null>(DETAIL_URL, {
      method: 'PATCH',
      body: toApi(payload),
    });

    return res?.data ? fromApi(res.data) : null;
  },

  /**
   * Upload the structure logo (multipart, its own endpoint).
   *
   * PHP only parses multipart bodies on POST — a real PATCH arrives with an
   * empty `$request->file()` — so we POST with Laravel's `_method` spoofing to
   * reach the same PATCH route. Content-Type is deliberately NOT set: the
   * browser must add the `boundary=...`.
   */
  uploadStructureLogo: async (
    file: File,
    client: ApiClient = apiClient,
  ): Promise<Configuration | null> => {
    const formData = new FormData();
    // NB: the FILE goes under `structure_logo`, NOT `logo_structure`.
    // `logo_structure` is the string PATH column the backend validates as a
    // string — posting the binary there fails with "must be a string". The
    // controller reads `structure_logo`, stores it, and writes the path back.
    // TODO(backend): confirm the exact multipart field name for the file.
    formData.append('structure_logo', file);
    formData.append('_method', 'PATCH');

    const res = await client.request<ConfigurationEnvelope | null>(DETAIL_URL, {
      method: 'POST',
      body: formData,
    });
    return res?.data ? fromApi(res.data) : null;
  },
};
