'use client';

import { AppWindow, Bell, Coins, Link2, Mail, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import type { Configuration } from './configurations.dto';
import { useConfigurations, useUpdateConfigurations } from './configurations.hooks';
import {
  CoordonneesSection,
  FinanceSection,
  IdentiteSection,
  IntegrationsSection,
  NotificationsSection,
  SecuriteSection,
  type SectionProps,
} from './configurations.sections';


const TABS: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  Section: (props: SectionProps) => React.ReactElement;
}[] = [
  { value: 'identite', label: 'Identité', icon: AppWindow, Section: IdentiteSection },
  { value: 'coordonnees', label: 'Coordonnées', icon: Mail, Section: CoordonneesSection },
  { value: 'finance', label: 'Finance', icon: Coins, Section: FinanceSection },
  { value: 'securite', label: 'Sécurité', icon: ShieldCheck, Section: SecuriteSection },
  { value: 'notifications', label: 'Notifications', icon: Bell, Section: NotificationsSection },
  { value: 'integrations', label: 'Intégrations', icon: Link2, Section: IntegrationsSection },
];

export function ConfigurationsClient() {
  const { data: config, isLoading } = useConfigurations();
  const patch = useUpdateConfigurations();
   
  function handleSave(section: Partial<Configuration>) {
    if (!config) return;
    
    patch.mutate({ ...config, ...section });
  }


 
    

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuration du système</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Paramètres généraux de la plateforme
        </p>
      </div>

      {isLoading ? (
        <ConfigSkeleton />
      ) : !config ? (
        <p className="text-sm text-muted-foreground">Aucune configuration disponible.</p>
      ) : (
        <Tabs
          defaultValue="identite"
          orientation="vertical"
          className="h-[40vh] min-h-[400px] gap-6"
        >
          <TabsList
            variant="solid"
            className="w-56 shrink-0 border border-border bg-card p-1 group-data-[orientation=vertical]/tabs:h-full"
          >
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="w-full justify-start gap-2">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
            {TABS.map(({ value, Section }) => (
              <TabsContent key={value} value={value} className="mt-0 min-h-0 flex-1">
                <Section params={config} isSaving={patch.isPending} onSave={handleSave} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
    </div>
  );
}

function ConfigSkeleton() {
  return (
    <div className="flex gap-6">
      <Skeleton className="h-72 w-56 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-4 rounded-xl border border-border p-6">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
