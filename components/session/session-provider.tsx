'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { ACTIVITY_EVENT } from '@/lib/activity';
import { useAuth } from '@/features/auth/auth.context';
import { useConfigurations } from '@/features/configurations/configurations.hooks';
import { SessionWarningDialog } from './session-warning-dialog';

interface SessionContextValue {
  /** Seconds left before idle logout (0 when the timer is inactive). */
  remainingSeconds: number;
  /** Refill the countdown to full (e.g. from a "stay signed in" action). */
  extend: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}

/**
 * Owns the idle auto-logout timer, driven by `delai_inactivite_minutes` from
 * the system configuration. All state lives here (React Context only — no
 * external store). Any successful API call fires `ACTIVITY_EVENT`, which resets
 * the countdown. `0` minutes = unlimited (timer never starts).
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { data: config } = useConfigurations();
  const [remainingSeconds, setRemaining] = useState(0);
  const [warningVisible, setWarningVisible] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(0);
  const warnAtRef = useRef(0);
  const loggedOutRef = useRef(false);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const start = useCallback(
    (durationSec: number) => {
      stop();
      warnAtRef.current = Math.min(Math.floor(durationSec * 0.25), 600); // 25%, cap 10 min
      setRemaining(durationSec);
      setWarningVisible(false);
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            stop();
            return 0;
          }
          if (next <= warnAtRef.current) setWarningVisible(true);
          return next;
        });
      }, 1000);
    },
    [stop],
  );

  /** Any activity refills the countdown to full. */
  const reset = useCallback(() => {
    if (durationRef.current <= 0 || loggedOutRef.current) return;
    if (intervalRef.current) {
      setRemaining(durationRef.current);
      setWarningVisible(false);
    } else {
      start(durationRef.current);
    }
  }, [start]);

  // Config → (re)configure the timer.
  useEffect(() => {
    loggedOutRef.current = false;
    if (!config) {
      stop();
      return;
    }
    const duration = (config.delai_inactivite_minutes ?? 0) * 60;
    durationRef.current = duration;
    if (duration === 0) {
      // Unlimited — never log out on inactivity.
      stop();
      setRemaining(0);
      setWarningVisible(false);
      return;
    }
    start(duration);
    return () => stop();
  }, [config, start, stop]);

  // Activity event (from the API client) → reset the countdown.
  useEffect(() => {
    const onActivity = () => reset();
    window.addEventListener(ACTIVITY_EVENT, onActivity);
    return () => window.removeEventListener(ACTIVITY_EVENT, onActivity);
  }, [reset]);

  // Expiry → log out once.
  useEffect(() => {
    if (remainingSeconds === 0 && durationRef.current > 0 && !loggedOutRef.current) {
      loggedOutRef.current = true;
      setWarningVisible(false);
      toast.info('Session expirée. Veuillez vous reconnecter.');
      logout(); // clears the client cache + redirects to /auth/login
    }
  }, [remainingSeconds, logout]);

  return (
    <SessionContext.Provider value={{ remainingSeconds, extend: reset }}>
      {children}
      {warningVisible && (
        <SessionWarningDialog
          remainingSeconds={remainingSeconds}
          onExtend={reset}
          onLogout={() => {
            loggedOutRef.current = true;
            logout();
          }}
        />
      )}
    </SessionContext.Provider>
  );
}
