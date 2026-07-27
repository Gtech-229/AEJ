import type { FormConfig } from '@/components/forms';

/**
 * Field configs per settings section. Field `name`s match the API 1:1, so
 * section values merge straight into the full Configuration. Plain French
 * labels — no i18n. Full-width fields use `colSpan: 'full'` in the 2-col grid.
 */

export function getIdentiteConfig(): FormConfig {
  return {
    columns: 1,
    fields: [
      { name: 'sigle_systeme', label: 'Sigle du système', type: 'text', required: true, placeholder: 'Ex : MSYS' },
      { name: 'intitule_systeme', label: 'Intitulé du système', type: 'text', required: true, placeholder: 'Mon Système de Gestion', colSpan: 'full' },
      { name: 'sigle_structure', label: 'Sigle de la structure', type: 'text', required: true, placeholder: 'Ex : AEJ' },
      { name: 'intitule_structure', label: 'Intitulé de la structure', type: 'text', placeholder: 'Agence Emploi Jeunes', colSpan: 'full' },
    ],
  };
}

export function getCoordonneesConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'adresse_sociale_structure', label: 'Adresse sociale', type: 'text', placeholder: "Abidjan, Côte d'Ivoire", colSpan: 'full' },
      { name: 'email_structure', label: 'Email', type: 'email', placeholder: 'contact@structure.ci' },
      { name: 'whatsapp_structure', label: 'WhatsApp', type: 'tel', placeholder: '+2250700000000' },
      { name: 'telephone_structure', label: 'Téléphone', type: 'tel', placeholder: '+2250100000000' },
    ],
  };
}

export function getFinanceConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'sigle_monnaie_pays', label: 'Monnaie du pays', type: 'text', placeholder: 'XOF' },
      { name: 'sigle_devise_principale', label: 'Devise principale', type: 'text', placeholder: 'XOF' },
      { name: 'taux_devise_principale', label: 'Taux de la devise principale', type: 'number', step: 0.01, min: 0, placeholder: '655.96' },
    ],
  };
}

export function getSecuriteConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'mise_en_maintenance', label: 'Mode maintenance', type: 'switch', colSpan: 'full' },
      { name: 'delai_inactivite_minutes', label: "Délai d'inactivité (minutes)", type: 'number', min: 0, placeholder: '30' },
      { name: 'nombre_session_possible', label: 'Sessions simultanées autorisées', type: 'number', min: 1, placeholder: '3' },
      { name: 'nombre_tentatives_connexion', label: 'Tentatives de connexion', type: 'number', min: 1, placeholder: '5' },
      { name: 'delai_code_tp_minutes', label: 'Validité du code temporaire (minutes)', type: 'number', min: 0, placeholder: '10' },
      { name: 'delai_changement_mdp_mois', label: 'Délai de changement de mot de passe (mois)', type: 'number', min: 0, placeholder: '3' },
      { name: 'delai_suppression_secondes', label: 'Délai de suppression/modification (secondes)', type: 'number', min: 0, placeholder: '60' },
    ],
  };
}

export function getNotificationsConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'code_instance_whatsapp', label: 'Code instance WhatsApp', type: 'text', placeholder: 'WHATSAPP-001' },
      { name: 'email_notifications', label: 'Email de notifications', type: 'email', placeholder: 'notify@structure.ci' },
      { name: 'mot_de_passe_email_notifications', label: "Mot de passe de l'email", type: 'password', showPasswordToggle: true, placeholder: '••••••••', colSpan: 'full' },
      { name: 'smtp_email_notifications', label: 'Serveur SMTP', type: 'text', placeholder: 'smtp.mailtrap.io' },
    ],
  };
}

export function getIntegrationsConfig(): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'lien_api_parent', label: 'Lien API parent', type: 'url', placeholder: 'https://api.parent-system.com', colSpan: 'full' },
    ],
  };
}
