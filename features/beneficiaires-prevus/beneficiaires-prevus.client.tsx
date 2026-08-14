'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { useGuichets } from '@/features/guichets/guichets.hooks';
import { useLocalites } from '@/features/localites/localites.hooks';
import type { BeneficiairePrevu } from './beneficiaires-prevus.dto';
import type { BeneficiairePrevuInput } from './beneficiaires-prevus.schema';
import { beneficiairePrevuSchema } from './beneficiaires-prevus.schema';
import { getBeneficiairePrevuFormConfig } from './beneficiaires-prevus.form';
import { getBeneficiairePrevuDefaults } from './beneficiaires-prevus.defaults';
import {
  useBeneficiairesPrevus,
  useCreateBeneficiairePrevu,
  useDeleteBeneficiairePrevu,
  useUpdateBeneficiairePrevu,
} from './beneficiaires-prevus.hooks';

/**
 * Chrome-less (no page header/padding of its own) so it can render inside the
 * "Projets & dispositifs" tab shell. The tab page owns the surrounding layout.
 */
export function BeneficiairesPrevusClient() {
  const { data: beneficiaires, isLoading } = useBeneficiairesPrevus();
  const { data: guichets } = useGuichets();
  const { data: localites } = useLocalites();
  const createBeneficiaire = useCreateBeneficiairePrevu();
  const updateBeneficiaire = useUpdateBeneficiairePrevu();
  const deleteBeneficiaire = useDeleteBeneficiairePrevu();
  const dialog = useDialogState<BeneficiairePrevu>();

  const guichetLabel = useMemo(() => {
    const map = new Map<number, string>();
    (guichets ?? []).forEach((g) => map.set(g.id, g.libelle));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [guichets]);

  const localiteLabel = useMemo(() => {
    const map = new Map<number, string>();
    (localites ?? []).forEach((l) => map.set(l.id, l.nom));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [localites]);

  const columns: ColumnDef<BeneficiairePrevu>[] = [
    {
      accessorKey: 'categorie',
      meta: { label: 'Catégorie' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Catégorie" />,
      cell: ({ row }) => <span className="font-medium">{row.original.categorie}</span>,
    },
    {
      accessorKey: 'guichet_id',
      meta: { label: 'Guichet' },
      header: 'Guichet',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {guichetLabel(row.original.guichet_id)}
        </Badge>
      ),
    },
    {
      accessorKey: 'localite_id',
      meta: { label: 'Zone' },
      header: 'Zone',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {localiteLabel(row.original.localite_id)}
        </span>
      ),
    },
    {
      accessorKey: 'nombre_prevu',
      meta: { label: 'Nombre prévu' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre prévu" />,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">{row.original.nombre_prevu}</span>
      ),
    },
    buildEditDeleteActionsColumn<BeneficiairePrevu>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <>
      <GenericTable<BeneficiairePrevu>
        data={beneficiaires ?? []}
        columns={columns}
        searchKey="categorie"
        searchPlaceholder="Rechercher une catégorie…"
        isLoading={isLoading}
        emptyIcon={Users}
        emptyTitle="Aucun bénéficiaire prévu"
        emptyDescription="Définissez les cibles de bénéficiaires prévus par guichet et par zone."
        toolbarEndSlot={
          <Button size="sm" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        }
      />

      <GenericDialogs<BeneficiairePrevu>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un bénéficiaire prévu',
          edit: 'Modifier le bénéficiaire prévu',
          delete: 'Supprimer le bénéficiaire prévu',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<BeneficiairePrevuInput>
            config={getBeneficiairePrevuFormConfig(guichets ?? [], localites ?? [])}
            schema={beneficiairePrevuSchema}
            defaultValues={getBeneficiairePrevuDefaults(item ?? undefined)}
            isLoading={createBeneficiaire.isPending || updateBeneficiaire.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateBeneficiaire.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createBeneficiaire.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteBeneficiaire.isPending}
        onDelete={(item) =>
          deleteBeneficiaire.mutate(item.id, { onSuccess: () => dialog.close() })
        }
        deleteDescription={(item) =>
          `Supprimer la cible "${item.categorie}" ? Cette action est irréversible.`
        }
      />
    </>
  );
}
