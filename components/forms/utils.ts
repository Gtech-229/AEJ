import type { ColSpan, FieldConfig, FormConfig } from './types';

/** Grid column class for the form container (static classes for the Tailwind scanner). */
export function gridColsClass(columns?: FormConfig['columns']): string {
  switch (columns) {
    case 2:
      return 'sm:grid-cols-2';
    case 3:
      return 'sm:grid-cols-3';
    case 4:
      return 'sm:grid-cols-4';
    default:
      return 'grid-cols-1';
  }
}

/** How many grid tracks a field spans. Only full-width is special-cased for v1. */
export function colSpanClass(colSpan?: ColSpan): string {
  return colSpan === 'full' ? 'sm:col-span-full' : '';
}

/**
 * Conditional visibility. `hidden` always wins. `showWhen` may be a predicate
 * (receives the `dependsOn` value, or the whole form values if unset) or a
 * `{ field: expectedValue }` map that must all match.
 */
export function isFieldVisible(
  field: FieldConfig,
  values: Record<string, unknown>,
): boolean {
  if (field.hidden) return false;
  if (!field.showWhen) return true;

  if (typeof field.showWhen === 'function') {
    const input = field.dependsOn ? values[field.dependsOn] : values;
    return field.showWhen(input);
  }

  return Object.entries(field.showWhen).every(
    ([key, expected]) => values[key] === expected,
  );
}

/** Max-width classes for form dialogs. */
export const DIALOG_SIZES = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
  '2xl': 'sm:max-w-4xl',
} as const;

export type DialogSize = keyof typeof DIALOG_SIZES;
