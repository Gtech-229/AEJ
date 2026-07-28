import type { Service } from './services.dto';
import type { ServiceInput } from './services.schema';

/** Default form values — from an existing service (edit) or blanks (create). */
export function getServiceDefaults(service?: Service): ServiceInput {
  return {
    nom: service?.nom ?? '',
    code: service?.code ?? '',
    description: service?.description ?? '',
    direction_id: service?.direction_id ?? 0,
  };
}
