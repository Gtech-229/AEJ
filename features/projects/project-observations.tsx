'use client';

import { useMemo, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { formatDateTime } from '@/lib/date';
import { useAuth } from '@/features/auth/auth.context';
import {
  useCreateObservation,
  useObservations,
} from '@/features/observations/observations.hooks';
import type { Projet } from './projects.dto';

/**
 * Observations panel for a micro-projet: a compose box (the current agent is the
 * author) + a reverse-chronological timeline of observations. The backend
 * doesn't scope `/observations` by micro_projet_id yet, so we filter client-side.
 */
export function ProjectObservations({ projet }: { projet: Projet }) {
  const { user } = useAuth();
  const { data: all, isLoading } = useObservations();
  const create = useCreateObservation();
  const [text, setText] = useState('');

  const observations = useMemo(
    () =>
      (all ?? [])
        .filter((o) => o.micro_projet_id === projet.id)
        .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')),
    [all, projet.id],
  );

  function submit() {
    const observation = text.trim();
    if (!observation || !user) return;
    create.mutate(
      { micro_projet_id: projet.id, auteur_id: user.id, observation },
      { onSuccess: () => setText('') },
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-border p-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Ajouter une observation sur le suivi du dossier…"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={submit}
            disabled={!text.trim() || create.isPending || !user}
          >
            <Send className="size-4" />
            {create.isPending ? 'Envoi…' : 'Publier'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Chargement…" />
      ) : observations.length === 0 ? (
        <EmptyState
          variant="card"
          icon={MessageSquare}
          title="Aucune observation"
          description="Les observations des agents sur ce dossier s'afficheront ici."
        />
      ) : (
        <ul className="space-y-3">
          {observations.map((o) => (
            <li key={o.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {o.auteur ? `${o.auteur.prenom} ${o.auteur.nom}` : `#${o.auteur_id}`}
                </span>
                <span>{o.created_at ? formatDateTime(o.created_at) : ''}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{o.observation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
