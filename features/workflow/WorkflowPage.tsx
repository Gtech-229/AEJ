'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useWorkflowList, useAdvanceWorkflow } from './workflow.hooks';
import { WORKFLOW_STAGES } from './workflow.constants';
import type { StatutWorkflow } from '../credits/credits.types';

const NEXT_STAGE: Partial<Record<StatutWorkflow, StatutWorkflow>> = {
  instruction: 'plan_affaires',
  plan_affaires: 'transmission_partenaire',
  transmission_partenaire: 'traitement_partenaire',
  traitement_partenaire: 'suivi_exploitation',
};

export function WorkflowPage() {
  const { data: dossiers, isLoading } = useWorkflowList();
  const advanceMutation = useAdvanceWorkflow();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const byStage = useMemo(() => {
    const map: Record<StatutWorkflow, typeof dossiers> = {
      instruction: [],
      plan_affaires: [],
      transmission_partenaire: [],
      traitement_partenaire: [],
      suivi_exploitation: [],
    } as Record<StatutWorkflow, NonNullable<typeof dossiers>>;
    (dossiers ?? []).forEach((d) => {
      map[d.statutWorkflow]?.push(d);
    });
    return map;
  }, [dossiers]);

  function toggle(creditId: string) {
    setSelected((prev) => ({ ...prev, [creditId]: !prev[creditId] }));
  }

  function advanceLot(stage: StatutWorkflow) {
    const to = NEXT_STAGE[stage];
    if (!to) return;
    const creditIds = (byStage[stage] ?? [])
      .filter((d) => selected[d.creditId])
      .map((d) => d.creditId);
    if (creditIds.length === 0) return;

    advanceMutation.mutate(
      { creditIds, from: stage, to },
      {
        onSuccess: () => {
          setSelected((prev) => {
            const next = { ...prev };
            creditIds.forEach((id) => delete next[id]);
            return next;
          });
        },
      },
    );
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Chargement du workflow…</div>;
  }

  return (
    <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
      <div className="text-xs text-gray-400 flex items-center gap-1.5">
        <Link href="/organismes/dashboard" className="hover:underline">Accueil</Link> <span>›</span>
        <Link href="/organismes/beneficiaires" className="hover:underline">Bénéficiaires</Link> <span>›</span>
        <span className="font-medium text-gray-700">Suivi du workflow</span>
      </div>

      <p className="text-sm text-gray-500">
        Cochez plusieurs dossiers dans une même étape puis cliquez sur « Faire avancer le lot » pour les transmettre
        ensemble à l'étape suivante.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {WORKFLOW_STAGES.map((stage) => {
          const items = byStage[stage.id] ?? [];
          const anySelected = items.some((d) => selected[d.creditId]);
          const canAdvance = !!NEXT_STAGE[stage.id];

          return (
            <div key={stage.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{stage.label}</h3>
              <p className="text-xs text-gray-400 mb-3">
                {items.length} dossier{items.length > 1 ? 's' : ''}
              </p>

              {canAdvance && (
                <button
                  disabled={!anySelected || advanceMutation.isPending}
                  onClick={() => advanceLot(stage.id)}
                  className={`w-full text-xs font-medium py-1.5 rounded-lg mb-3 transition-colors ${
                    anySelected
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  → Faire avancer le lot
                </button>
              )}

              <div className="space-y-2">
                {items.map((d) => (
                  <div key={d.creditId} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={!!selected[d.creditId]}
                        onChange={() => toggle(d.creditId)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{d.beneficiaireNom}</p>
                        <p className="text-[10px] text-gray-400">{d.code}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-blue-600 font-medium">{d.banque}</span>
                          <span className="text-[10px] text-gray-400">{d.joursDansEtape}j dans l'étape</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-gray-300 text-center py-4">Aucun dossier</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
