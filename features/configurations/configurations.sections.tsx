'use client';

import { useRef, useState } from 'react';
import type { FieldValues, DefaultValues } from 'react-hook-form';
import type { ZodType } from 'zod';
import { Camera, ImageIcon, Loader2 } from 'lucide-react';
import { DynamicForm, type FormConfig } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Configuration } from './configurations.dto';
import {
  identiteSchema,
  coordonneesSchema,
  financeSchema,
  securiteSchema,
  notificationsSchema,
  integrationsSchema,
} from './configurations.schema';
import {
  getIdentiteConfig,
  getCoordonneesConfig,
  getFinanceConfig,
  getSecuriteConfig,
  getNotificationsConfig,
  getIntegrationsConfig,
} from './configurations.form';
import {
  getIdentiteDefaults,
  getCoordonneesDefaults,
  getFinanceDefaults,
  getSecuriteDefaults,
  getNotificationsDefaults,
  getIntegrationsDefaults,
} from './configurations.defaults';

export interface SectionProps {
  params: Configuration;
  isSaving: boolean;
  onSave: (data: Partial<Configuration>) => void;
}

/**
 * Shared section body: a footer-less DynamicForm plus a "Restaurer" (remount to
 * reset) / "Enregistrer" (submit via `form={formId}`) footer. `children`
 * renders above the form (e.g. the logo uploader).
 */
function ConfigSectionForm<T extends FieldValues>({
  formId,
  config,
  schema,
  defaultValues,
  onSave,
  isSaving,
  onReset,
  children,
}: {
  formId: string;
  config: FormConfig;
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSave: (data: T) => void;
  isSaving: boolean;
  onReset?: () => void;
  children?: React.ReactNode;
}) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="space-y-6">
      {children}
      <DynamicForm<T>
        key={resetKey}
        formId={formId}
        hideFormFooter
        config={config}
        schema={schema}
        defaultValues={defaultValues}
        onSubmit={onSave}
        isLoading={isSaving}
      />
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => {
            onReset?.();
            setResetKey((k) => k + 1);
          }}
        >
          Restaurer
        </Button>
        <Button type="submit" form={formId} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}

/**
 * Logo picker — the image box itself is the trigger (click it to change the
 * logo). Update-only for now. TODO(backend): upload the file and store the
 * returned path.
 */
function LogoUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    // Placeholder path until an upload endpoint exists.
    onChange(file.name);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Changer le logo"
        className="group cursor-pointer relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Logo" className="size-full object-contain" />
        ) : (
          <ImageIcon className="size-6 text-muted-foreground" />
        )}

        {/* Hover overlay */}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-5 text-white" />
        </span>

      
      </button>

      <div className="space-y-0.5">
        <Label>Logo de la structure</Label>
        {/* <p className="text-xs text-muted-foreground">
          Cliquez sur l’image pour changer le logo.
        </p> */}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

export function IdentiteSection({ params, isSaving, onSave }: SectionProps) {
  const [logo, setLogo] = useState(params.logo_structure ?? '');
  return (
    <ConfigSectionForm
      formId="identite-form"
      config={getIdentiteConfig()}
      schema={identiteSchema}
      defaultValues={getIdentiteDefaults(params)}
      isSaving={isSaving}
      onReset={() => setLogo(params.logo_structure ?? '')}
      onSave={(data) => onSave({ ...data, logo_structure: logo })}
    >
      <LogoUploader value={logo} onChange={setLogo} />
    </ConfigSectionForm>
  );
}

export function CoordonneesSection({ params, isSaving, onSave }: SectionProps) {
  return (
    <ConfigSectionForm
      formId="coordonnees-form"
      config={getCoordonneesConfig()}
      schema={coordonneesSchema}
      defaultValues={getCoordonneesDefaults(params)}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
}

export function FinanceSection({ params, isSaving, onSave }: SectionProps) {
  return (
    <ConfigSectionForm
      formId="finance-form"
      config={getFinanceConfig()}
      schema={financeSchema}
      defaultValues={getFinanceDefaults(params)}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
}

export function SecuriteSection({ params, isSaving, onSave }: SectionProps) {
  return (
    <ConfigSectionForm
      formId="securite-form"
      config={getSecuriteConfig()}
      schema={securiteSchema}
      defaultValues={getSecuriteDefaults(params)}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
}

export function NotificationsSection({ params, isSaving, onSave }: SectionProps) {
  return (
    <ConfigSectionForm
      formId="notifications-form"
      config={getNotificationsConfig()}
      schema={notificationsSchema}
      defaultValues={getNotificationsDefaults(params)}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
}

export function IntegrationsSection({ params, isSaving, onSave }: SectionProps) {
  return (
    <ConfigSectionForm
      formId="integrations-form"
      config={getIntegrationsConfig()}
      schema={integrationsSchema}
      defaultValues={getIntegrationsDefaults(params)}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
}
