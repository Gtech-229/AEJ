'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { LoadingState } from '@/components/generic/loader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MODULES } from '@/features/permissions/permissions.modules';
import type { Permission } from '@/features/permissions/permissions.dto';
import {
  useCreatePermission,
  usePermissionsByRole,
  useUpdatePermission,
} from '@/features/permissions/permissions.hooks';
import type { Role } from './roles.dto';

interface Row {
  acces: boolean;
  full_access: boolean;
  id?: number;
}
type Matrix = Record<string, Row>;

/** One row per known module, seeded from the role's saved permissions. */
function buildMatrix(perms: Permission[] | undefined): Matrix {
  const byModule = new Map((perms ?? []).map((p) => [p.module, p]));
  const matrix: Matrix = {};
  for (const mod of MODULES) {
    const p = byModule.get(mod.key);
    matrix[mod.key] = { acces: !!p?.acces, full_access: !!p?.full_access, id: p?.id };
  }
  return matrix;
}

/**
 * "Permissions" action for a role: a side sheet with a module × {accès, accès
 * complet} matrix. Saving upserts a `Permission` row per changed module.
 */
export function RolePermissionsButton({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const { data: perms, isLoading } = usePermissionsByRole(open ? role.id : undefined);
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();
  const [matrix, setMatrix] = useState<Matrix>(() => buildMatrix(undefined));
  const [dirty, setDirty] = useState(false);

  // Re-seed the editable matrix whenever the saved permissions (re)load.
  useEffect(() => {
    setMatrix(buildMatrix(perms));
    setDirty(false);
  }, [perms]);

  const saving = createPermission.isPending || updatePermission.isPending;

  function toggle(moduleKey: string, field: 'acces' | 'full_access', value: boolean) {
    setMatrix((prev) => {
      const row = { ...prev[moduleKey], [field]: value };
      // Full access implies access; removing access removes full access too.
      if (field === 'full_access' && value) row.acces = true;
      if (field === 'acces' && !value) row.full_access = false;
      return { ...prev, [moduleKey]: row };
    });
    setDirty(true);
  }

  async function handleSave() {
    const original = buildMatrix(perms);
    const ops: Promise<unknown>[] = [];

    for (const mod of MODULES) {
      const next = matrix[mod.key];
      const prev = original[mod.key];
      const changed = next.acces !== prev.acces || next.full_access !== prev.full_access;
      const autorise = next.acces || next.full_access;

      if (next.id != null) {
        if (changed) {
          ops.push(
            updatePermission.mutateAsync({
              id: next.id,
              role_id: role.id,
              module: mod.key,
              autorise,
              acces: next.acces,
              full_access: next.full_access,
            }),
          );
        }
      } else if (autorise) {
        ops.push(
          createPermission.mutateAsync({
            role_id: role.id,
            module: mod.key,
            autorise,
            acces: next.acces,
            full_access: next.full_access,
          }),
        );
      }
    }

    if (ops.length === 0) {
      setDirty(false);
      return;
    }

    try {
      await Promise.all(ops);
      toast.success('Permissions enregistrées');
      setDirty(false);
      setOpen(false);
    } catch {
      // Individual mutations already surface their own error toasts.
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldCheck className="size-4" />
          Permissions
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            Permissions — {role.libelle}
          </SheetTitle>
          <SheetDescription>
            Définissez, par module, ce que ce rôle peut consulter et modifier.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <LoadingState className="py-6" size="default" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Module</th>
                  <th className="py-2 px-3 text-center font-medium">Accès</th>
                  <th className="py-2 px-3 text-center font-medium">Accès complet</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod) => {
                  const row = matrix[mod.key];
                  return (
                    <tr key={mod.key} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-foreground">{mod.label}</td>
                      <td className="py-2.5 px-3 text-center">
                        <Switch
                          checked={row?.acces ?? false}
                          onCheckedChange={(v) => toggle(mod.key, 'acces', v)}
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Switch
                          checked={row?.full_access ?? false}
                          onCheckedChange={(v) => toggle(mod.key, 'full_access', v)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t px-4 py-4">
          <Button className="w-full" onClick={handleSave} disabled={!dirty || saving}>
            <Save className="size-4" />
            {saving ? 'Enregistrement…' : 'Enregistrer les permissions'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
