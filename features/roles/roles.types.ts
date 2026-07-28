import type { UserRole } from '@/lib/auth/roles';

/** Une ressource/domaine fonctionnel de la plateforme sur lequel on peut donner des droits. */
export type PermissionResource =
  | 'stagiaires'
  | 'offres'
  | 'financements'
  | 'evaluations'
  | 'entreprises'
  | 'personnel'
  | 'parametrage';

export type PermissionAction = 'voir' | 'creer' | 'modifier' | 'supprimer';

export const PERMISSION_RESOURCES: { id: PermissionResource; label: string }[] = [
  { id: 'stagiaires', label: 'Stagiaires' },
  { id: 'offres', label: 'Offres & Matching' },
  { id: 'financements', label: 'Financements' },
  { id: 'evaluations', label: 'Évaluations' },
  { id: 'entreprises', label: 'Entreprises' },
  { id: 'personnel', label: 'Personnel' },
  { id: 'parametrage', label: 'Paramétrage' },
];

export const PERMISSION_ACTIONS: { id: PermissionAction; label: string }[] = [
  { id: 'voir', label: 'Voir' },
  { id: 'creer', label: 'Créer' },
  { id: 'modifier', label: 'Modifier' },
  { id: 'supprimer', label: 'Supprimer' },
];

/** Matrice complète des droits pour un rôle : ressource -> actions autorisées. */
export type RolePermissions = Record<PermissionResource, PermissionAction[]>;

export type PermissionsByRole = Record<UserRole, RolePermissions>;
