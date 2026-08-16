import type { MegaProjet } from './mega-projets.dto';
import type { MegaProjetInput } from './mega-projets.schema';

export function getMegaProjetDefaults(item?: MegaProjet): MegaProjetInput {
  return {
    titre: item?.titre ?? '',
    secteur_id: item?.secteur_id ?? undefined,
  };
}
