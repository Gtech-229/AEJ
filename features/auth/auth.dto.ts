/**
 * Auth API contracts (hand-written). Cookie-session model: the server sets an
 * httpOnly cookie; JS never reads/stores a token.
 */

/**
 * A role (from `/roles`). Shape confirmed via `GET /roles/{id}`
 * (`{ id, code, libelle, description, … }`). `space` is the dashboard-space
 * discriminator we asked the backend to add — see `.claude/backend-asks.md`.
 * It's backend-owned and STABLE (unlike the admin-editable `code`), so routing
 * keys off it. Optional until `/personnel/me` embeds the role + `space`.
 */
export interface Role {
  id: number;
  code: string;
  libelle: string;
  description?: string | null;
  /** Which dashboard this role's users belong to. */
  space?: 'agence' | 'organismes' | 'entreprise';
  created_at?: string;
  updated_at?: string;
}

/**
 * The authenticated personnel, resolved from `GET /personnel/me`.
 * Confirmed against the real payload.
 */
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role_id: number;
  /**
   * Embedded role, once `/personnel/me` includes it. Its `space` drives
   * dashboard routing (see `getActeurTypeForUser`) — preferred over `role_id`.
   */
  role?: Role;
  fonction_id: number;
  /** NB: the API returns 0/1, not a boolean. */
  is_active: number;
  /**
   * Resolved server-side decision: may this user use the app during
   * maintenance? Optional until the backend ships it — see
   * `canBypassMaintenance`, which falls back to a local role allow-list.
   */
  can_bypass_maintenance?: boolean;
  created_at?: string;
  updated_at?: string;
}

/** `/personnel/me` is enveloped: `{ message, data }`. */
export interface MeResponse {
  message: string;
  data: User;
}

/** "Prénom Nom" for display, falling back to the email, then a generic label. */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'Admin';
  const full = [user.prenom, user.nom].filter(Boolean).join(' ').trim();
  return full || user.email || 'Admin';
}

/** Login step 1 — `POST /personnels/login`. */
export interface LoginPayload {
  email: string;
  mot_de_passe: string;
}

/**
 * Login response — FLAT, not enveloped (unlike `/configurations`).
 * Confirmed shape: `{ "message": "Authentification réussie", "user_id": 3 }`.
 *
 * TODO(backend): 2FA isn't wired yet, so `otp_required` is absent and login goes
 * straight in. When it lands, `otp_required: true` gates the OTP step and
 * `user_id` is the pending id the code is paired with — the flow activates with
 * no code change.
 */
export interface LoginResponse {
  message: string;
  user_id: number;
  otp_required?: boolean;
}

/**
 * OTP verification step 2 — `POST /auth/verify-otp`.
 * TODO(backend): field name unconfirmed; `user_id` mirrors the login response
 * (and the API's snake_case convention).
 */
export interface VerifyOtpPayload {
  code: string;
  user_id: number;
}

/** Resend the emailed code — `POST /auth/2fa/send-otp`. TODO(backend): confirm. */
export interface ResendOtpPayload {
  user_id: number;
}

/** Request a password-reset link — `POST /password/reset`. */
export interface PasswordResetPayload {
  email: string;
}

/** Set a new password from a reset link — `POST /password/set`. */
export interface PasswordSetPayload {
  new_password: string;
  confirm_new_password: string;
  token: string;
  uid: string;
}

