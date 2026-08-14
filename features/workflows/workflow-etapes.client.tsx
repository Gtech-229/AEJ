'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CornerDownRight,
  GitBranch,
  GitFork,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { GenericDialogs, useDialogState } from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { WorkflowEtape } from './workflow.dto';
import { workflowEtapeSchema, type WorkflowEtapeInput } from './workflow.schema';
import { getWorkflowEtapeFormConfig } from './workflow.form';
import { getWorkflowEtapeDefaults } from './workflow.defaults';
import {
  useCreateWorkflowEtape,
  useDeleteWorkflowEtape,
  useUpdateWorkflowEtape,
  useWorkflowEtapes,
  useWorkflowModels,
  useWorkflowVersions,
} from './workflow.hooks';
import { WorkflowEtapeConfigSheet } from './workflow-etape-config-sheet';
import { WorkflowVersionsSheet } from './workflow-versions-sheet';
import { WorkflowProcessBoard } from './workflow-process-board';

/** The version this étape belongs to (embed object on read, `code` on write). */
function etapeVersionCode(e: WorkflowEtape): string {
  return typeof e.workflow_version === 'string' ? e.workflow_version : (e.workflow_version?.code ?? '');
}

/** Order étapes as a tree (roots by `order`, then children recursively). */
function flattenTree(etapes: WorkflowEtape[]): { etape: WorkflowEtape; depth: number }[] {
  const byParent = new Map<string, WorkflowEtape[]>();
  for (const e of etapes) {
    const key = e.parent_etape_code || '';
    (byParent.get(key) ?? byParent.set(key, []).get(key)!).push(e);
  }
  for (const list of byParent.values()) list.sort((a, b) => a.order - b.order);

  const out: { etape: WorkflowEtape; depth: number }[] = [];
  const seen = new Set<number>();
  const codes = new Set(etapes.map((e) => e.code));
  function walk(parentCode: string, depth: number) {
    for (const e of byParent.get(parentCode) ?? []) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      out.push({ etape: e, depth });
      walk(e.code, depth + 1);
    }
  }
  walk('', 0);
  for (const e of etapes) {
    if (!seen.has(e.id) && (!e.parent_etape_code || !codes.has(e.parent_etape_code))) {
      seen.add(e.id);
      out.push({ etape: e, depth: 0 });
    }
  }
  return out;
}

export function WorkflowEtapesClient({ modelCode }: { modelCode: string }) {
  const { data: models } = useWorkflowModels();
  const { data: allVersions } = useWorkflowVersions();
  const { data: allEtapes, isLoading } = useWorkflowEtapes();
  const create = useCreateWorkflowEtape();
  const update = useUpdateWorkflowEtape();
  const del = useDeleteWorkflowEtape();
  const dialog = useDialogState<WorkflowEtape>();

  const model = (models ?? []).find((m) => m.code === modelCode);
  const versions = useMemo(
    () => (allVersions ?? []).filter((v) => v.workflow_code === modelCode),
    [allVersions, modelCode],
  );

  // Selected version — defaults to the model's default version (or the first),
  // and re-syncs if the current selection is no longer valid.
  const [selectedVersionCode, setSelectedVersionCode] = useState('');
  useEffect(() => {
    if (versions.length === 0) return;
    if (!versions.some((v) => v.code === selectedVersionCode)) {
      const def = versions.find((v) => v.is_default) ?? versions[0];
      setSelectedVersionCode(def.code);
    }
  }, [versions, selectedVersionCode]);

  const etapes = useMemo(
    () => (allEtapes ?? []).filter((e) => etapeVersionCode(e) === selectedVersionCode),
    [allEtapes, selectedVersionCode],
  );
  const ordered = useMemo(() => flattenTree(etapes), [etapes]);
  const hasVersion = !!selectedVersionCode;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/dashboard/parametrage/workflows">
          <ArrowLeft className="size-4" /> Retour aux workflows
        </Link>
      </Button>

      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{model?.name ?? modelCode}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Étapes de traitement du workflow «&nbsp;{modelCode}&nbsp;».
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedVersionCode}
            onValueChange={setSelectedVersionCode}
            disabled={versions.length <= 1}
          >
            <SelectTrigger className="h-9 w-auto gap-2 rounded-full">
              <GitBranch className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.code} value={v.code}>
                  {v.name} · {v.version}
                  {v.is_default ? ' (défaut)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {model && <WorkflowVersionsSheet model={model} />}
        </div>
      </div>

      {versions.length === 0 ? (
        <EmptyState
          variant="card"
          icon={GitBranch}
          title="Aucune version"
          description="Créez une version de ce workflow pour définir ses étapes."
        />
      ) : (
        <Tabs defaultValue="config">
          <TabsList variant="solid" className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="config" className="cursor-pointer gap-1.5">
              <Layers /> Configuration
            </TabsTrigger>
            <TabsTrigger value="process" className="cursor-pointer gap-1.5">
              <GitFork /> Processus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={dialog.openCreate}
                disabled={!hasVersion}
              >
                <Plus className="size-4" />
                Nouvelle étape
              </Button>
            </div>
            {isLoading ? (
              <LoadingState label="Chargement des étapes…" />
            ) : ordered.length === 0 ? (
              <EmptyState
                variant="card"
                icon={Layers}
                title="Aucune étape"
                description="Ajoutez la première étape de cette version."
              />
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-16">Ordre</TableHead>
                <TableHead>Étape</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordered.map(({ etape, depth }) => (
                <TableRow key={etape.id}>
                  <TableCell className="text-muted-foreground">{etape.order}</TableCell>
                  <TableCell>
                    <span
                      className="flex items-center gap-1.5 font-medium"
                      style={{ paddingLeft: depth * 18 }}
                    >
                      {depth > 0 && <CornerDownRight className="size-3.5 text-muted-foreground" />}
                      {etape.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">{etape.code}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{etape.impact ?? '—'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <WorkflowEtapeConfigSheet etape={etape} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer"
                        aria-label="Modifier"
                        onClick={() => dialog.openEdit(etape)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer text-destructive"
                        aria-label="Supprimer"
                        onClick={() => dialog.openDelete(etape)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="process" className="mt-4">
            <WorkflowProcessBoard ordered={ordered} />
          </TabsContent>
        </Tabs>
      )}

      <GenericDialogs<WorkflowEtape>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter une étape',
          edit: "Modifier l'étape",
          delete: "Supprimer l'étape",
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<WorkflowEtapeInput>
            config={getWorkflowEtapeFormConfig(etapes, item?.code)}
            schema={workflowEtapeSchema}
            defaultValues={getWorkflowEtapeDefaults(item ?? undefined, etapes)}
            isLoading={create.isPending || update.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              const payload = {
                ...data,
                workflow_version: selectedVersionCode,
                parent_etape_code: data.parent_etape_code || undefined,
              };
              if (item) update.mutate({ ...payload, id: item.id }, { onSuccess: close });
              else create.mutate(payload, { onSuccess: close });
            }}
          />
        )}
        isDeleting={del.isPending}
        onDelete={(item) => del.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer l'étape « ${item.name} » ? Sa configuration (SLA, livrables, rôles, décisions) sera affectée.`
        }
      />
    </div>
  );
}
