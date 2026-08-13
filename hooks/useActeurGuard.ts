'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth.context';
import { SPACES } from '@/features/auth/auth.spaces';
import {
    getActeurTypeForUser,
    getHomeRouteForActeur,
    hasSpaceMembership,
    type ActeurType,
} from '@/lib/auth/acteur';

interface ActeurGuardResult {
    user: ReturnType<typeof useAuth>['user'];
    loading: boolean;
    /** true une fois qu'on sait que l'utilisateur a le droit d'être ici. */
    allowed: boolean;
}


export function useActeurGuard(expected: ActeurType): ActeurGuardResult {
    const { user, loading } = useAuth();
    const router = useRouter();
    const acteurType = getActeurTypeForUser(user);
    // Preview spaces (organismes / entreprise) aren't guarded yet — they render
    // as free templates with no session. Flip `authLive` in auth.spaces to guard.
    const guarded = SPACES[expected].authLive;

    useEffect(() => {
        if (!guarded) return;
        if (loading) return;
        if (!user) {
            router.replace(SPACES[expected].loginPath);
            return;
        }
        // Only redirect when we can positively resolve a DIFFERENT acteur space.
        // Until role_id → slug is mapped for entreprise/institution (see
        // lib/auth/acteur.ts), an unknown acteur type stays permissive rather
        // than bouncing the user somewhere wrong.
        if (acteurType && acteurType !== expected) {
            router.replace(getHomeRouteForActeur(acteurType));
            return;
        }
        // Right space, but not attached to an organisme/agence (AEJ-20) —
        // bounce back to sign-in rather than showing an empty/broken dashboard.
        if (!hasSpaceMembership(expected, user)) {
            router.replace(`${SPACES[expected].loginPath}?error=no_access`);
        }
    }, [guarded, loading, user, acteurType, expected, router]);

    const allowed =
        !guarded ||
        (!loading &&
            !!user &&
            (acteurType === null || acteurType === expected) &&
            hasSpaceMembership(expected, user));
    return { user, loading, allowed };
}
