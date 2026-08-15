'use client';

import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  Building2,
  CheckCircle2,
  FileText,
  GitBranch,
  HandCoins,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Receipt,
  Trash2,
  Wallet,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/forms';
import { GenericDialogs } from '@/components/generic/generic-dialogs';
import { useDialogState } from '@/components/generic/use-dialog-state';
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
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import type { Projet } from './projects.dto';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import { ProjectObservations } from './project-observations';
import { ProjectDocuments } from './project-documents';
import { ProjectOrganisation } from './project-organisation';
import { ProjectSuiviTerrain } from './project-suivi-terrain';
import { ProjectWorkflowProgress } from './project-workflow-progress';
import {
  useBudgets,
  useCreateBudget,
  useDecaissements,
  useDeleteBudget,
  useRemboursements,
  useTransactions,
  useUpdateBudget,
} from '@/features/financements/financements.hooks';
import type { Budget } from '@/features/financements/financements.dto';
import { budgetFormConfig } from '@/features/financements/budget.form';
import { budgetSchema, type BudgetInput } from '@/features/financements/budget.schema';
import {
  budgetToPayload,
  getBudgetDefaults,
  toBudgetPayload,
} from '@/features/financements/budget.defaults';
import {
  BUDGET_STATUT_LABELS,
  CONVENTION_LABELS,
  DECAISSEMENT_STATUT_LABELS,
  MODE_PAIEMENT_LABELS,
  OUI_NON_LABELS,
  REMBOURSEMENT_STATUT_LABELS,
  TRANSACTION_TYPE_LABELS,
  financementTone,
  type FinancementTone,
} from '@/features/financements/financements.constants';
import { toNumber } from '@/lib/number';
import { computeProfitability, type Operation } from './operations';

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'success' | 'danger';
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-1 text-lg font-semibold text-foreground',
          tone === 'success' && 'text-success',
          tone === 'danger' && 'text-destructive',
        )}
      >
        {value}
      </p>
    </div>
  );
}

function OperationsTab({ projet }: { projet: Projet }) {
  const formatMontant = useFormatMontant();
  const { data: allTx, isLoading } = useTransactions();

  // The backend doesn't filter `/transactions` by micro_projet_id yet, so we
  // fetch the list and scope it client-side (stopgap — see backend-asks).
  const transactions = useMemo(
    () => (allTx ?? []).filter((t) => t.micro_projet_id === projet.id),
    [allTx, projet.id],
  );

  const operations: Operation[] = transactions.map((t) => ({
    id: t.id,
    projet_id: t.micro_projet_id,
    type: t.type,
    libelle: t.libelle,
    montant: t.montant,
    date: t.date,
  }));
  const { recettes, depenses, resultat, marge } = computeProfitability(operations);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Recettes" value={formatMontant(recettes)} tone="success" />
        <Stat label="Dépenses" value={formatMontant(depenses)} tone="danger" />
        <Stat
          label={`Résultat${marge != null ? ` · marge ${Math.round(marge * 100)}%` : ''}`}
          value={formatMontant(resultat)}
          tone={resultat >= 0 ? 'success' : 'danger'}
        />
      </div>

      {isLoading ? (
        <LoadingState label="Chargement…" />
      ) : transactions.length === 0 ? (
        <EmptyState
          variant="card"
          icon={Receipt}
          title="Aucune opération"
          description="Enregistrez les dépenses et recettes du projet pour calculer sa rentabilité."
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Libellé</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.libelle}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.categorie?.libelle ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-normal',
                        t.type === 'RECETTE'
                          ? 'border-success/30 bg-success/10 text-success'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                      )}
                    >
                      {TRANSACTION_TYPE_LABELS[t.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatMontant(t.montant)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {MODE_PAIEMENT_LABELS[t.mode_paiement]}
                  </TableCell>
                  <TableCell>{formatDate(t.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

const FIN_TONE: Record<FinancementTone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
  neutral: 'text-muted-foreground',
};

function FinBadge({ value, label }: { value: string; label: string }) {
  return (
    <Badge variant="outline" className={cn('font-normal', FIN_TONE[financementTone(value)])}>
      {label}
    </Badge>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm text-foreground">{value}</div>
    </div>
  );
}

/**
 * Financement tab: the projet's budget (§9.1 — AEJ action, managed here) +
 * décaissements (read-only, chained via plan → budget; the writes are the
 * partner's, in the organisme espace). A dossier has at most one budget.
 */
function FinancementTab({ projet }: { projet: Projet }) {
  const formatMontant = useFormatMontant();
  const budgets = useBudgets();
  const decaissements = useDecaissements();
  const dialog = useDialogState<Budget>();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const projetBudgets = (budgets.data ?? []).filter((b) => b.micro_projet_id === projet.id);
  const budgetIds = new Set(projetBudgets.map((b) => b.id));
  const decs = (decaissements.data ?? []).filter(
    (d) => d.plan?.budget_id != null && budgetIds.has(d.plan.budget_id),
  );

  const totalAccorde = projetBudgets.reduce((s, b) => s + (toNumber(b.montant_accorde) ?? 0), 0);
  const totalDecaisse = decs
    .filter((d) => d.statut === 'VALIDE')
    .reduce((s, d) => s + (toNumber(d.montant_decaisse) ?? 0), 0);

  const budgetDialogs = (
    <GenericDialogs<Budget>
      state={dialog}
      dialogSize="lg"
      titles={{ create: 'Créer le budget', edit: 'Modifier le budget', delete: 'Supprimer le budget' }}
      renderForm={({ item, close }) => (
        <DynamicForm<BudgetInput>
          config={budgetFormConfig}
          schema={budgetSchema}
          defaultValues={getBudgetDefaults(item ?? undefined)}
          isLoading={createBudget.isPending || updateBudget.isPending}
          onCancel={close}
          submitText={item ? 'Modifier' : 'Créer'}
          onSubmit={(data) => {
            const payload = toBudgetPayload(data, projet.id);
            if (item) {
              updateBudget.mutate({ id: item.id, ...payload }, { onSuccess: close });
            } else {
              createBudget.mutate(payload, { onSuccess: close });
            }
          }}
        />
      )}
      isDeleting={deleteBudget.isPending}
      onDelete={(item) => deleteBudget.mutate(item.id, { onSuccess: () => dialog.close() })}
      deleteDescription={(item) =>
        `Supprimer le budget "${item.intitule}" ? Cette action est irréversible.`
      }
    />
  );

  if (budgets.isLoading) return <LoadingState label="Chargement…" />;
  if (projetBudgets.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          variant="card"
          icon={Wallet}
          title="Aucun financement"
          description="Aucun budget n'est enregistré pour ce projet."
        >
          <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Créer le budget
          </Button>
        </EmptyState>
        {budgetDialogs}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Montant accordé" value={formatMontant(totalAccorde)} />
        <Stat label="Décaissé" value={formatMontant(totalDecaisse)} tone="success" />
        <Stat label="Reste à décaisser" value={formatMontant(totalAccorde - totalDecaisse)} />
      </div>

      {projetBudgets.map((b) => (
        <div key={b.id} className="space-y-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-foreground">{b.intitule}</p>
              <p className="text-xs text-muted-foreground">{b.source ?? 'Source non précisée'}</p>
            </div>
            <div className="flex items-center gap-2">
              <FinBadge value={b.statut} label={BUDGET_STATUT_LABELS[b.statut]} />
              <div className="flex items-center gap-1">
                {b.statut !== 'APPROUVE' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 cursor-pointer gap-1 text-success"
                    onClick={() =>
                      updateBudget.mutate({ ...budgetToPayload(b), statut: 'APPROUVE', id: b.id })
                    }
                    disabled={updateBudget.isPending}
                  >
                    <CheckCircle2 className="size-4" />
                    Valider
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 cursor-pointer"
                  onClick={() => dialog.openEdit(b)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 cursor-pointer text-destructive hover:text-destructive"
                  onClick={() => dialog.openDelete(b)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Meta
              label="Montant accordé"
              value={<span className="font-semibold">{formatMontant(b.montant_accorde)}</span>}
            />
            <Meta
              label="Convention"
              value={
                <FinBadge value={b.signature_convention} label={CONVENTION_LABELS[b.signature_convention]} />
              }
            />
            <Meta
              label="Acte de crédit"
              value={
                <FinBadge value={b.reception_acte_credit} label={OUI_NON_LABELS[b.reception_acte_credit]} />
              }
            />
            <Meta
              label="Déblocage"
              value={
                <FinBadge
                  value={b.deblocage ? 'OUI' : 'NON'}
                  label={b.deblocage ? 'Débloqué' : 'Non débloqué'}
                />
              }
            />
          </div>
        </div>
      ))}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Décaissements</h3>
        {decs.length === 0 ? (
          <EmptyState
            variant="card"
            icon={Banknote}
            title="Aucun décaissement"
            description="Aucun décaissement n'est enregistré pour ce financement."
          />
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Plan</TableHead>
                  <TableHead>Agence</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      {d.plan?.intitule ?? d.plan?.code ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.agence?.nom ?? '—'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatMontant(d.montant_decaisse)}
                    </TableCell>
                    <TableCell>{formatDate(d.date_decaissement)}</TableCell>
                    <TableCell>
                      <FinBadge value={d.statut} label={DECAISSEMENT_STATUT_LABELS[d.statut]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {budgetDialogs}
    </div>
  );
}

/** Remboursements tab: the projet's repayment schedule (filtered by its budgets). */
function RemboursementTab({ projet }: { projet: Projet }) {
  const formatMontant = useFormatMontant();
  const budgets = useBudgets();
  const remboursements = useRemboursements();

  const budgetIds = new Set(
    (budgets.data ?? []).filter((b) => b.micro_projet_id === projet.id).map((b) => b.id),
  );
  const rembs = (remboursements.data ?? []).filter((r) => budgetIds.has(r.budget_id));

  const num = (v: string | number | null | undefined) => toNumber(v) ?? 0;
  const totalEchu = rembs.reduce((s, r) => s + num(r.montant_echu), 0);
  const totalPaye = rembs.reduce((s, r) => s + num(r.montant_paye), 0);
  const totalImpaye = rembs.reduce((s, r) => s + num(r.montant_impaye), 0);
  const taux = totalEchu > 0 ? Math.round((totalPaye / totalEchu) * 100) : 0;

  if (budgets.isLoading || remboursements.isLoading) return <LoadingState label="Chargement…" />;
  if (rembs.length === 0) {
    return (
      <EmptyState
        variant="card"
        icon={HandCoins}
        title="Aucun remboursement"
        description="Aucune échéance de remboursement n'est enregistrée pour ce projet."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Échu" value={formatMontant(totalEchu)} />
        <Stat label="Payé" value={formatMontant(totalPaye)} tone="success" />
        <Stat
          label="Impayé"
          value={formatMontant(totalImpaye)}
          tone={totalImpaye > 0 ? 'danger' : undefined}
        />
        <Stat label="Taux de remboursement" value={`${taux} %`} />
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>Promoteur</TableHead>
              <TableHead className="text-right">Échu</TableHead>
              <TableHead className="text-right">Payé</TableHead>
              <TableHead className="text-right">Impayé</TableHead>
              <TableHead className="text-right">Pénalités</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rembs.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.promoteur ? `${r.promoteur.prenom} ${r.promoteur.nom}` : `#${r.promoteur_id}`}
                </TableCell>
                <TableCell className="text-right">{formatMontant(r.montant_echu)}</TableCell>
                <TableCell className="text-right text-success">
                  {formatMontant(r.montant_paye)}
                </TableCell>
                <TableCell className="text-right">
                  {num(r.montant_impaye) > 0 ? (
                    <span className="text-destructive">{formatMontant(r.montant_impaye)}</span>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {num(r.penalites) > 0 ? formatMontant(r.penalites) : '—'}
                </TableCell>
                <TableCell>{formatDate(r.date_paiement)}</TableCell>
                <TableCell>
                  <FinBadge value={r.statut} label={REMBOURSEMENT_STATUT_LABELS[r.statut]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface SuiviTab {
  value: string;
  label: string;
  icon: LucideIcon;
  /** The panel to render for this tab. */
  content: React.ReactNode;
}

/**
 * 360° follow-up of a micro-projet, organised as tabs for clarity. The tabs are
 * a single config list (label / icon / value / content) so adding one is a one-
 * liner. Progression, Financement, Remboursements and Organisation are
 * scaffolded until their endpoints exist; Opérations shows the profitability.
 */
export function ProjectSuiviTabs({ projet }: { projet: Projet }) {
  const tabs: SuiviTab[] = [
    {
      value: 'progression',
      label: 'Progression',
      icon: GitBranch,
      content: <ProjectWorkflowProgress projet={projet} />,
    },
    {
      value: 'financement',
      label: 'Financement',
      icon: Wallet,
      content: <FinancementTab projet={projet} />,
    },
    {
      value: 'remboursements',
      label: 'Remboursements',
      icon: HandCoins,
      content: <RemboursementTab projet={projet} />,
    },
    {
      value: 'organisation',
      label: 'Organisation',
      icon: Building2,
      content: <ProjectOrganisation projet={projet} />,
    },
    {
      value: 'operations',
      label: 'Opérations',
      icon: Receipt,
      content: <OperationsTab projet={projet} />,
    },
    {
      value: 'suivi-terrain',
      label: 'Suivi terrain',
      icon: MapPin,
      content: <ProjectSuiviTerrain projet={projet} />,
    },
    // Temporarily hidden — re-enable when ready:
    // {
    //   value: 'documents',
    //   label: 'Documents',
    //   icon: FileText,
    //   content: <ProjectDocuments projet={projet} />,
    // },
    // {
    //   value: 'observations',
    //   label: 'Observations',
    //   icon: MessageSquare,
    //   content: <ProjectObservations projet={projet} />,
    // },
  ];

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList variant="solid" className="flex h-auto flex-wrap justify-start">
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="gap-1.5 cursor-pointer">
            <Icon className="size-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value} className="mt-4">
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
