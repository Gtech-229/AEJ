import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { SPACES, DEFAULT_SPACE, type SpaceKey } from './auth.spaces';
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  PasswordResetPayload,
  PasswordSetPayload,
  ResendOtpPayload,
  User,
  VerifyOtpPayload,
} from './auth.dto';

/**
 * Space-agnostic endpoints (login/me/logout live in the space registry —
 * `auth.spaces.ts` — since auth is per-space). These are backoffice-only flows
 * for now.
 *
 * TODO(backend): confirm VERIFY_OTP / RESEND_OTP / password paths.
 */
const ENDPOINTS = {
  verifyOtp: '/auth/verify-otp',
  resendOtp: '/auth/2fa/send-otp',
  passwordReset: '/password/reset',
  passwordSet: '/password/set',
} as const;

/**
 * Cookie-session auth service. Every call rides the httpOnly session cookie
 * (`credentials: 'include'` is set by the client). `login`/`me`/`logout` take a
 * `space` (defaulting to the backoffice) and read that space's endpoints from
 * the registry, so the same methods serve all three web spaces.
 */
export const authService = {
  /** Step 1 — submit credentials for a space. May return `otp_required` (2FA pending). */
  login: (payload: LoginPayload, space: SpaceKey = DEFAULT_SPACE): Promise<LoginResponse> =>
    apiClient.request<LoginResponse>(SPACES[space].endpoints.login, {
      method: 'POST',
      body: payload,
    }),

  /** Step 2 — verify the emailed code; server sets the session cookie. */
  verifyOtp: (payload: VerifyOtpPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.verifyOtp, { method: 'POST', body: payload }),

  /** Resend the emailed OTP. */
  resendOtp: (payload: ResendOtpPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.resendOtp, { method: 'POST', body: payload }),

  /**
   * Source of truth for a space's auth state: 200 → authenticated, 401 → not.
   * The response is enveloped (`{ message, data }`), unlike login which is flat.
   */
  me: async (
    client: ApiClient = apiClient,
    space: SpaceKey = DEFAULT_SPACE,
  ): Promise<User> => {
    const res = await client.request<MeResponse>(SPACES[space].endpoints.me);
    console.log("Details de l'utilisateur connecte", res.data)
    return res.data;
  },

  /** Server clears the space's session cookie. */
  logout: (space: SpaceKey = DEFAULT_SPACE): Promise<void> =>
    apiClient.request<void>(SPACES[space].endpoints.logout, { method: 'POST' }),

  /** Request a password-reset email. */
  requestPasswordReset: (payload: PasswordResetPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.passwordReset, { method: 'POST', body: payload }),

  /** Set a new password from a reset link. */
  setPassword: (payload: PasswordSetPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.passwordSet, { method: 'POST', body: payload }),
};
