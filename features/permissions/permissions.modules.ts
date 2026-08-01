/**
 * The functional modules access can be granted on — the rows of the permission
 * matrix and the `module` value stored on each `Permission`. `key` is the
 * backend-owned identifier; `label` is the French UI name.
 *
 * TODO(backend): confirm the exact `module` keys. `utilisateurs` matches the
 * documented example payload (`{ module: "utilisateurs", … }`); the rest mirror
 * the app's domains and may need aligning once the backend enumerates them.
 */
export interface AppModule {
  key: string;
  label: string;
}

export const MODULES: AppModule[] = [
  { key: 'jeunes', label: 'Jeunes bénéficiaires' },
  { key: 'entreprises', label: 'Entreprises' },
  { key: 'organismes', label: 'Organismes' },
  { key: 'financements', label: 'Financements' },
  { key: 'indicateurs', label: 'Indicateurs' },
  { key: 'utilisateurs', label: 'Personnel' },
  { key: 'roles', label: 'Rôles & permissions' },
  { key: 'localites', label: 'Localités' },
  { key: 'configurations', label: 'Paramètres système' },
];
