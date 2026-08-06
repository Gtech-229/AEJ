'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GenericTable } from '@/components/generic/generic-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DynamicForm } from '@/components/forms';
import { useEcheancesList, useEnregistrerPaiement } from './remboursement.hooks';
import { remboursementColumns } from './remboursement.columns';
import { ENREGISTRER_PAIEMENT_FORM_CONFIG } from './remboursement.form-config';
import { enregistrerPaiementSchema } from './remboursement.schema';
import type { Echeance, EnregistrerPaiementInput } from './remboursement.types';

export function RemboursementPage({ creditId }: { creditId: string }) {
  const { data: echeances, isLoading } = useEcheancesList(creditId);
  const paiementMutation = useEnregistrerPaiement(creditId);
  const [selected, setSelected] = useState<Echeance | null>(null);

  async function handleSubmit(values: Omit<EnregistrerPaiementInput, 'echeanceId'>) {
    if (!selected) return;
    await paiementMutation.mutateAsync({ echeanceId: selected.id, ...values });
    setSelected(null);
  }

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div className="text-xs text-gray-400 flex items-center gap-1.5">
        <Link href="/organismes/dashboard" className="hover:underline">Accueil</Link> <span>›</span>
        <Link href="/organismes/beneficiaires" className="hover:underline">Bénéficiaires</Link> <span>›</span>
        <span className="font-medium text-gray-700">Plan de remboursement</span>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Tableau des échéances</h3>

        <GenericTable
          data={echeances ?? []}
          columns={remboursementColumns}
          isLoading={isLoading}
          emptyMessage="Aucune échéance pour ce crédit."
        />

        <p className="text-xs text-gray-400 mt-4">
          Cliquez sur une échéance non payée dans la table pour enregistrer un paiement.
          {/* TODO: brancher un onRowClick sur GenericTable si l'API l'expose, ou ajouter une colonne "Action" dans remboursement.columns.tsx. */}
        </p>

        {(echeances ?? [])
          .filter((e) => e.statut !== 'payee')
          .map((e) => (
            <Button
              key={e.id}
              variant="outline"
              size="sm"
              className="mr-2 mt-2"
              onClick={() => setSelected(e)}
            >
              Enregistrer le paiement — {e.mois}
            </Button>
          ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement — {selected?.mois}</DialogTitle>
          </DialogHeader>
          {selected && (
            <DynamicForm
              config={ENREGISTRER_PAIEMENT_FORM_CONFIG}
              schema={enregistrerPaiementSchema}
              defaultValues={{
                montantPaye: selected.montant,
                datePaiement: new Date().toISOString().slice(0, 10),
                modePaiement: 'mobile_money',
              }}
              onSubmit={handleSubmit}
              onCancel={() => setSelected(null)}
              isLoading={paiementMutation.isPending}
              submitText="Enregistrer"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
