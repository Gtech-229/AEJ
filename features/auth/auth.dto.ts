/**
 * Auth API contracts (hand-written). Cookie-session model: the server sets an
 * httpOnly cookie; JS never reads/stores a token.
 */

/** The authenticated user, resolved from `GET /auth/me`. */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

/** Login step 1 — `POST /personnels/login`. */
export interface LoginPayload {
  email: string;
  mot_de_passe: string;
}

/**
 * Login response. When 2FA is enabled the backend returns `otp_required` (and a
 * pending personnel id) WITHOUT setting a session cookie. Otherwise it sets the
 * cookie and this carries no `otp_required`.
 *
 * TODO(backend): OTP isn't wired yet — `otp_required` is currently absent, so
 * login goes straight in. Fields marked optional so the flow activates the
 * moment the backend starts returning them.
 */
export interface LoginResponse {
  otp_required?: boolean;
  personnel?: { id_personnel_perso: number };
}

/** OTP verification step 2 — `POST /auth/verify-otp`. */
export interface VerifyOtpPayload {
  code: string;
  id_personnel_perso: number;
}

/** Resend the emailed code — `POST /auth/2fa/send-otp`. */
export interface ResendOtpPayload {
  userId: number;
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
