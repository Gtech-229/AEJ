'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  CalendarClock,
  FileText,
  HandCoins,
  Landmark,
  ScrollText,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { toNumber } from '@/lib/number';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import type {
  Budget,
  CompteFinancement,
  Decaissement,
  DecaissementDeclaration,
  PlanDecaissement,
  Remboursement,
  RemboursementDeclaration,
} from './financements.dto';
import type { Promoteur } from '@/features/promoteurs/promoteurs.dto';
import {
  AVIS_PARTENAIRE_LABELS,
  BUDGET_STATUT_LABELS,
  CONVENTION_LABELS,
  DECAISSEMENT_STATUT_LABELS,
  DECLARATION_STATUT_LABELS,
  ETAT_OUVERTURE_LABELS,
  OUI_NON_LABELS,
  REMBOURSEMENT_STATUT_LABELS,
  financementTone,
  type FinancementTone,
} from './financements.constants';
import {
  useBudgets,
  useComptes,
  useDecaissementDeclarations,
  useDecaissements,
  usePlansDecaissement,
  useRemboursementDeclarations,
  useRemboursements,
} from './financements.hooks';

// ── Presentational helpers ────────────────────────────────────────────────────
const TONE_CLASS: Record<FinancementTone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
  neutral: 'text-muted-foreground',
};

function StatusBadge({ value, label }: { value: string; label: string }) {
  return (
    <Badge variant="outline" className={cn('font-normal', TONE_CLASS[financementTone(value)])}>
      {label}
    </Badge>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: 'danger' }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-lg font-semibold text-foreground', tone === 'danger' && 'text-destructive')}>
        {value}
      </p>
    </div>
  );
}

interface Col<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: 'right';
}

function MiniTable<T>({ columns, rows }: { columns: Col<T>[]; rows: T[] }) {
 
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {columns.map((c, i) => (
              <TableHead key={i} className={c.align === 'right' ? 'text-right' : undefined}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow key={ri}>
              {columns.map((c, ci) => (
                <TableCell key={ci} className={c.align === 'right' ? 'text-right' : undefined}>
                  {c.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Uniform tab body: loading → data table → empty state. Every financing tab
 * renders through this so they behave identically.
 * TODO: a per-tab filter section (search + status filters) goes here next.
 */
function TabTable<T>({
  isLoading,
  rows,
  columns,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: {
  isLoading: boolean;
  rows: T[];
  columns: Col<T>[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (isLoading) return <LoadingState label="Chargement…" />;
  if (rows.length === 0) {
    return (
      <EmptyState variant="card" icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
    );
  }
 
  return <MiniTable columns={columns} rows={rows} />;
}

function ProjetCell({ code, intitule }: { code?: string; intitule?: string }) {
  return (
    <div className="min-w-40">
      {intitule && <div className="font-medium text-foreground">{intitule}</div>}
      {code ? <div className="font-mono text-xs text-muted-foreground">{code}</div> : null}
    </div>
  );
}

// ── Column definitions ───────────────────────────────────────────────────────
/** Injected so column cells can format money with the configured currency. */
type MontantFormatter = (value: string | number | null | undefined) => string;

const budgetColumns = (formatMontant: MontantFormatter): Col<Budget>[] => [
  {
    header: 'Projet',
    cell: (b) => <ProjetCell code={b.micro_projet?.code} intitule={b.micro_projet?.intitule} />,
  },
  { header: 'Intitulé', cell: (b) => b.intitule },
  { header: 'Source', cell: (b) => <span className="text-muted-foreground">{b.source ?? '—'}</span> },
  {
    header: 'Montant accordé',
    align: 'right',
    cell: (b) => <span className="font-medium">{formatMontant(b.montant_accorde)}</span>,
  },
  { header: 'Statut', cell: (b) => <StatusBadge value={b.statut} label={BUDGET_STATUT_LABELS[b.statut]} /> },
  {
    header: 'Convention',
    cell: (b) => (
      <StatusBadge value={b.signature_convention} label={CONVENTION_LABELS[b.signature_convention]} />
    ),
  },
  {
    header: 'Acte de crédit',
    cell: (b) => (
      <StatusBadge value={b.reception_acte_credit} label={OUI_NON_LABELS[b.reception_acte_credit]} />
    ),
  },
  {
    header: 'Déblocage',
    cell: (b) => (
      <StatusBadge value={b.deblocage ? 'OUI' : 'NON'} label={b.deblocage ? 'Débloqué' : 'Non débloqué'} />
    ),
  },
];

const decaissementColumns = (formatMontant: MontantFormatter): Col<Decaissement>[] => [
  { header: 'Plan', cell: (d) => <ProjetCell code={d.plan?.code} intitule={d.plan?.intitule} /> },
  {
    header: 'Agence',
    cell: (d) => <span className="text-muted-foreground">{d.agence?.nom ?? '—'}</span>,
  },
  {
    header: 'Montant décaissé',
    align: 'right',
    cell: (d) => <span className="font-medium">{formatMontant(d.montant_decaisse)}</span>,
  },
  { header: 'Date', cell: (d) => formatDate(d.date_decaissement) },
  {
    header: 'Réf. banque',
    cell: (d) => <span className="font-mono text-xs text-muted-foreground">{d.reference_banque ?? '—'}</span>,
  },
  { header: 'Statut', cell: (d) => <StatusBadge value={d.statut} label={DECAISSEMENT_STATUT_LABELS[d.statut]} /> },
];

const remboursementColumns = (formatMontant: MontantFormatter): Col<Remboursement>[] => [
  {
    header: 'Promoteur',
    cell: (r) =>
      r.promoteur ? (
        <span className="font-medium">
          {r.promoteur.prenom} {r.promoteur.nom}
        </span>
      ) : (
        <span className="text-muted-foreground">#{r.promoteur_id}</span>
      ),
  },
  { header: 'Échu', align: 'right', cell: (r) => formatMontant(r.montant_echu) },
  { header: 'Payé', align: 'right', cell: (r) => <span className="text-success">{formatMontant(r.montant_paye)}</span> },
  {
    header: 'Impayé',
    align: 'right',
    cell: (r) =>
      (toNumber(r.montant_impaye) ?? 0) > 0 ? (
        <span className="text-destructive">{formatMontant(r.montant_impaye)}</span>
      ) : (
        '—'
      ),
  },
  {
    header: 'Pénalités',
    align: 'right',
    cell: (r) => ((toNumber(r.penalites) ?? 0) > 0 ? formatMontant(r.penalites) : '—'),
  },
  { header: 'Date', cell: (r) => formatDate(r.date_paiement) },
  { header: 'Statut', cell: (r) => <StatusBadge value={r.statut} label={REMBOURSEMENT_STATUT_LABELS[r.statut]} /> },
];

const compteColumns: Col<CompteFinancement>[] = [
  {
    header: 'Projet',
    cell: (c) => <ProjetCell code={c.micro_projet?.code} intitule={c.micro_projet?.intitule} />,
  },
  { header: 'Organisme', cell: (c) => c.organisme?.nom ?? `#${c.organisme_id}` },
  {
    header: 'Ouverture',
    cell: (c) => <StatusBadge value={c.etat_ouverture} label={ETAT_OUVERTURE_LABELS[c.etat_ouverture]} />,
  },
  { header: 'Localité', cell: (c) => <span className="text-muted-foreground">{c.localite_ouverture}</span> },
  { header: 'Date', cell: (c) => formatDate(c.date_ouverture) },
  {
    header: 'Avis partenaire',
    cell: (c) => <StatusBadge value={c.avis_partenaire} label={AVIS_PARTENAIRE_LABELS[c.avis_partenaire]} />,
  },
];

const promoteurName = (p?: Promoteur) =>
  p ? (
    <span className="font-medium">
      {p.prenom} {p.nom}
    </span>
  ) : (
    <span className="text-muted-foreground">—</span>
  );

const planColumns = (formatMontant: MontantFormatter): Col<PlanDecaissement>[] => [
  { header: 'Plan', cell: (p) => <ProjetCell code={p.code} intitule={p.intitule} /> },
  {
    header: 'Budget',
    cell: (p) => <span className="text-muted-foreground">{p.budget?.intitule ?? '—'}</span>,
  },
  {
    header: 'Montant planifié',
    align: 'right',
    cell: (p) => <span className="font-medium">{formatMontant(p.montant_planifie)}</span>,
  },
  { header: 'Date prévue', cell: (p) => formatDate(p.date_prevue) },
];

const decaissementDeclColumns = (
  formatMontant: MontantFormatter,
): Col<DecaissementDeclaration>[] => [
  { header: 'Plan', cell: (d) => <ProjetCell code={d.plan?.code} intitule={d.plan?.intitule} /> },
  { header: 'Promoteur', cell: (d) => promoteurName(d.promoteur) },
  {
    header: 'Montant déclaré',
    align: 'right',
    cell: (d) => <span className="font-medium">{formatMontant(d.montant_declare)}</span>,
  },
  { header: 'Date', cell: (d) => formatDate(d.date_declaree) },
  {
    header: 'Réf. banque',
    cell: (d) => <span className="font-mono text-xs text-muted-foreground">{d.reference_banque ?? '—'}</span>,
  },
  { header: 'Statut', cell: (d) => <StatusBadge value={d.statut} label={DECLARATION_STATUT_LABELS[d.statut]} /> },
];

const remboursementDeclColumns = (
  formatMontant: MontantFormatter,
): Col<RemboursementDeclaration>[] => [
  { header: 'Promoteur', cell: (r) => promoteurName(r.promoteur) },
  {
    header: 'Budget',
    cell: (r) => <span className="text-muted-foreground">{r.budget?.intitule ?? '—'}</span>,
  },
  {
    header: 'Montant déclaré',
    align: 'right',
    cell: (r) => <span className="font-medium">{formatMontant(r.montant_declare)}</span>,
  },
  { header: 'Date', cell: (r) => formatDate(r.date_declaree) },
  {
    header: 'Réf. banque',
    cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.reference_banque ?? '—'}</span>,
  },
  { header: 'Statut', cell: (r) => <StatusBadge value={r.statut} label={DECLARATION_STATUT_LABELS[r.statut]} /> },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export function FinancementsClient() {
  const budgets = useBudgets();
  const comptes = useComptes();
  const decaissements = useDecaissements();
  const remboursements = useRemboursements();
  const plans = usePlansDecaissement();
  const decaissementDecls = useDecaissementDeclarations();
  const remboursementDecls = useRemboursementDeclarations();
  const formatMontant = useFormatMontant();

  const budgetRows = budgets.data ?? [];
  const compteRows = comptes.data ?? [];
  const decaissementRows = decaissements.data ?? [];
  const remboursementRows = remboursements.data ?? [];

  const sum = <T,>(rows: T[], pick: (row: T) => string | number | null | undefined) =>
    rows.reduce((s, row) => s + (toNumber(pick(row)) ?? 0), 0);

  const totalAccorde = sum(
    budgetRows.filter((b) => b.statut === 'APPROUVE'),
    (b) => b.montant_accorde,
  );
  const totalDecaisse = sum(
    decaissementRows.filter((d) => d.statut === 'VALIDE'),
    (d) => d.montant_decaisse,
  );
  const totalEchu = sum(remboursementRows, (r) => r.montant_echu);
  const totalPaye = sum(remboursementRows, (r) => r.montant_paye);
  const impayes = sum(remboursementRows, (r) => r.montant_impaye);
  const encours = totalDecaisse - totalPaye;
  const tauxRemb = totalEchu > 0 ? Math.round((totalPaye / totalEchu) * 100) : 0;

  const tabs: { value: string; label: string; icon: LucideIcon; content: React.ReactNode }[] = [
    {
      value: 'budgets',
      label: 'Financements',
      icon: Wallet,
      content: (
        <TabTable
          isLoading={budgets.isLoading}
          rows={budgetRows}
          columns={budgetColumns(formatMontant)}
          emptyIcon={Wallet}
          emptyTitle="Aucun financement"
          emptyDescription="Aucun financement accordé n'est enregistré pour le moment."
        />
      ),
    },
    {
      value: 'decaissements',
      label: 'Décaissements',
      icon: Banknote,
      content: (
        <TabTable
          isLoading={decaissements.isLoading}
          rows={decaissementRows}
          columns={decaissementColumns(formatMontant)}
          emptyIcon={Banknote}
          emptyTitle="Aucun décaissement"
          emptyDescription="Aucun décaissement n'est enregistré pour le moment."
        />
      ),
    },
    {
      value: 'remboursements',
      label: 'Remboursements',
      icon: HandCoins,
      content: (
        <TabTable
          isLoading={remboursements.isLoading}
          rows={remboursementRows}
          columns={remboursementColumns(formatMontant)}
          emptyIcon={HandCoins}
          emptyTitle="Aucun remboursement"
          emptyDescription="Aucun remboursement n'est enregistré pour le moment."
        />
      ),
    },
    {
      value: 'comptes',
      label: 'Comptes',
      icon: Landmark,
      content: (
        <TabTable
          isLoading={comptes.isLoading}
          rows={compteRows}
          columns={compteColumns}
          emptyIcon={Landmark}
          emptyTitle="Aucun compte"
          emptyDescription="Aucun compte de financement n'est enregistré pour le moment."
        />
      ),
    },
    {
      value: 'plans',
      label: 'Plans décais.',
      icon: CalendarClock,
      content: (
        <TabTable
          isLoading={plans.isLoading}
          rows={plans.data ?? []}
          columns={planColumns(formatMontant)}
          emptyIcon={CalendarClock}
          emptyTitle="Aucun plan"
          emptyDescription="Aucun plan de décaissement n'est enregistré pour le moment."
        />
      ),
    },
    {
      value: 'decl-decaissement',
      label: 'Décl. décais.',
      icon: FileText,
      content: (
        <TabTable
          isLoading={decaissementDecls.isLoading}
          rows={decaissementDecls.data ?? []}
          columns={decaissementDeclColumns(formatMontant)}
          emptyIcon={FileText}
          emptyTitle="Aucune déclaration"
          emptyDescription="Aucune déclaration de décaissement n'est enregistrée pour le moment."
        />
      ),
    },
    {
      value: 'decl-remboursement',
      label: 'Décl. remb.',
      icon: ScrollText,
      content: (
        <TabTable
          isLoading={remboursementDecls.isLoading}
          rows={remboursementDecls.data ?? []}
          columns={remboursementDeclColumns(formatMontant)}
          emptyIcon={ScrollText}
          emptyTitle="Aucune déclaration"
          emptyDescription="Aucune déclaration de remboursement n'est enregistrée pour le moment."
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financements</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Suivi consolidé du portefeuille : financements accordés, décaissements et remboursements.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Total accordé" value={formatMontant(totalAccorde)} />
        <Kpi label="Total décaissé" value={formatMontant(totalDecaisse)} />
        <Kpi label="Encours" value={formatMontant(encours)} />
        <Kpi label="Taux de remboursement" value={`${tauxRemb} %`} />
        <Kpi label="Impayés" value={formatMontant(impayes)} tone="danger" />
      </div>

      <Tabs defaultValue={tabs[0].value} className="w-full">
        <TabsList variant="solid" className="flex h-auto flex-wrap justify-start">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="cursor-pointer gap-1.5">
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
    </div>
  );
}
