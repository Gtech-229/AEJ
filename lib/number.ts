/**
 * Number formatting for display AND for live number-input entry, in one place
 * so grouping is uniform across the app. French style: space thousands
 * separator, comma decimal (e.g. 1000000 → "1 000 000", 31433885.07 →
 * "31 433 885,07"). The separator is a regular space so values round-trip
 * cleanly through a text input.
 */
const GROUP_SEP = ' ';

/** Reduce any string/number to a bare numeric string: digits + one `.` decimal. */
export function parseNumberInput(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  // Comma → dot, then keep only digits and dots.
  const cleaned = String(value).replace(/,/g, '.').replace(/[^\d.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned;
  // Keep only the first dot (drop any extra ones).
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
}

/** Numeric value from a formatted/raw string, or `null` when empty/invalid. */
export function toNumber(value: string | number | null | undefined): number | null {
  const bare = parseNumberInput(value);
  if (bare === '' || bare === '.') return null;
  const n = Number(bare);
  return Number.isFinite(n) ? n : null;
}

/** Group an integer-digits string into thousands, e.g. "1000000" → "1 000 000". */
function groupThousands(intDigits: string): string {
  return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEP);
}

/**
 * Grouped display of a value (received from the API or set optimistically):
 * `1000000` → "1 000 000", `"31433885.07"` → "31 433 885,07". Empty → "".
 */
export function formatNumber(value: string | number | null | undefined): string {
  const bare = parseNumberInput(value);
  if (bare === '') return '';
  const [int, dec] = bare.split('.');
  const grouped = groupThousands(int || '0');
  return dec !== undefined ? `${grouped},${dec}` : grouped;
}

/**
 * Format a value for a text number INPUT while the user types — same grouping as
 * `formatNumber`, but preserves a trailing decimal separator so they can keep
 * typing decimals (e.g. "1000," stays "1 000,").
 */
export function formatNumberInput(value: string | number | null | undefined): string {
  const bare = parseNumberInput(value);
  if (bare === '') return '';
  const endsWithDot = bare.endsWith('.');
  const [int, dec] = bare.split('.');
  const grouped = groupThousands(int || '');
  if (endsWithDot) return `${grouped},`;
  return dec !== undefined ? `${grouped},${dec}` : grouped;
}
