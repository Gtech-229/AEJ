'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth.context';
import { getActeurTypeForUser, getHomeRouteForActeur, type ActeurType } from '@/lib/auth/acteur';

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

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace('/auth/login');
            return;
        }
        // Only redirect when we can positively resolve a DIFFERENT acteur space.
        // Until role_id → slug is mapped for entreprise/institution (see
        // lib/auth/acteur.ts), an unknown acteur type stays permissive rather
        // than bouncing the user somewhere wrong.
        if (acteurType && acteurType !== expected) {
            router.replace(getHomeRouteForActeur(acteurType));
        }
    }, [loading, user, acteurType, expected, router]);

    const allowed = !loading && !!user && (acteurType === null || acteurType === expected);
    return { user, loading, allowed };
}
