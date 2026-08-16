'use client';

import { useState } from 'react';
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NumberInput } from './number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/generic/combobox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { FieldConfig } from './types';
import { colSpanClass } from './utils';

/** Native <input type> values we render directly through the shadcn Input. */
const NATIVE_INPUT_TYPES = new Set<string>([
  'text', 'email', 'tel', 'url', 'search', 'number', 'range',
  'date', 'time', 'datetime-local', 'month', 'week', 'color',
]);

type Rhf = ControllerRenderProps<FieldValues, string>;

/** Renders a single config field bound to the surrounding react-hook-form. */
export function FormFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  // Hidden: keep the value in form state, render nothing visible.
  if (field.type === 'hidden') {
    return (
      <FormField
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <input type="hidden" name={rhf.name} value={(rhf.value as string) ?? ''} readOnly />
        )}
      />
    );
  }

  const isBoolean = field.type === 'switch' || field.type === 'checkbox';

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) =>
        isBoolean ? (
          <FormItem
            className={cn('flex flex-row items-center gap-3 space-y-0', colSpanClass(field.colSpan))}
          >
            <FormControl>
              {field.type === 'switch' ? (
                <Switch
                  checked={!!rhf.value}
                  onCheckedChange={rhf.onChange}
                  disabled={field.disabled}
                />
              ) : (
                <Checkbox
                  checked={!!rhf.value}
                  onCheckedChange={rhf.onChange}
                  disabled={field.disabled}
                />
              )}
            </FormControl>
            <div className="space-y-0.5 leading-none">
              <FormLabel className="font-normal">
                {field.label}
                {field.required && ' *'}
              </FormLabel>
              {field.helperText && <FormDescription>{field.helperText}</FormDescription>}
            </div>
            <FormMessage />
          </FormItem>
        ) : (
          <FormItem className={colSpanClass(field.colSpan)}>
            <FormLabel>
              {field.label}
              {field.required && ' *'}
            </FormLabel>
            <FieldControl field={field} rhf={rhf} />
            {field.helperText && <FormDescription>{field.helperText}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }
    />
  );
}

/** The actual input control for non-boolean field types. */
function FieldControl({ field, rhf }: { field: FieldConfig; rhf: Rhf }) {
  const [showPassword, setShowPassword] = useState(false);

  switch (field.type) {
    case 'textarea':
      return (
        <FormControl>
          <Textarea
            rows={field.rows ?? 4}
            placeholder={field.placeholder}
            disabled={field.disabled}
            {...rhf}
            value={(rhf.value as string) ?? ''}
          />
        </FormControl>
      );

    case 'select': {
      const raw = rhf.value != null ? String(rhf.value) : '';
      // Normalize a value that matches no option (e.g. a `0`/empty default) to ''
      // so Radix shows the placeholder instead of a blank trigger.
      const current = field.options?.some((o) => String(o.value) === raw) ? raw : '';
      return (
        // Native SelectValue: the trigger CSS-truncates the SELECTED label to its
        // width (line-clamp-1); the dropdown options keep their full label.
        <Select value={current} onValueChange={rhf.onChange} disabled={field.disabled}>
          <FormControl>
            <SelectTrigger className="w-full truncate">
              <SelectValue placeholder={field.placeholder ?? 'Sélectionner…'} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
          {field.options?.map((o) => (
            <SelectItem key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
              <span className="block max-w-[200px]">
                {o.label}
              </span>
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      );
    }

    case 'combobox':
      // Searchable single-select for long option lists (e.g. communes). Emits the
      // option value as a string; `undefined` when cleared. `modal` keeps the
      // search input focused inside a Dialog.
      return (
        <FormControl>
          <Combobox
            options={(field.options ?? []).map((o) => ({ value: String(o.value), label: o.label }))}
            value={rhf.value != null && rhf.value !== '' ? String(rhf.value) : ''}
            onValueChange={(v) => rhf.onChange(v === '' ? undefined : v)}
            placeholder={field.placeholder ?? 'Sélectionner…'}
            searchPlaceholder="Rechercher…"
            allLabel={field.required ? undefined : 'Aucune sélection'}
            disabled={field.disabled}
            modal
          />
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl>
          <RadioGroup
            value={rhf.value != null ? String(rhf.value) : ''}
            onValueChange={rhf.onChange}
            disabled={field.disabled}
            className="flex flex-col gap-2"
          >
            {field.options?.map((o) => {
              const id = `${field.name}-${o.value}`;
              return (
                <div key={String(o.value)} className="flex items-center gap-2">
                  <RadioGroupItem value={String(o.value)} id={id} disabled={o.disabled} />
                  <Label htmlFor={id} className="font-normal">
                    {o.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </FormControl>
      );

    case 'password':
      return (
        <FormControl>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className="pr-10"
              {...rhf}
              value={(rhf.value as string) ?? ''}
            />
            {(field.showPasswordToggle ?? true) && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        </FormControl>
      );

    case 'amount':
      // Formatted number: live thousands separators, emits the bare number.
      return (
        <FormControl>
          <NumberInput
            placeholder={field.placeholder}
            disabled={field.disabled}
            value={rhf.value as number | string | null | undefined}
            onValueChange={(v) => rhf.onChange(v ?? undefined)}
          />
        </FormControl>
      );

    default: {
      // Native input types + a text fallback for not-yet-specialized types
      // (multiselect, file, daterange, …).
      const inputType = NATIVE_INPUT_TYPES.has(field.type) ? field.type : 'text';
      const isNumeric = field.type === 'number' || field.type === 'range';
      return (
        <FormControl>
          <Input
            type={inputType}
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            maxLength={field.maxLength}
            minLength={field.minLength}
            {...rhf}
            value={(rhf.value as string | number | undefined) ?? ''}
            onChange={(e) =>
              rhf.onChange(
                isNumeric
                  ? e.target.value === ''
                    ? undefined
                    : Number(e.target.value)
                  : e.target.value,
              )
            }
          />
        </FormControl>
      );
    }
  }
}
