import { AGENCE_ROLES } from '@/lib/auth/roles';
import type { PermissionAction, PermissionResource, PermissionsByRole, RolePermissions } from './roles.types';

const ALL: PermissionAction[] = ['voir', 'creer', 'modifier', 'supprimer'];
const READ: PermissionAction[] = ['voir'];
const READ_WRITE: PermissionAction[] = ['voir', 'creer', 'modifier'];
const NONE: PermissionAction[] = [];

function full(): RolePermissions {
  return {
    stagiaires: ALL,
    offres: ALL,
    financements: ALL,
    evaluations: ALL,
    entreprises: ALL,
    personnel: ALL,
    parametrage: ALL,
  };
}

/**
 * Matrice de départ, alignée sur ce qui est déjà encodé ailleurs dans l'app
 * (Sidebar.tsx roles=[...], dashboard.config.ts). admin_general et
 * directeur_general gardent un accès complet, comme partout ailleurs.
 * TODO: brancher sur une vraie source de vérité (API / table `role_permissions`)
 * une fois le backend de gestion des droits disponible — ceci reste éditable
 * en mémoire pour prototypage.
 */
export const SEED_PERMISSIONS: PermissionsByRole = {
  admin_general: full(),
  directeur_general: full(),

  directeur_finances: {
    stagiaires: READ,
    offres: READ,
    financements: ALL,
    evaluations: READ,
    entreprises: READ,
    personnel: NONE,
    parametrage: NONE,
  },
  directeur_suivi_evaluation: {
    stagiaires: READ_WRITE,
    offres: READ_WRITE,
    financements: READ,
    evaluations: ALL,
    entreprises: READ,
    personnel: NONE,
    parametrage: NONE,
  },
  directeur_si: {
    stagiaires: READ,
    offres: READ,
    financements: NONE,
    evaluations: NONE,
    entreprises: READ_WRITE,
    personnel: ALL,
    parametrage: ALL,
  },

  comptable: {
    stagiaires: NONE,
    offres: NONE,
    financements: READ_WRITE,
    evaluations: NONE,
    entreprises: READ,
    personnel: NONE,
    parametrage: NONE,
  },
  analyste: {
    stagiaires: READ,
    offres: READ,
    financements: READ,
    evaluations: READ_WRITE,
    entreprises: READ,
    personnel: NONE,
    parametrage: NONE,
  },
  auditeur: {
    stagiaires: READ,
    offres: READ,
    financements: READ,
    evaluations: READ,
    entreprises: READ,
    personnel: READ,
    parametrage: READ,
  },
};

export function hasPermission(
  matrix: PermissionsByRole,
  role: keyof PermissionsByRole,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  return matrix[role]?.[resource]?.includes(action) ?? false;
}

// Sanity check dev-only : s'assure que chaque rôle Agence a bien une entrée.
if (process.env.NODE_ENV !== 'production') {
  for (const role of AGENCE_ROLES) {
    if (!SEED_PERMISSIONS[role]) {
      // eslint-disable-next-line no-console
      console.warn(`[roles.data] Aucune matrice de permissions pour le rôle "${role}".`);
    }
  }
}
