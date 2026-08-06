'use client';

import { useState } from 'react';
import { RotateCcw, Search, Calendar, FileText, Sheet, FileSpreadsheet, Printer, CheckCircle2 } from 'lucide-react';
import { useGenererRapport, useExportRapport, usePlanifierRapport } from './rapport.hooks';
import { TYPES_RAPPORT } from './rapport.constants';
import type { FormatExport, RapportFiltres, TypeRapport } from './rapport.types';

const DEFAULT_FILTRES: RapportFiltres = { type: 'global' };

export function RapportPage() {
  const [filtres, setFiltres] = useState<RapportFiltres>(DEFAULT_FILTRES);
  const [recipients, setRecipients] = useState('');

  const genererMutation = useGenererRapport();
  const exportMutation = useExportRapport();
  const planifierMutation = usePlanifierRapport();

  function updateFiltre<K extends keyof RapportFiltres>(key: K, value: RapportFiltres[K]) {
    setFiltres((prev) => ({ ...prev, [key]: value }));
  }

  function handleSelectType(type: TypeRapport) {
    updateFiltre('type', type);
  }

  function handleAfficherResultats() {
    genererMutation.mutate(filtres);
  }

  function handleReset() {
    setFiltres(DEFAULT_FILTRES);
    genererMutation.reset();
  }

  function handleExport(format: FormatExport) {
    exportMutation.mutate(
      { filtres, format },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `rapport-${filtres.type}.${format === 'excel' ? 'xlsx' : format}`;
          a.click();
          URL.revokeObjectURL(url);
        },
      },
    );
  }

  function handlePlanifier() {
    planifierMutation.mutate({
      ...filtres,
      periodicite: 'mensuel',
      destinataires: recipients.split(',').map((e) => e.trim()).filter(Boolean),
    });
  }

  const resultat = genererMutation.data;

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <h1 className="text-lg font-bold text-gray-800">Génération des rapports</h1>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Filtres de génération</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Field label="Type de rapport">
            <select
              value={filtres.type}
              onChange={(e) => updateFiltre('type', e.target.value as TypeRapport)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
            >
              {TYPES_RAPPORT.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Banque">
            <input
              value={filtres.banque ?? ''}
              onChange={(e) => updateFiltre('banque', e.target.value)}
              placeholder="Toutes les banques"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
            />
          </Field>
          <Field label="Région">
            <input
              value={filtres.region ?? ''}
              onChange={(e) => updateFiltre('region', e.target.value)}
              placeholder="Toutes les régions"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
            />
          </Field>
          <Field label="Période début">
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filtres.periodeDebut ?? ''}
                onChange={(e) => updateFiltre('periodeDebut', e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
              />
            </div>
          </Field>
          <Field label="Période fin">
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filtres.periodeFin ?? ''}
                onChange={(e) => updateFiltre('periodeFin', e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
              />
            </div>
          </Field>
          <Field label="Secteur d'activité">
            <input
              value={filtres.secteurActivite ?? ''}
              onChange={(e) => updateFiltre('secteurActivite', e.target.value)}
              placeholder="Tous les secteurs"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
            />
          </Field>
          <div className="flex items-end gap-2 col-span-2 md:col-span-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={12} /> Réinitialiser
            </button>
            <button
              onClick={handleAfficherResultats}
              disabled={genererMutation.isPending}
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1a7a3c] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Search size={12} /> {genererMutation.isPending ? 'Génération…' : 'Afficher les résultats'}
            </button>
          </div>
        </div>
      </div>

      {/* Types de rapport */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Aperçu des rapports disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TYPES_RAPPORT.map((t) => (
            <div key={t.id} className="border border-gray-100 rounded-2xl p-4">
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="text-sm font-semibold text-gray-800">{t.title}</p>
              <p className="text-xs text-gray-400 mt-1 mb-2">{t.description}</p>
              <ul className="text-xs text-gray-500 space-y-0.5 mb-3 list-disc list-inside">
                {t.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <button
                onClick={() => handleSelectType(t.id)}
                className={`w-full text-sm font-semibold py-2 rounded-lg border transition-colors ${
                  filtres.type === t.id
                    ? 'bg-green-50 border-green-600 text-green-700'
                    : 'border-green-600 text-green-700 hover:bg-green-50'
                }`}
              >
                {filtres.type === t.id ? 'Sélectionné ✓' : 'Sélectionner'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Résultats */}
      {resultat && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Résultats ({resultat.totalBeneficiaires.toLocaleString('fr-FR')} bénéficiaires trouvés)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <ResultKpi label="Total bénéficiaires" value={resultat.totalBeneficiaires.toLocaleString('fr-FR')} />
            <ResultKpi label="Montant total engagé" value={`${resultat.montantTotalEngage.toLocaleString('fr-FR')} GNF`} />
            <ResultKpi label="Montant total remboursé" value={`${resultat.montantTotalRembourse.toLocaleString('fr-FR')} GNF`} />
            <ResultKpi label="Solde restant" value={`${resultat.soldeRestant.toLocaleString('fr-FR')} GNF`} />
            <ResultKpi label="Taux de remboursement" value={`${resultat.tauxRemboursement}%`} />
          </div>
        </div>
      )}

      {/* Export / planification / destinataires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Options d'export</h3>
          <div className="space-y-2">
            <ExportButton icon={<FileText size={14} />} label="Exporter en PDF" onClick={() => handleExport('pdf')} loading={exportMutation.isPending} />
            <ExportButton icon={<Sheet size={14} />} label="Exporter en Excel" onClick={() => handleExport('excel')} loading={exportMutation.isPending} />
            <ExportButton icon={<FileSpreadsheet size={14} />} label="Exporter en CSV" onClick={() => handleExport('csv')} loading={exportMutation.isPending} />
            <button className="w-full flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer size={14} /> Imprimer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Planification de rapport</h3>
          <p className="text-xs text-gray-400 mb-4">Automatisez l'envoi de ce rapport par email selon une périodicité.</p>
          <button
            onClick={handlePlanifier}
            disabled={planifierMutation.isPending}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Calendar size={14} /> {planifierMutation.isPending ? 'Planification…' : "Planifier l'envoi"}
          </button>
          {planifierMutation.isSuccess && <p className="text-xs text-green-600 mt-2">Rapport planifié avec succès.</p>}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Destinataires (optionnel)</h3>
          <input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="Saisir les emails (séparés par des virgules)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-1 focus:outline-none focus:border-green-600"
          />
          <p className="text-[11px] text-gray-400">Ex: directeur@agence.ci, finance@agence.ci</p>
        </div>
      </div>

      {/* Barre de génération */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Prêt à générer</p>
            <p className="text-xs text-gray-400">Votre rapport sera généré selon les filtres sélectionnés.</p>
          </div>
        </div>
        <button
          onClick={() => handleExport('pdf')}
          disabled={exportMutation.isPending}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-[#1a7a3c] px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <FileText size={14} /> Générer le rapport
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {children}
    </div>
  );
}

function ResultKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}

function ExportButton({
  icon,
  label,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center gap-2 text-sm font-semibold text-white py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{ backgroundColor: '#1a7a3c' }}
    >
      {icon} {label}
    </button>
  );
}
