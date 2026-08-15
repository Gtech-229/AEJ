'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAge } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { GenericTable, GenericRowActions, AvatarInitials, usePageParams } from '@/components/generic';
import type { Promoteur } from './promoteurs.dto';
import { DEFAULT_PER_PAGE } from './promoteurs.dto';
import { usePromoteurs } from './promoteurs.hooks';
import { PromoteursFilters, usePromoteurFilters } from './promoteurs.filters';
import { PromoteurDetailSheet } from './promoteur-detail-sheet';

export function PromoteursClient() {
  const { page, perPage } = usePageParams({ perPage: DEFAULT_PER_PAGE });
  const filters = usePromoteurFilters();
  const query = useMemo(
    () => ({ page, perPage, ...filters }),
    [page, perPage, filters],
  );
  const { data, isLoading } = usePromoteurs(query);
  const [selected, setSelected] = useState<Promoteur | null>(null);

  const columns: ColumnDef<Promoteur>[] = useMemo(
    () => [
      {
        accessorKey: 'matriculeaej',
        meta: { label: 'Matricule' },
        header: 'Matricule',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.matriculeaej ?? '—'}
          </span>
        ),
      },
      {
        id: 'nom',
        accessorFn: (p) => `${p.prenom} ${p.nom}`,
        meta: { label: 'Nom complet' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom complet" />,
        cell: ({ row }) => {
          const fullName = `${row.original.prenom} ${row.original.nom}`;
          return (
            <div className="flex items-center gap-3">
              <AvatarInitials name={fullName} />
              <span className="font-medium">{fullName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'telephone',
        meta: { label: 'Téléphone' },
        header: 'Téléphone',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.telephone}</span>,
      },
      {
        accessorKey: 'email',
        meta: { label: 'Email' },
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email ?? '—'}</span>
        ),
      },
      {
        id: 'age',
        accessorFn: (p) => getAge(p.datenaissance) ?? undefined,
        meta: { label: 'Âge' },
        header: 'Âge',
        cell: ({ row }) => {
          const age = getAge(row.original.datenaissance);
          return age != null ? (
            <span>{age} ans</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        id: 'statut',
        meta: { label: 'Statut' },
        header: 'Statut',
        cell: ({ row }) => {
          const actif = (row.original.statut ?? 1) !== 0;
          return (
            <Badge
              variant="outline"
              className={cn(
                'gap-1.5',
                actif ? 'border-success/30 bg-success/10 text-success' : 'text-muted-foreground',
              )}
            >
              <span
                className={cn('size-1.5 rounded-full', actif ? 'bg-success' : 'bg-muted-foreground')}
              />
              {actif ? 'Actif' : 'Inactif'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <GenericRowActions
              item={row.original}
              extraActions={(promoteur) => (
                <DropdownMenuItem onClick={() => setSelected(promoteur)}>
                  <Eye className="mr-2 size-3.5 text-muted-foreground/70" />
                  Voir le détail
                </DropdownMenuItem>
              )}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-[2.5%] py-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="size-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Promoteurs</h1>
            {typeof data?.total === 'number' && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {data.total.toLocaleString('fr-FR')}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Liste des promoteurs du programme
          </p>
        </div>
      </div>

      <PromoteursFilters />

      <GenericTable<Promoteur>
        data={data?.items ?? []}
        columns={columns}
        // Search + filters live in the dedicated filter bar above.
        showSearch={false}
        isLoading={isLoading}
        manualPagination={{ pageCount: data?.lastPage ?? 1, rowCount: data?.total }}
        // Scroll the rows internally so the pagination stays in view without
        // scrolling the whole page (the header row is sticky within this box).
        tableContainerClassName="max-h-[calc(100vh-20rem)] overflow-y-auto"
        emptyIcon={Users}
        emptyTitle="Aucun promoteur"
        emptyDescription="Aucun promoteur ne correspond à ces critères."
      />

      <PromoteurDetailSheet
        promoteur={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
