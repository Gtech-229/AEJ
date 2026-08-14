'use client';

import { useQuery } from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
import { Building2, Handshake, Landmark, Layers, MapPin, Tag } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useOrganismes } from '@/features/organismes/organismes.hooks';
import { useSecteurs } from '@/features/secteurs/secteurs.hooks';
import { useCommunes } from '@/features/localites/localites.hooks';
import type { Projet } from './projects.dto';

/** Small read-only fetch of an enveloped `{ data: [...] }` referential. */
function useRefList(key: string, path: string) {
  return useQuery({
    queryKey: ['org-ref', key],
    queryFn: async () => {
      const res = await apiClient.request<{ data: { id: number }[] }>(path);
      return Array.isArray(res?.data) ? res.data : [];
    },
    staleTime: 30 * 60 * 1000,
  });
}

/** Find a row by id and return the first non-empty label among `keys`. */
function pick(
  list: readonly { id: number }[] | undefined,
  id: number | null | undefined,
  keys: string[],
): string | undefined {
  if (id == null) return undefined;
  const row = list?.find((x) => x.id === id) as Record<string, unknown> | undefined;
  if (!row) return undefined;
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string' && v) return v;
  }
  return undefined;
}

/**
 * Organisation tab: the entities the micro-projet is attached to — organisme
 * financeur, dispositif, guichet, agence, secteur, commune. Each FK is resolved
 * to a name from its referential; missing ones show "—".
 */
export function ProjectOrganisation({ projet }: { projet: Projet }) {
  const { data: organismes } = useOrganismes();
  const { data: secteurs } = useSecteurs();
  const { data: communes } = useCommunes();
  const guichets = useRefList('guichets', '/guichets');
  const dispositifs = useRefList('dispositifs', '/dispositifs');
  const agences = useRefList('agences-regionales', '/aej/agences-regionales');

  const rows: { icon: LucideIcon; label: string; value?: string }[] = [
    {
      icon: Handshake,
      label: 'Organisme financeur',
      value: pick(organismes, projet.organisme_id, ['nom', 'sigle']),
    },
    {
      icon: Layers,
      label: 'Dispositif',
      value: pick(dispositifs.data, projet.dispositif_id, ['intitule', 'code']),
    },
    {
      icon: Landmark,
      label: 'Guichet',
      value: pick(guichets.data, projet.guichet_id, ['libelle', 'code']),
    },
    {
      icon: Building2,
      label: 'Agence',
      value: pick(agences.data, projet.agence_id, ['libelle', 'nom', 'code']),
    },
    {
      icon: Tag,
      label: "Secteur d'activité",
      value: pick(secteurs, projet.secteur_id, ['libelle', 'nom']),
    },
    {
      icon: MapPin,
      label: 'Commune',
      value: pick(communes, projet.commune_id, ['nom']),
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <r.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{r.label}</dt>
              <dd className="truncate text-sm font-medium text-foreground">{r.value || '—'}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
