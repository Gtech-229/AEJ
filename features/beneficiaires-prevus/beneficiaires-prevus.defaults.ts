import type { BeneficiairePrevu } from './beneficiaires-prevus.dto';
import type { BeneficiairePrevuInput } from './beneficiaires-prevus.schema';

/** Default form values — from an existing bénéficiaire prévu (edit) or blanks (create). */
export function getBeneficiairePrevuDefaults(
  beneficiaire?: BeneficiairePrevu,
): BeneficiairePrevuInput {
  return {
    categorie: beneficiaire?.categorie ?? '',
    guichet_id: beneficiaire?.guichet_id ?? 0,
    localite_id: beneficiaire?.localite_id ?? 0,
    nombre_prevu: beneficiaire?.nombre_prevu ?? 0,
  };
}
