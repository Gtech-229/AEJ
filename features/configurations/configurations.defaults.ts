import type { Configuration } from './configurations.dto';
import type {
  IdentiteInput,
  CoordonneesInput,
  FinanceInput,
  SecuriteInput,
  NotificationsInput,
  IntegrationsInput,
} from './configurations.schema';

/**
 * Per-section default-value builders — read from the loaded Configuration.
 * Called only inside the section components. Field names match the API 1:1.
 * (`logo_structure` is handled by the LogoUploader, not these builders.)
 */

export const getIdentiteDefaults = (c: Configuration): IdentiteInput => ({
  sigle_systeme: c.sigle_systeme ?? '',
  intitule_systeme: c.intitule_systeme ?? '',
  sigle_structure: c.sigle_structure ?? '',
  intitule_structure: c.intitule_structure ?? '',
});

export const getCoordonneesDefaults = (c: Configuration): CoordonneesInput => ({
  adresse_sociale_structure: c.adresse_sociale_structure ?? '',
  email_structure: c.email_structure ?? '',
  whatsapp_structure: c.whatsapp_structure ?? '',
  telephone_structure: c.telephone_structure ?? '',
});

export const getFinanceDefaults = (c: Configuration): FinanceInput => ({
  sigle_monnaie_pays: c.sigle_monnaie_pays ?? '',
  sigle_devise_principale: c.sigle_devise_principale ?? '',
  taux_devise_principale: c.taux_devise_principale ?? 0,
});

export const getSecuriteDefaults = (c: Configuration): SecuriteInput => ({
  mise_en_maintenance: c.mise_en_maintenance ?? false,
  delai_inactivite_minutes: c.delai_inactivite_minutes ?? 0,
  nombre_session_possible: c.nombre_session_possible ?? 0,
  nombre_tentatives_connexion: c.nombre_tentatives_connexion ?? 0,
  delai_code_tp_minutes: c.delai_code_tp_minutes ?? 0,
  delai_changement_mdp_mois: c.delai_changement_mdp_mois ?? 0,
  delai_suppression_secondes: c.delai_suppression_secondes ?? 0,
});

export const getNotificationsDefaults = (c: Configuration): NotificationsInput => ({
  code_instance_whatsapp: c.code_instance_whatsapp ?? '',
  email_notifications: c.email_notifications ?? '',
  mot_de_passe_email_notifications: c.mot_de_passe_email_notifications ?? '',
  smtp_email_notifications: c.smtp_email_notifications ?? '',
});

export const getIntegrationsDefaults = (c: Configuration): IntegrationsInput => ({
  lien_api_parent: c.lien_api_parent ?? '',
});
