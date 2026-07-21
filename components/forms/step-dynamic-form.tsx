'use client';

import { useMemo, useState } from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormFieldRenderer } from './form-field';
import { gridColsClass, isFieldVisible } from './utils';
import type { FormConfig } from './types';

export interface StepDynamicFormProps<T extends FieldValues = FieldValues> {
  config: FormConfig & { steps: NonNullable<FormConfig['steps']> };
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  loadingText?: string;
  onCancel?: () => void;
  cancelText?: string;
  className?: string;
}

/**
 * Multi-step form driven by `config.steps` + each field's `formStep`. Validates
 * only the current step's fields before advancing (`form.trigger`), and submits
 * the whole payload on the last step.
 */
export function StepDynamicForm<T extends FieldValues = FieldValues>({
  config,
  schema,
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Soumettre',
  loadingText = 'Envoi…',
  onCancel,
  cancelText = 'Annuler',
  className,
}: StepDynamicFormProps<T>) {
  const steps = useMemo(
    () => [...config.steps].sort((a, b) => a.step - b.step),
    [config.steps],
  );
  const [current, setCurrent] = useState(steps[0]?.step ?? 1);

  const form = useForm<T>({
    resolver: zodResolver(
      schema as unknown as Parameters<typeof zodResolver>[0],
    ) as unknown as Resolver<T>,
    defaultValues,
    mode: 'onChange',
  });

  const values = form.watch() as Record<string, unknown>;
  const stepIndex = steps.findIndex((s) => s.step === current);
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex === steps.length - 1;

  const currentFields = config.fields.filter(
    (f) => (f.formStep ?? steps[0]?.step ?? 1) === current && isFieldVisible(f, values),
  );

  async function goNext() {
    const names = currentFields.map((f) => f.name as Path<T>);
    const valid = await form.trigger(names);
    if (valid && steps[stepIndex + 1]) setCurrent(steps[stepIndex + 1].step);
  }

  function goBack() {
    if (steps[stepIndex - 1]) setCurrent(steps[stepIndex - 1].step);
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<T>)}
        className={cn('space-y-6', className)}
      >
        {/* Step indicator */}
        <ol className="flex items-center gap-2">
          {steps.map((s, i) => {
            const done = i < stepIndex;
            const active = s.step === current;
            return (
              <li key={s.step} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium',
                    active && 'border-primary bg-primary text-primary-foreground',
                    done && 'border-primary bg-primary/10 text-primary',
                    !active && !done && 'border-border text-muted-foreground',
                  )}
                >
                  {done ? <Check size={16} /> : i + 1}
                </div>
                <div className="min-w-0">
                  <p className={cn('truncate text-sm font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
                    {s.title}
                  </p>
                  {s.description && (
                    <p className="truncate text-xs text-muted-foreground">{s.description}</p>
                  )}
                </div>
                {i < steps.length - 1 && <div className="h-px flex-1 bg-border" />}
              </li>
            );
          })}
        </ol>

        <div className={cn('grid gap-4', gridColsClass(config.columns))}>
          {currentFields.map((field) => (
            <FormFieldRenderer key={field.name} field={field} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                {cancelText}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button type="button" variant="outline" onClick={goBack} disabled={isLoading}>
                Précédent
              </Button>
            )}
            {isLast ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? loadingText : submitText}
              </Button>
            ) : (
              <Button type="button" onClick={goNext} disabled={isLoading}>
                Suivant
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
