'use client';

import { useRef, useState } from 'react';
import type { FieldValues, DefaultValues } from 'react-hook-form';
import type { ZodType } from 'zod';
import { Camera, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DynamicForm, type FormConfig } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUploadLogo } from './configurations.hooks';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    <div className="flex h-full flex-col">
      {/* Scrollable body */}
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
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
      </div>
      {/* Pinned footer */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-card p-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => {
            onReset?.();
            setResetKey((k) => k + 1);
          }}
          className='cursor-pointer hover:bg-background hover:text-foreground/50'
        >
          Restaurer
        </Button>
        <Button type="submit" form={formId} disabled={isSaving} className='cursor-pointer'>
          {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_MB = 2;

/** Only render an <img> for something the browser can actually load. */
function isDisplayableSrc(src: string): boolean {
  return /^(https?:\/\/|blob:|data:|\/)/.test(src);
}

/**
 * Logo picker — the image box is the trigger. Selecting a file uploads it
 * immediately via `useUploadLogo` (its own endpoint), independent of the
 * Identité form's save button. Reused for both the structure and system logos.
 */
function LogoUploader({
  value,
  field,
  label,
  fallbackText,
}: {
  value: string;
  field: 'logo_structure' | 'logo_systeme';
  label: string;
  fallbackText: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Local object-URL preview wins once a file is picked (the stored value may
  // be a bare filename we can't render).
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const upload = useUploadLogo(field);

  const src = localPreview ?? (isDisplayableSrc(value) ? value : null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // let the same file be re-picked after an error
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast.error('Format de fichier non pris en compte');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error('Seuls les fichiers de 2 Mo au plus sont pris en compte');
      return;
    }

    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    upload.mutate(file);
  }

  return (
    <div className="flex items-center gap-4">
     

         <div className="relative">
        <Avatar className="size-16 rounded-full border border-border">
          <AvatarImage
            src={src ?? ''}
            alt={label}
          />
          <AvatarFallback className="rounded-xl bg-muted text-xs font-medium text-muted-foreground">
            {fallbackText?.slice(0, 3).toUpperCase() || 'AEJ'}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
          className="
            absolute -bottom-1 -right-1
            flex size-6 items-center justify-center
            rounded-full border border-border bg-background shadow-sm
            transition hover:bg-muted disabled:opacity-50
          "
        >
          {upload.isPending
            ? <Loader2 className="size-3 animate-spin text-muted-foreground" />
            : <Camera className="size-3 text-muted-foreground" />
          }
        </button>
      </div>

      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP ou SVG · max {MAX_MB} Mo</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

export function IdentiteSection({ params, isSaving, onSave }: SectionProps) {
  // The logo has its own upload endpoint, so it's no longer merged into this
  // form's payload — `handleSave` still spreads the current config, which keeps
  // the server's `logo_structure` intact.
  return (
    <ConfigSectionForm
      formId="identite-form"
      config={getIdentiteConfig()}
      schema={identiteSchema}
      defaultValues={getIdentiteDefaults(params)}
      isSaving={isSaving}
      onSave={onSave}
    >
      <div className="flex space-x-4">
        <LogoUploader
          value={params.logo_structure ?`https://apis.aej-ci.net/public/${params.logo_structure}` : ''}
          field="logo_structure"
          label="Logo de la structure"
          fallbackText={getIdentiteDefaults(params).sigle_structure}
        />
        <LogoUploader
          value={params.logo_systeme ?? ''}
          field="logo_systeme"
          label="Logo du système"
          fallbackText="SYS"
        />
      </div>
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
