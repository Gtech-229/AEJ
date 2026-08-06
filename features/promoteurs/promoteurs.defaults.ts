import type { Promoteur } from './promoteurs.dto';
import type { PromoteurInput } from './promoteurs.schema';

/** Default form values — from an existing promoteur (edit) or blanks (create). */
export function getPromoteurDefaults(promoteur?: Promoteur): PromoteurInput {
  return {
    nom: promoteur?.nom ?? '',
    localite: promoteur?.localite ?? '',
    telephone: promoteur?.telephone ?? '',
    nombreProjets: promoteur?.nombreProjets ?? 0,
    statut: promoteur?.statut ?? 'actif',
  };
}
