'use client';

import { DynamicForm } from '@/components/forms';
import { passwordSchema, type PasswordInput } from '@/features/password/password.schema';
import { getPasswordFormConfig } from '@/features/password/password.form';
import { useChangePassword } from '@/features/password/password.hooks';

const EMPTY_FORM: PasswordInput = {
  mot_de_passe_actuel: '',
  nouveau_mot_de_passe: '',
  confirmation_mot_de_passe: '',
};

export default function PasswordPage() {
  const changePassword = useChangePassword();

  return (
    <div className="mx-auto max-w-lg space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Changer le mot de passe</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Choisissez un nouveau mot de passe pour votre compte
        </p>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <DynamicForm<PasswordInput>
          config={getPasswordFormConfig()}
          schema={passwordSchema}
          defaultValues={EMPTY_FORM}
          isLoading={changePassword.isPending}
          submitText="Modifier le mot de passe"
          onSubmit={(data) => changePassword.mutate(data)}
        />
      </div>
    </div>
  );
}
