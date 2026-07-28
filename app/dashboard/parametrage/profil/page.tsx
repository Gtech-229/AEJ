'use client';

import { DynamicForm } from '@/components/forms';
import { useAuth } from '@/features/auth/auth.context';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { profilSchema, type ProfilInput } from '@/features/profil/profil.schema';
import { getProfilFormConfig } from '@/features/profil/profil.form';
import { useUpdateProfil } from '@/features/profil/profil.hooks';

export default function ProfilPage() {
  const { user, loading } = useAuth();
  const updateProfil = useUpdateProfil();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-6 text-sm text-muted-foreground">
        Chargement…
      </div>
    );
  }

  const defaultValues: ProfilInput = {
    nom: user?.nom ?? '',
    prenom: user?.prenom ?? '',
    email: user?.email ?? '',
    telephone: user?.telephone ?? '',
    adresse: user?.adresse ?? '',
  };

  const initiale = getUserDisplayName(user).charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Informations de votre compte</p>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
            {initiale}
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{getUserDisplayName(user)}</p>
            {/* TODO: afficher le libellé du rôle une fois le module Rôles connecté. */}
            <p className="text-sm text-muted-foreground">
              {user?.role_id ? `Rôle #${user.role_id}` : '—'}
            </p>
          </div>
        </div>

        <DynamicForm<ProfilInput>
          config={getProfilFormConfig()}
          schema={profilSchema}
          defaultValues={defaultValues}
          isLoading={updateProfil.isPending}
          submitText="Enregistrer les modifications"
          onSubmit={(data) => updateProfil.mutate(data)}
        />
      </div>
    </div>
  );
}
