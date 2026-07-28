import type { FormConfig } from '@/components/forms';

export function getPasswordFormConfig(): FormConfig {
  return {
    columns: 1,
    fields: [
      {
        name: 'mot_de_passe_actuel',
        label: 'Mot de passe actuel',
        type: 'password',
        required: true,
      },
      {
        name: 'nouveau_mot_de_passe',
        label: 'Nouveau mot de passe',
        type: 'password',
        required: true,
        minLength: 8,
        helperText: 'Minimum 8 caractères',
      },
      {
        name: 'confirmation_mot_de_passe',
        label: 'Confirmer le nouveau mot de passe',
        type: 'password',
        required: true,
      },
    ],
  };
}