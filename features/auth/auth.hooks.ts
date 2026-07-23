'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { authService } from './auth.service';
import type { LoginPayload, ResendOtpPayload, VerifyOtpPayload } from './auth.dto';

/** `GET /auth/me` — the single source of truth for auth state. */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/** Step 1 — submit credentials. */
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  });
}

/** Step 2 — verify the emailed OTP. */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
  });
}

/** Resend the emailed OTP. */
export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
  });
}
