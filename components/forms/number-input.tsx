'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatNumberInput, toNumber } from '@/lib/number';

export interface NumberInputProps
  extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> {
  /** The numeric value (or a numeric string). */
  value: number | string | null | undefined;
  /** Emits the parsed number (or `null` when cleared) — the value to save. */
  onValueChange: (value: number | null) => void;
}

/**
 * Text input that shows a live thousands-separated value as the user types
 * (e.g. "1 000 000") while emitting the bare number to `onValueChange`. Because
 * both the displayed value and the emitted value flow through the same
 * `lib/number` helpers, a received or optimistic value renders identically to
 * one the user just typed.
 *
 * Note: reformatting on each keystroke moves the caret to the end — fine for
 * appending amounts; mid-string edits jump to the end.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, onValueChange, className, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      className={cn('tabular-nums', className)}
      value={formatNumberInput(value)}
      onChange={(e) => onValueChange(toNumber(e.target.value))}
      {...props}
    />
  );
});
