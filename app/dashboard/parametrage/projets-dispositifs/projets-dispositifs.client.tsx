'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Building2, Layers, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DispositifsClient } from '@/features/dispositifs/dispositifs.client';
import { GuichetsClient } from '@/features/guichets/guichets.client';
import { EmploisPrevusClient } from '@/features/emplois-prevus/emplois-prevus.client';
import { BeneficiairesPrevusClient } from '@/features/beneficiaires-prevus/beneficiaires-prevus.client';

const TABS = ['dispositifs', 'guichets', 'emplois-prevus', 'beneficiaires-prevus'] as const;
type TabValue = (typeof TABS)[number];

// Table state keys owned by GenericTable — reset on tab switch so one tab's
// search/sort/pagination doesn't bleed into the other (all tabs share the URL).
const TABLE_PARAM_KEYS = ['q', 'page', 'size', 'sort'];

/**
 * "Projets & dispositifs" — a horizontal tab shell over the Dispositifs,
 * Guichets, Emplois prévus and Bénéficiaires prévus referentials. The active
 * tab is synced to `?tab=` so it's deep-linkable and survives a refresh
 * (consistent with "Autres paramètres").
 */
export function ProjetsDispositifsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams.get('tab');
  const tab: TabValue = (TABS as readonly string[]).includes(raw ?? '')
    ? (raw as TabValue)
    : 'dispositifs';

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    TABLE_PARAM_KEYS.forEach((k) => params.delete(k));
    [...params.keys()].filter((k) => k.startsWith('f.')).forEach((k) => params.delete(k));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projets &amp; dispositifs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Paramétrez les dispositifs, guichets, emplois prévus et bénéficiaires prévus des
          projets AEJ.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <TabsList variant="line" className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="dispositifs">
            <Layers />
            Dispositifs
          </TabsTrigger>
          <TabsTrigger value="guichets">
            <Building2 />
            Guichets
          </TabsTrigger>
          <TabsTrigger value="emplois-prevus">
            <Briefcase />
            Emplois prévus
          </TabsTrigger>
          <TabsTrigger value="beneficiaires-prevus">
            <Users />
            Bénéficiaires prévus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dispositifs">
          <DispositifsClient />
        </TabsContent>
        <TabsContent value="guichets">
          <GuichetsClient />
        </TabsContent>
        <TabsContent value="emplois-prevus">
          <EmploisPrevusClient />
        </TabsContent>
        <TabsContent value="beneficiaires-prevus">
          <BeneficiairesPrevusClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
