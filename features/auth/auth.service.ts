import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
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
 * Centralized auth endpoints. Login is confirmed (`/personnels/login`); the
 * rest follow the spec pattern (trailing slashes dropped for Laravel). Change
 * any of these in ONE place when the real AEJ paths are confirmed.
 *
 * TODO(backend): confirm ME / LOGOUT / VERIFY_OTP / RESEND_OTP / password paths.
 */
const ENDPOINTS = {
  login: '/personnels/login',
  verifyOtp: '/auth/verify-otp',
  resendOtp: '/auth/2fa/send-otp',
  me: '/personnel/me',
  logout: '/auth/logout',
  passwordReset: '/password/reset',
  passwordSet: '/password/set',
} as const;

/**
 * Cookie-session auth service. Every call rides the httpOnly cookie
 * (`credentials: 'include'` is set by the client). Methods take an optional
 * `client` so `me()` can run during a server prefetch with `serverApiClient`.
 */
export const authService = {
  /** Step 1 — submit credentials. May return `otp_required` (2FA pending). */
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    apiClient.request<LoginResponse>(ENDPOINTS.login, { method: 'POST', body: payload }),

  /** Step 2 — verify the emailed code; server sets the session cookie. */
  verifyOtp: (payload: VerifyOtpPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.verifyOtp, { method: 'POST', body: payload }),

  /** Resend the emailed OTP. */
  resendOtp: (payload: ResendOtpPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.resendOtp, { method: 'POST', body: payload }),

  /**
   * The single source of truth for auth state: 200 → authenticated, 401 → not.
   * The response is enveloped (`{ message, data }`), unlike login which is flat.
   */
  me: async (client: ApiClient = apiClient): Promise<User> => {
    const res = await client.request<MeResponse>(ENDPOINTS.me);
    return res.data;
  },

  /** Server clears the session cookie. */
  logout: (): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.logout, { method: 'POST' }),

  /** Request a password-reset email. */
  requestPasswordReset: (payload: PasswordResetPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.passwordReset, { method: 'POST', body: payload }),

  /** Set a new password from a reset link. */
  setPassword: (payload: PasswordSetPayload): Promise<void> =>
    apiClient.request<void>(ENDPOINTS.passwordSet, { method: 'POST', body: payload }),
};
