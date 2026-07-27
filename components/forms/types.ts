/**
 * Config-driven form types. A form is declared as data (`FieldConfig[]`) and
 * rendered by `DynamicForm`. Labels are plain French strings (no i18n).
 * Validation is owned by the Zod `schema` passed to `DynamicForm` (the feature's
 * `*.schema.ts`); `FieldConfig` describes presentation + input behavior.
 */
export type FieldType =
  | 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  | 'textarea' | 'number' | 'range'
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'select' | 'radio' | 'checkbox' | 'switch'
  | 'color' | 'hidden'
  // Declared for config authors; not yet specially rendered (fall back to text):
  | 'daterange' | 'multiselect' | 'select-with-other' | 'checkbox-group'
  | 'file' | 'image';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type ColSpan = 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4;

export interface FieldConfig {
  name: string;
  label: string;                 // plain French text
  type: FieldType;
  placeholder?: string;
  required?: boolean;            // visual marker only — Zod enforces
  disabled?: boolean;
  options?: SelectOption[];      // select / radio
  isLoading?: boolean;           // async options loading
  helperText?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  rows?: number;                 // textarea
  step?: number;                 // number/range
  dependsOn?: string;            // field whose value drives `showWhen`
  showWhen?: ((value: unknown) => boolean) | Record<string, unknown>;
  hidden?: boolean;              // permanently hidden (still registered)
  colSpan?: ColSpan;
  showPasswordToggle?: boolean;  // password (default true)
  formStep?: number;             // step index for StepDynamicForm
}

export interface StepConfig {
  step: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface FormConfig {
  fields: FieldConfig[];
  columns?: 1 | 2 | 3 | 4;
  steps?: StepConfig[];
}
