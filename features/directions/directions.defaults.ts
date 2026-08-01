import type { Direction } from './directions.dto';
import type { DirectionInput } from './directions.schema';

/** Default form values — from an existing direction (edit) or blanks (create). */
export function getDirectionDefaults(direction?: Direction): DirectionInput {
  return {
    nom: direction?.nom ?? '',
    code: direction?.code ?? '',
    description: direction?.description ?? '',
  };
}
