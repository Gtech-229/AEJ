/**
 * API contract for the configurations feature — the exact shape received from
 * (and sent to) the backend. Hand-written and independent of Zod (Zod is used
 * only for form/input validation in `configurations.schema.ts`).
 */
export interface Configuration {
  sigle_systeme: string;
  intitule_systeme: string;
  sigle_structure: string;
  intitule_structure: string;
  logo_structure: string;
  adresse_sociale_structure: string;
  email_structure: string;
  whatsapp_structure: string;
  telephone_structure: string;
  sigle_monnaie_pays: string;
  sigle_devise_principale: string;
  taux_devise_principale: number;
  mise_en_maintenance: boolean;
  delai_inactivite_minutes: number;
  nombre_session_possible: number;
  nombre_tentatives_connexion: number;
  delai_code_tp_minutes: number;
  delai_changement_mdp_mois: number;
  delai_suppression_secondes: number;
  code_instance_whatsapp: string;
  email_notifications: string;
  mot_de_passe_email_notifications: string;
  smtp_email_notifications: string;
  lien_api_parent: string;
}

/** Body accepted by `POST /configurations` — the whole config object. */
export type UpdateConfigurationPayload = Configuration;

/**
 * Raw record as returned by the backend (Laravel): decimals come as strings,
 * booleans as 0/1, plus `id` and timestamps. It's mapped to/from the clean
 * `Configuration` in the service (`fromApi` / `toApi`). Responses are wrapped
 * in `{ Message, data }`.
 */
export interface ConfigurationApi
  extends Omit<Configuration, 'taux_devise_principale' | 'mise_en_maintenance'> {
  id: number;
  taux_devise_principale: string;
  mise_en_maintenance: number;
  created_at: string;
  updated_at: string;
}

/** Envelope the backend wraps single-resource responses in. */
export interface ConfigurationEnvelope {
  Message: string;
  data: ConfigurationApi;
}
