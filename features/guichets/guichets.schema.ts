import { z } from 'zod';

const optionalNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.coerce.number().min(0).optional(),
);

/** Form validation for a guichet (§10). `code` is required + unique. */
export const guichetSchema = z
  .object({
    code: z.string().min(1, 'Le code est requis'),
    libelle: z.string().min(1, 'Le libellé est requis'),
    description: z.string().optional(),
    couleur: z.string().optional(),
    montant_min: optionalNumber,
    montant_max: optionalNumber,
    is_active: z.boolean().optional(),
    is_form_active: z.boolean().optional(),
  })
  .refine(
    (v) =>
      v.montant_min == null || v.montant_max == null || Number(v.montant_max) >= Number(v.montant_min),
    { message: 'Le montant max doit être ≥ au montant min', path: ['montant_max'] },
  );

export type GuichetInput = z.infer<typeof guichetSchema>;
