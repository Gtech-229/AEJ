import type { FieldConfig, FormConfig } from '@/components/forms';
import { refOptions, type RefItem } from '@/features/referentials/referentials.types';

/** Referential lists backing the role/fonction selects. */
export interface PersonnelFormRefs {
  roles: RefItem[];
  fonctions: RefItem[];
}

/** Field config for the create/edit personnel form. Names match the API 1:1. */
export function getPersonnelFormConfig(
  mode: 'create' | 'edit',
  refs: PersonnelFormRefs,
): FormConfig {
  const fields: FieldConfig[] = [
    { name: 'nom', label: 'Nom', type: 'text', required: true, placeholder: 'Koné' },
    { name: 'prenom', label: 'Prénom', type: 'text', required: true, placeholder: 'Awa' },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'awa@aej.ci',
      colSpan: 'full',
    },
    { name: 'telephone', label: 'Téléphone', type: 'tel', required: true, placeholder: '+2250700000000' },
    { name: 'adresse', label: 'Adresse', type: 'text', required: true, colSpan: 'full' },
  ];

  if (mode === 'create') {
    fields.push({
      name: 'mot_de_passe',
      label: 'Mot de passe',
      type: 'password',
      required: true,
      minLength: 8,
      helperText: 'Minimum 8 caractères',
      colSpan: 'full',
    });
  }

  fields.push(
    {
      name: 'role_id',
      label: 'Rôle',
      type: 'select',
      required: true,
      placeholder: 'Sélectionner un rôle…',
      options: refOptions(refs.roles),
    },
    {
      name: 'fonction_id',
      label: 'Fonction',
      type: 'select',
      required: true,
      placeholder: 'Sélectionner une fonction…',
      options: refOptions(refs.fonctions),
    },
  );

  return { columns: 2, fields };
}
