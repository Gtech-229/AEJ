import type { SpaceKey } from './auth.spaces';

/** Query-key factory for the auth feature. `me` is per-space (each space has its own session). */
export const authKeys = {
  all: ['auth'] as const,
  me: (space: SpaceKey) => [...authKeys.all, 'me', space] as const,
};
