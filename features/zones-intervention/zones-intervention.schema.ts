import { z } from 'zod';

const optionalNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.coerce.number().optional(),
);

/** Form validation for a zone d'intervention (§9). `projet_id` = a programme. */
export const zoneSchema = z.object({
  projet_id: z.coerce
    .number({ message: 'Le projet est requis' })
    .int()
    .positive('Le projet est requis'),
  adresse: z.string().optional(),
  latitude: optionalNumber,
  longitude: optionalNumber,
});

export type ZoneInput = z.infer<typeof zoneSchema>;
