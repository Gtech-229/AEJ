import type { Dispositif } from './dispositifs.dto';
import type { DispositifInput } from './dispositifs.schema';

/** Default form values — from an existing dispositif (edit) or blanks (create). */
export function getDispositifDefaults(dispositif?: Dispositif): DispositifInput {
  return {
    code: dispositif?.code ?? '',
    libelle: dispositif?.libelle ?? '',
    description: dispositif?.description ?? '',
  };
}
