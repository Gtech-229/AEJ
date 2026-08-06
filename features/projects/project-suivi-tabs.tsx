'use client';

import type { LucideIcon } from 'lucide-react';
import { Building2, GitBranch, HandCoins, Receipt, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/generic/empty-state';
import { cn } from '@/lib/utils';
import type { Projet } from './projects.dto';
import { formatMontant } from './projects.constants';
import { computeProfitability, type Operation } from './operations';

/** Placeholder body for a section whose endpoint doesn't exist yet. */
function ComingSoon({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return <EmptyState variant="card" icon={icon} title={title} description={description} />;
}

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

function OperationsTab() {
  // TODO(backend): fetch the project's operations once the endpoint exists.
  const operations: Operation[] = [];
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
      <EmptyState
        variant="card"
        icon={Receipt}
        title="Aucune opération"
        description="Enregistrez les dépenses et recettes du projet pour calculer sa rentabilité."
      />
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
export function ProjectSuiviTabs({ projet: _projet }: { projet: Projet }) {
  const tabs: SuiviTab[] = [
    {
      value: 'progression',
      label: 'Progression',
      icon: GitBranch,
      content: (
        <ComingSoon
          icon={GitBranch}
          title="Workflow à venir"
          description="Les étapes du workflow (soumission, analyse, formation, financement, suivi…) et leur avancement s'afficheront ici."
        />
      ),
    },
    {
      value: 'financement',
      label: 'Financement',
      icon: Wallet,
      content: (
        <ComingSoon
          icon={Wallet}
          title="Financement à venir"
          description="Le budget accordé et les décaissements du projet s'afficheront ici."
        />
      ),
    },
    {
      value: 'remboursements',
      label: 'Remboursements',
      icon: HandCoins,
      content: (
        <ComingSoon
          icon={HandCoins}
          title="Remboursements à venir"
          description="L'échéancier et les remboursements effectués s'afficheront ici."
        />
      ),
    },
    {
      value: 'organisation',
      label: 'Organisation',
      icon: Building2,
      content: (
        <ComingSoon
          icon={Building2}
          title="Organisation à venir"
          description="L'organisme financeur, le dispositif, le guichet et l'agence rattachés au projet s'afficheront ici."
        />
      ),
    },
    {
      value: 'operations',
      label: 'Opérations',
      icon: Receipt,
      content: <OperationsTab />,
    },
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
