import type { CreateZonePayload, ZoneIntervention } from './zones-intervention.dto';
import type { ZoneInput } from './zones-intervention.schema';

export function getZoneDefaults(item?: ZoneIntervention): ZoneInput {
  return {
    projet_id: item?.projet_id ?? 0,
    adresse: item?.adresse ?? '',
    latitude: item?.latitude != null ? Number(item.latitude) : undefined,
    longitude: item?.longitude != null ? Number(item.longitude) : undefined,
  };
}

export function toZonePayload(data: ZoneInput): CreateZonePayload {
  return {
    projet_id: data.projet_id,
    adresse: data.adresse || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
  };
}
