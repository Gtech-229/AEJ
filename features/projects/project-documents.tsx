'use client';

import { useMemo, useState } from 'react';
import { FileText, Paperclip, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { formatDate } from '@/lib/date';
import { useDocuments, useUploadDocument } from '@/features/documents/documents.hooks';
import type { Projet } from './projects.dto';

/** Is the stored `fichier` an absolute URL we can link to directly? */
function isUrl(value: string | null): value is string {
  return !!value && /^https?:\/\//.test(value);
}

/**
 * Documents panel for a micro-projet: an upload form (type + file) + the list of
 * attached pieces. The backend doesn't scope `/documents` by micro_projet_id yet,
 * so we filter client-side.
 */
export function ProjectDocuments({ projet }: { projet: Projet }) {
  const { data: all, isLoading } = useDocuments();
  const upload = useUploadDocument();
  const [typeDoc, setTypeDoc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  // Bumping the key remounts the file input to clear it after a successful upload.
  const [fileKey, setFileKey] = useState(0);

  const documents = useMemo(
    () => (all ?? []).filter((d) => d.micro_projet_id === projet.id),
    [all, projet.id],
  );

  function submit() {
    const type_document = typeDoc.trim();
    if (!type_document || !file) return;
    upload.mutate(
      { micro_projet_id: projet.id, type_document, fichier: file },
      {
        onSuccess: () => {
          setTypeDoc('');
          setFile(null);
          setFileKey((k) => k + 1);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border border-border p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type de document</Label>
            <Input
              value={typeDoc}
              onChange={(e) => setTypeDoc(e.target.value)}
              placeholder="ex: Plan d'affaire, Justificatif, Convention…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Fichier</Label>
            <Input
              key={fileKey}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={submit}
            disabled={!typeDoc.trim() || !file || upload.isPending}
          >
            <Upload className="size-4" />
            {upload.isPending ? 'Envoi…' : 'Joindre'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Chargement…" />
      ) : documents.length === 0 ? (
        <EmptyState
          variant="card"
          icon={FileText}
          title="Aucun document"
          description="Joignez les pièces du dossier (plan d'affaire, justificatifs, convention…)."
        />
      ) : (
        <ul className="space-y-2">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{d.type_document}</p>
                  {isUrl(d.fichier) ? (
                    <a
                      href={d.fichier}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate font-mono text-xs text-primary hover:underline"
                    >
                      Ouvrir le fichier
                    </a>
                  ) : d.fichier ? (
                    <p className="truncate font-mono text-xs text-muted-foreground">{d.fichier}</p>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {d.created_at ? formatDate(d.created_at) : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
