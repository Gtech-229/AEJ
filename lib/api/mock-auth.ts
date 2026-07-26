/**
 * DEV-ONLY mock authentication directory.
 *
 * Used exclusively by `useAuth.ts` as a fallback while the real backend
 * (`/auth/login`, `/auth/me`) doesn't exist yet. Nothing here is httpOnly or
 * secure — it exists purely to unblock frontend development and must be
 * removed once the real backend endpoints are live (see TODO(backend) in
 * useAuth.ts and client.ts).
 */
import type { CurrentUser } from '../../hooks/useAuth';

interface MockAccount {
  email: string;
  password: string;
  user: CurrentUser;
}

// One account per Agence role (cf. lib/auth/roles.ts) plus a couple of
// non-agence actors, so every dashboard variant seen in the app
// (entreprise/institution/portail) can be exercised without a real backend.
const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'admin@aej.test',
    password: 'password',
    user: { id: 1, name: 'Aïcha Traoré', email: 'admin@aej.test', role: 'admin_general' },
  },
  {
    email: 'dg@aej.test',
    password: 'password',
    user: { id: 2, name: 'Founé Keïta', email: 'dg@aej.test', role: 'directeur_general' },
  },
  {
    email: 'finances@aej.test',
    password: 'password',
    user: { id: 3, name: 'Moussa Coulibaly', email: 'finances@aej.test', role: 'directeur_finances' },
  },
  {
    email: 'suivi-eval@aej.test',
    password: 'password',
    user: { id: 4, name: 'Fatoumata Diarra', email: 'suivi-eval@aej.test', role: 'directeur_suivi_evaluation' },
  },
  {
    email: 'si@aej.test',
    password: 'password',
    user: { id: 5, name: 'Ismaël Keïta', email: 'si@aej.test', role: 'directeur_si' },
  },
  {
    email: 'comptable@aej.test',
    password: 'password',
    user: { id: 6, name: 'Bintou Sangaré', email: 'comptable@aej.test', role: 'comptable' },
  },
  {
    email: 'analyste@aej.test',
    password: 'password',
    user: { id: 7, name: 'Drissa Sanogo', email: 'analyste@aej.test', role: 'analyste' },
  },
  {
    email: 'auditeur@aej.test',
    password: 'password',
    user: { id: 8, name: 'Rokiatou Konaté', email: 'auditeur@aej.test', role: 'auditeur' },
  },
  {
    email: 'entreprise@aej.test',
    password: 'password',
    user: { id: 9, name: 'Orange CI (Entreprise)', email: 'entreprise@aej.test', role: 'entreprise' },
  },
  {
    email: 'institution@aej.test',
    password: 'password',
    user: { id: 10, name: 'BAD (Institution)', email: 'institution@aej.test', role: 'institution_financiere' },
  },
];

export function findMockAccount(email: string, password: string): CurrentUser | null {
  const match = MOCK_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
  );
  return match?.user ?? null;
}

// ---------------------------------------------------------------------------
// Dev-only "session" cookie: carries the logged-in mock user as JSON so a
// page refresh doesn't lose the session. Non-httpOnly by necessity (JS needs
// to read it here) — this is explicitly the dev bypass, never used once the
// real cookie-based backend session is live.
// ---------------------------------------------------------------------------
const MOCK_SESSION_COOKIE = 'aej_mock_session';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setMockSession(user: CurrentUser) {
  document.cookie = `${MOCK_SESSION_COOKIE}=${encodeURIComponent(
    JSON.stringify(user),
  )}; path=/; max-age=604800; samesite=strict`;
}

export function clearMockSession() {
  document.cookie = `${MOCK_SESSION_COOKIE}=; path=/; max-age=0`;
}

export function readMockSession(): CurrentUser | null {
  const raw = getCookie(MOCK_SESSION_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}
