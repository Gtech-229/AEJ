import type { Jeune, Sexe } from './jeunes.dto';
import type { JeuneInput } from './jeunes.schema';

/** Default form values — from an existing jeune (edit) or blanks (create). */
export function getJeuneDefaults(jeune?: Jeune): JeuneInput {
  return {
    nom: jeune?.nom ?? '',
    prenom: jeune?.prenom ?? '',
    email: jeune?.email ?? '',
    telephone: jeune?.telephone ?? '',
    // '' is the empty-select placeholder state; validation requires a choice.
    sexe: (jeune?.sexe ?? '') as Sexe,
    datenaissance: jeune?.datenaissance ?? '',
    lieunaissance: jeune?.lieunaissance ?? '',
    matriculeaej: jeune?.matriculeaej ?? '',
    numerocni: jeune?.numerocni ?? '',
    numerocnps: jeune?.numerocnps ?? '',
    raison_sociale: jeune?.raison_sociale ?? '',
    typepieceidentite_id: jeune?.typepieceidentite_id ?? undefined,
    secteuractivite_id: jeune?.secteuractivite_id ?? undefined,
    soussecteuractivite_id: jeune?.soussecteuractivite_id ?? undefined,
    situationmatrimoniale_id: jeune?.situationmatrimoniale_id ?? undefined,
    niveauetude_id: jeune?.niveauetude_id ?? undefined,
    agence_id: jeune?.agence_id ?? undefined,
    nomdupere: jeune?.nomdupere ?? '',
    nomdelamere: jeune?.nomdelamere ?? '',
  };
}
