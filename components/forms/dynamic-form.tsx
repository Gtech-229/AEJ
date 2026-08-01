'use client';

import { useEffect } from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormFieldRenderer } from './form-field';
import { gridColsClass, isFieldVisible } from './utils';
import type { FormConfig } from './types';

export interface DynamicFormProps<T extends FieldValues = FieldValues> {
  config: FormConfig;
  /** The feature's Zod schema — single source of truth for validation + types. */
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  loadingText?: string;
  onCancel?: () => void;
  cancelText?: string;
  onBack?: () => void;
  backText?: string;
  onFieldChange?: (name: string, value: unknown) => void;
  /** Omit the surrounding footer (e.g. submitting from a dialog's own button). */
  hideFormFooter?: boolean;
  /** Lets an external button submit via `form={formId}`. */
  formId?: string;
  className?: string;
  renderAfter?: React.ReactNode;
}

/**
 * Renders a `FormConfig` with react-hook-form + Zod validation. Fields are
 * filtered by `hidden`/`showWhen`, laid out on a grid (`config.columns`), and
 * each is rendered by `FormFieldRenderer`. `onSubmit` receives parsed values —
 * wire it to the feature's mutation hook.
 */
export function DynamicForm<T extends FieldValues = FieldValues>({
  config,
  schema,
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Enregistrer',
  loadingText = 'Enregistrement…',
  onCancel,
  cancelText = 'Annuler',
  onBack,
  backText = 'Retour',
  onFieldChange,
  hideFormFooter,
  formId,
  className,
  renderAfter,
}: DynamicFormProps<T>) {
  const form = useForm<T>({
    // Zod generic vs RHF resolver generic don't line up cleanly; the runtime is correct.
    resolver: zodResolver(
      schema as unknown as Parameters<typeof zodResolver>[0],
    ) as unknown as Resolver<T>,
    defaultValues,
  });

  useEffect(() => {
    if (!onFieldChange) return;
    const sub = form.watch((values, { name }) => {
      if (name) onFieldChange(name, (values as Record<string, unknown>)[name]);
    });
    return () => sub.unsubscribe();
  }, [form, onFieldChange]);

  const values = form.watch() as Record<string, unknown>;
  const visibleFields = config.fields.filter((f) => isFieldVisible(f, values));

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<T>)}
        className={cn('space-y-6', className)}
      >
        <div className={cn('grid gap-4', gridColsClass(config.columns))}>
          {visibleFields.map((field) => (
            <FormFieldRenderer key={field.name} field={field} />
          ))}
        </div>

        {renderAfter}

        {!hideFormFooter && (
          <div className="sticky bottom-0 z-10 -mx-6 flex items-center justify-end gap-2 border-t border-border bg-background px-6 py-4">
            {onBack && (
              <Button type="button" variant="ghost" onClick={onBack} disabled={isLoading}>
                {backText}
              </Button>
            )}
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? loadingText : submitText}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
