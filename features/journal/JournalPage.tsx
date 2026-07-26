'use client';

import { PageHeader } from '@/components/legacy-ui/PageHeader';
import { GenericTable } from '@/components/generic/generic-table';
import { SEED_JOURNAL } from './journal.data';
import { JOURNAL_COLUMNS } from './journal.columns';

const ACTION_FILTER_OPTIONS = [
  { value: 'creation', label: 'Création' },
  { value: 'modification', label: 'Modification' },
  { value: 'suppression', label: 'Suppression' },
  { value: 'connexion', label: 'Connexion' },
  { value: 'export', label: 'Export' },
];

export function JournalPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] px-6 py-6 max-w-6xl mx-auto">
      <PageHeader
        title="Journal d'activité"
        subtitle={`${SEED_JOURNAL.length} événement(s) enregistré(s)`}
      />

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <GenericTable
          data={SEED_JOURNAL}
          columns={JOURNAL_COLUMNS}
          searchKey="utilisateur"
          searchPlaceholder="Rechercher un utilisateur..."
          facetedFilters={[{ columnId: 'action', title: 'Action', options: ACTION_FILTER_OPTIONS }]}
          emptyMessage="Aucun événement enregistré."
          initialState={{ sorting: [{ id: 'horodatage', desc: true }] }}
        />
      </div>
    </div>
  );
}
