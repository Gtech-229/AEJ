'use client';

import { useMemo, useState } from 'react';
import { ShieldCheck, RotateCcw, Save } from 'lucide-react';
import { PageHeader } from '@/components/legacy-ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AGENCE_ROLES, ADMIN_ROLES, ROLE_LABELS, type UserRole } from '@/lib/auth/roles';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSION_RESOURCES, PERMISSION_ACTIONS, type PermissionsByRole } from './roles.types';
import { SEED_PERMISSIONS, hasPermission } from './roles.data';

export function RolesPermissionsPage() {
  const { user } = useAuth();
  const [matrix, setMatrix] = useState<PermissionsByRole>(SEED_PERMISSIONS);
  const [selectedRole, setSelectedRole] = useState<UserRole>('directeur_finances');
  const [isDirty, setIsDirty] = useState(false);

  const canEdit = !!user?.role && (ADMIN_ROLES as readonly string[]).includes(user.role);

  const isEditableRole = !ADMIN_ROLES.includes(selectedRole);

  function toggle(resource: (typeof PERMISSION_RESOURCES)[number]['id'], action: (typeof PERMISSION_ACTIONS)[number]['id']) {
    if (!canEdit || !isEditableRole) return;
    setMatrix((prev) => {
      const current = prev[selectedRole][resource];
      const next = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];
      return {
        ...prev,
        [selectedRole]: { ...prev[selectedRole], [resource]: next },
      };
    });
    setIsDirty(true);
  }

  function handleReset() {
    setMatrix(SEED_PERMISSIONS);
    setIsDirty(false);
  }

  function handleSave() {
    // TODO: brancher sur l'API (ex. PUT /api/roles/:role/permissions) une
    // fois le backend de gestion des droits disponible.
    setIsDirty(false);
  }

  const roleCounts = useMemo(() => {
    const counts: Record<UserRole, number> = {} as Record<UserRole, number>;
    for (const role of AGENCE_ROLES) {
      counts[role] = Object.values(matrix[role]).reduce((sum, actions) => sum + actions.length, 0);
    }
    return counts;
  }, [matrix]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] px-6 py-6 max-w-6xl mx-auto">
      <PageHeader
        title="Rôles & permissions"
        subtitle="Droits d'accès par profil pour l'espace Agence"
        actions={
          canEdit && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
                <RotateCcw className="mr-2 size-4" />
                Réinitialiser
              </Button>
              <Button onClick={handleSave} disabled={!isDirty}>
                <Save className="mr-2 size-4" />
                Enregistrer
              </Button>
            </div>
          )
        }
      />

      {!canEdit && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          <ShieldCheck className="size-4 shrink-0" />
          Lecture seule — seuls l'administrateur général et le directeur général peuvent modifier ces droits.
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
          <TabsList className="flex-wrap h-auto gap-1">
            {AGENCE_ROLES.map((role) => (
              <TabsTrigger key={role} value={role} className="gap-1.5">
                {ROLE_LABELS[role]}
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                  {roleCounts[role]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {!isEditableRole && (
          <p className="mt-4 text-xs text-muted-foreground italic">
            {ROLE_LABELS[selectedRole]} dispose d'un accès complet à toutes les fonctionnalités par défaut,
            non modifiable ici.
          </p>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left font-medium text-gray-500 pb-2 pr-4">Ressource</th>
                {PERMISSION_ACTIONS.map((action) => (
                  <th key={action.id} className="text-center font-medium text-gray-500 pb-2 px-3 min-w-20">
                    {action.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_RESOURCES.map((resource, i) => (
                <tr key={resource.id} className={i % 2 === 0 ? 'bg-gray-50/60' : ''}>
                  <td className="py-2.5 pr-4 font-medium text-gray-800 rounded-l-lg">
                    {resource.label}
                  </td>
                  {PERMISSION_ACTIONS.map((action) => (
                    <td key={action.id} className="py-2.5 px-3 text-center">
                      <Switch
                        checked={hasPermission(matrix, selectedRole, resource.id, action.id)}
                        onCheckedChange={() => toggle(resource.id, action.id)}
                        disabled={!canEdit || !isEditableRole}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}