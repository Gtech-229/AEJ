import type { FieldConfig, FormConfig } from '@/components/forms';

/** Field config for the create/edit personnel form. Names match the API 1:1. */
export function getPersonnelFormConfig(mode: 'create' | 'edit'): FormConfig {
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
      type: 'number',
      required: true,
      min: 1,
      // TODO: remplacer par un select une fois le module Rôles livré.
      helperText: "Sélecteur à venir — en attendant, saisir l'ID du rôle",
    },
    {
      name: 'fonction_id',
      label: 'Fonction',
      type: 'number',
      required: true,
      min: 1,
      // TODO: remplacer par un select branché sur le module Fonctions
      // (features/fonctions) une fois son API atteignable.
      helperText: "Sélecteur à venir — en attendant, saisir l'ID de la fonction",
    },
  );

  return { columns: 2, fields };
}
