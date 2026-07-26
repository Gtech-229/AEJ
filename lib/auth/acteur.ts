import { AGENCE_ROLES } from './roles';
import { INSTITUTION_ROLES } from './roles.institution';
import { ENTREPRISE_ROLES } from './roles.entreprise';

export type ActeurType = 'agence' | 'institution_financiere' | 'entreprise';


export function getActeurTypeForRole(role: string | undefined): ActeurType | null {
    if (!role) return null;
    if ((AGENCE_ROLES as readonly string[]).includes(role)) return 'agence';
    if ((INSTITUTION_ROLES as readonly string[]).includes(role)) return 'institution_financiere';
    if ((ENTREPRISE_ROLES as readonly string[]).includes(role)) return 'entreprise';
    return null;
}

export function getHomeRouteForActeur(acteurType: ActeurType): string {
    switch (acteurType) {
        case 'agence':
            return '/dashboard';
        case 'institution_financiere':
            return '/institution/dashboard';
        case 'entreprise':
            return '/entreprise/dashboard';
    }
}