import type { Operation } from './finances.dto';
import type { OperationInput } from './finances.schema';

/** Default form values — from an existing operation (edit) or blanks (create). */
export function getOperationDefaults(operation?: Operation): OperationInput {
  return {
    beneficiaire: operation?.beneficiaire ?? '',
    montant: operation?.montant ?? 0,
    typeOperation: operation?.typeOperation ?? '',
    date: operation?.date ?? '',
    statut: operation?.statut ?? 'effectue',
  };
}
