'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query/get-query-client';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AccentProvider } from '@/components/theme/accent-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/auth.context';

/**
 * Client boundary wiring TanStack Query + theming into the tree.
 * `getQueryClient()` returns the browser singleton here, so provider re-renders
 * reuse one client. Devtools are only mounted in development.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccentProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </AuthProvider>
        </AccentProvider>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
