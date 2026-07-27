import { z } from 'zod';

/**
 * Zod schemas for the settings form sections ONLY (user-input validation). The
 * API response type is the hand-written `Configuration` DTO — responses are not
 * Zod-validated. Field names match the API 1:1 so section values merge straight
 * into the full Configuration on save.
 */

// ── Reusable optional-format fields (empty string allowed) ────────────────────
const optionalEmail = z.union([z.literal(''), z.email('Adresse email invalide')]);
const optionalUrl = z.union([z.literal(''), z.url('Lien invalide')]);

// ── Per-section form schemas (strict, French messages) ────────────────────────
// Field names stay identical to the API so section values merge 1:1 into the
// full Configuration on save.

export const identiteSchema = z.object({
  sigle_systeme: z.string().min(1, 'Le sigle du système est requis'),
  intitule_systeme: z.string().min(1, "L'intitulé du système est requis"),
  sigle_structure: z.string().min(1, 'Le sigle de la structure est requis'),
  intitule_structure: z.string(),
});
export type IdentiteInput = z.infer<typeof identiteSchema>;
// `logo_structure` is handled by the LogoUploader and merged in on save.

export const coordonneesSchema = z.object({
  adresse_sociale_structure: z.string(),
  email_structure: optionalEmail,
  whatsapp_structure: z.string(),
  telephone_structure: z.string(),
});
export type CoordonneesInput = z.infer<typeof coordonneesSchema>;

export const financeSchema = z.object({
  sigle_monnaie_pays: z.string(),
  sigle_devise_principale: z.string(),
  taux_devise_principale: z
    .number({ message: 'Le taux est requis' })
    .min(0, 'Le taux doit être positif'),
});
export type FinanceInput = z.infer<typeof financeSchema>;

export const securiteSchema = z.object({
  mise_en_maintenance: z.boolean(),
  delai_inactivite_minutes: z.number({ message: 'Valeur requise' }).min(0, 'Valeur invalide'),
  nombre_session_possible: z.number({ message: 'Valeur requise' }).min(1, 'Au moins 1 session'),
  nombre_tentatives_connexion: z.number({ message: 'Valeur requise' }).min(1, 'Au moins 1 tentative'),
  delai_code_tp_minutes: z.number({ message: 'Valeur requise' }).min(0, 'Valeur invalide'),
  delai_changement_mdp_mois: z.number({ message: 'Valeur requise' }).min(0, 'Valeur invalide'),
  delai_suppression_secondes: z.number({ message: 'Valeur requise' }).min(0, 'Valeur invalide'),
});
export type SecuriteInput = z.infer<typeof securiteSchema>;

export const notificationsSchema = z.object({
  code_instance_whatsapp: z.string(),
  email_notifications: optionalEmail,
  mot_de_passe_email_notifications: z.string(),
  smtp_email_notifications: z.string(),
});
export type NotificationsInput = z.infer<typeof notificationsSchema>;

export const integrationsSchema = z.object({
  lien_api_parent: optionalUrl,
});
export type IntegrationsInput = z.infer<typeof integrationsSchema>;
