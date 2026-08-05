/**
 * Whole-years age from a date of birth.
 *
 * Accepts a `Date` or an ISO / `yyyy-MM-dd` string. Returns `null` for a
 * missing or unparseable date. Correctly accounts for whether this year's
 * birthday has already passed.
 */
export function getAge(
  dob: string | Date | null | undefined,
  now: Date = new Date(),
): number | null {
  if (!dob) return null;
  const birth = dob instanceof Date ? dob : new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;

  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

/**
 * Format a date as `dd/mm/yyyy` (fr). Accepts a `Date` or ISO string; returns
 * `—` for a missing or unparseable value.
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR');
}
