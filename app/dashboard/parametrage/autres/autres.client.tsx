'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IdCard, Network } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServicesClient } from '@/features/services/services.client';
import { FonctionsClient } from '@/features/fonctions/fonctions.client';

const TABS = ['services', 'fonctions'] as const;
type TabValue = (typeof TABS)[number];

// Table state keys owned by GenericTable — reset on tab switch so one tab's
// search/sort/pagination doesn't bleed into the other (both share the URL).
const TABLE_PARAM_KEYS = ['q', 'page', 'size', 'sort'];

/**
 * "Autres paramètres" — a horizontal tab shell over the Services and Fonctions
 * modules. The active tab is synced to `?tab=` so it's deep-linkable and
 * survives a refresh (consistent with the tables' URL-driven state).
 */
export function AutresParametresClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams.get('tab');
  const tab: TabValue = (TABS as readonly string[]).includes(raw ?? '')
    ? (raw as TabValue)
    : 'services';

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
        <h1 className="text-2xl font-bold text-foreground">Autres paramètres</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les services et les fonctions de l&apos;agence.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <TabsList variant="line">
          <TabsTrigger value="services">
            <Network />
            Services
          </TabsTrigger>
          <TabsTrigger value="fonctions">
            <IdCard />
            Fonctions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServicesClient />
        </TabsContent>
        <TabsContent value="fonctions">
          <FonctionsClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
