'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getActeurTypeForRole, getHomeRouteForActeur, type ActeurType } from '@/lib/auth/acteur';

interface ActeurGuardResult {
    user: ReturnType<typeof useAuth>['user'];
    loading: boolean;
    /** true une fois qu'on sait que l'utilisateur a le droit d'être ici. */
    allowed: boolean;
}


export function useActeurGuard(expected: ActeurType): ActeurGuardResult {
    const { user, loading } = useAuth();
    const router = useRouter();
    const acteurType = user ? getActeurTypeForRole(user.role) : null;

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace('/auth/login');
            return;
        }
        if (acteurType && acteurType !== expected) {
            router.replace(getHomeRouteForActeur(acteurType));
        }
    }, [loading, user, acteurType, expected, router]);

    return { user, loading, allowed: !loading && !!user && acteurType === expected };
}