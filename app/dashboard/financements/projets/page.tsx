'use client';

import { useEffect, useState } from 'react';
import {
  Plus, Search, Filter, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, X, Check, AlertTriangle,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

type Statut = 'en_cours' | 'acheve' | 'suspendu';

interface Financement {
  id: number;
  code: string;
  partenaire: string;
  date_debut: string;
  montant_total: number;
  montant_decaisse: number;
  statut: Statut;
  description?: string;
}

interface FormData {
  partenaire: string;
  date_debut: string;
  montant_total: string;
  montant_decaisse: string;
  statut: Statut;
  description: string;
}

const EMPTY_FORM: FormData = {
  partenaire: '', date_debut: '', montant_total: '',
  montant_decaisse: '', statut: 'en_cours', description: '',
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK: Financement[] = [
  { id: 1, code: 'FIN-2026-001', partenaire: 'Banque Mondiale', date_debut: '15/01/2026', montant_total: 12000000, montant_decaisse: 8000000, statut: 'en_cours' },
  { id: 2, code: 'FIN-2026-002', partenaire: 'BAD', date_debut: '01/02/2026', montant_total: 9500000, montant_decaisse: 4200000, statut: 'en_cours' },
  { id: 3, code: 'FIN-2025-014', partenaire: 'Union Européenne', date_debut: '01/09/2025', montant_total: 7800000, montant_decaisse: 7800000, statut: 'acheve' },
  { id: 4, code: 'FIN-2026-003', partenaire: 'ONU Femmes', date_debut: '10/03/2026', montant_total: 5200000, montant_decaisse: 1800000, statut: 'en_cours' },
  { id: 5, code: 'FIN-2026-004', partenaire: 'ONG ALLÔ MORY', date_debut: '20/03/2026', montant_total: 3100000, montant_decaisse: 900000, statut: 'en_cours' },
  { id: 6, code: 'FIN-2026-005', partenaire: 'FIDA', date_debut: '01/04/2026', montant_total: 3912000, montant_decaisse: 2912000, statut: 'en_cours' },
  { id: 7, code: 'FIN-2025-010', partenaire: 'USAID', date_debut: '10/06/2025', montant_total: 6400000, montant_decaisse: 6400000, statut: 'acheve' },
  { id: 8, code: 'FIN-2025-011', partenaire: 'GIZ', date_debut: '01/07/2025', montant_total: 4100000, montant_decaisse: 2050000, statut: 'suspendu' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function pct(decaisse: number, total: number) {
  if (!total) return 0;
  return Math.round((decaisse / total) * 100);
}

function StatutBadge({ statut }: { statut: Statut }) {
  const cfg = {
    en_cours: { cls: 'bg-green-50 text-green-700', dot: 'bg-green-500', label: 'En cours' },
    acheve: { cls: 'bg-orange-50 text-orange-500', dot: 'bg-orange-400', label: 'Achevé' },
    suspendu: { cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400', label: 'Suspendu' },
  }[statut];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Modal Création / Édition ─────────────────────────────────────────────────

function FinancementModal({
  financement,
  onClose,
  onSave,
}: {
  financement?: Financement;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<FormData>(
    financement
      ? {
        partenaire: financement.partenaire,
        date_debut: financement.date_debut,
        montant_total: String(financement.montant_total),
        montant_decaisse: String(financement.montant_decaisse),
        statut: financement.statut,
        description: financement.description ?? '',
      }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof FormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {financement ? 'Modifier le financement' : 'Nouveau financement'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">
              <AlertTriangle size={15} />
              {error}
            </div>
          )}

          {/* Partenaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Partenaire *</label>
            <input
              value={form.partenaire}
              onChange={(e) => set('partenaire', e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
              placeholder="ex: Banque Mondiale"
            />
          </div>

          {/* Date début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de début *</label>
            <input
              type="date"
              value={form.date_debut}
              onChange={(e) => set('date_debut', e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
            />
          </div>

          {/* Montants */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant total (FCFA) *</label>
              <input
                type="number"
                value={form.montant_total}
                onChange={(e) => set('montant_total', e.target.value)}
                required
                min={0}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Décaissé (FCFA)</label>
              <input
                type="number"
                value={form.montant_decaisse}
                onChange={(e) => set('montant_decaisse', e.target.value)}
                min={0}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                placeholder="0"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
            <select
              value={form.statut}
              onChange={(e) => set('statut', e.target.value as Statut)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary bg-white"
            >
              <option value="en_cours">En cours</option>
              <option value="acheve">Achevé</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
              placeholder="Objectifs, détails du projet..."
            />
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium
                         text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-green-primary hover:bg-green-dark text-white rounded-xl
                         text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={15} />
              )}
              {financement ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Confirmation suppression ──────────────────────────────────────────

function DeleteModal({
  financement,
  onClose,
  onConfirm,
}: {
  financement: Financement;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer ce financement ?</h3>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold">{financement.code}</span> — {financement.partenaire}
          <br />Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold
                       transition-colors disabled:opacity-60"
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

export default function FinancementsProjetsPage() {
  const [items, setItems] = useState<Financement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilter] = useState<Statut | 'tous'>('tous');
  const [page, setPage] = useState(0);

  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<Financement | undefined>();
  const [deleteItem, setDeleteItem] = useState<Financement | undefined>();
  const [viewItem, setViewItem] = useState<Financement | undefined>();

  // Chargement
  useEffect(() => {
    setItems(MOCK);
    setLoading(false);
  }, []);

  // Filtrage
  const filtered = items.filter((f) => {
    const matchSearch = !search ||
      f.partenaire.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'tous' || f.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // CRUD handlers
  async function handleCreate(form: FormData) {
    const res = await api.post<Financement>('/financements', {
      ...form,
      montant_total: Number(form.montant_total),
      montant_decaisse: Number(form.montant_decaisse),
    });
    setItems((prev) => [res.data, ...prev]);
  }

  async function handleEdit(form: FormData) {
    const res = await api.put<Financement>(`/financements/${editItem!.id}`, {
      ...form,
      montant_total: Number(form.montant_total),
      montant_decaisse: Number(form.montant_decaisse),
    });
    setItems((prev) => prev.map((f) => (f.id === editItem!.id ? res.data : f)));
  }

  async function handleDelete() {
    await api.delete(`/financements/${deleteItem!.id}`);
    setItems((prev) => prev.filter((f) => f.id !== deleteItem!.id));
    setDeleteItem(undefined);
  }

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets financés</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} projet{filtered.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-primary hover:bg-green-dark
                     text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Nouveau financement
        </button>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Rechercher partenaire, code..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['tous', 'en_cours', 'acheve', 'suspendu'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(0); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                ${filterStatut === s
                  ? 'bg-green-primary text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {{ tous: 'Tous', en_cours: 'En cours', acheve: 'Achevés', suspendu: 'Suspendus' }[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Chargement...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
            <Filter size={32} className="text-gray-200" />
            Aucun financement trouvé
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Code', 'Partenaire', 'Date début', 'Montant total', 'Décaissé', 'Avancement', 'Statut', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((f) => {
                const avancement = pct(f.montant_decaisse, f.montant_total);
                return (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-xs font-bold text-gray-700">{f.code}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{f.partenaire}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{f.date_debut}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{fmt(f.montant_total)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{fmt(f.montant_decaisse)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-primary transition-all"
                            style={{ width: `${avancement}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{avancement}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatutBadge statut={f.statut} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewItem(f)}
                          className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
                          title="Voir"
                        >
                          <Eye size={14} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => setEditItem(f)}
                          className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} className="text-green-primary" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(f)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Page {page + 1} sur {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center
                           hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                    ${page === i
                      ? 'bg-green-primary text-white'
                      : 'hover:bg-gray-50 text-gray-500'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center
                           hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Détail */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Détail du financement</h2>
              <button onClick={() => setViewItem(undefined)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Code</span>
                <span className="font-bold text-gray-800">{viewItem.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Partenaire</span>
                <span className="font-medium text-gray-700">{viewItem.partenaire}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date début</span>
                <span className="text-gray-700">{viewItem.date_debut}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Statut</span>
                <StatutBadge statut={viewItem.statut} />
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Montant total</span>
                  <span className="font-bold text-gray-800">{fmt(viewItem.montant_total)}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Décaissé</span>
                  <span className="font-bold text-green-primary">{fmt(viewItem.montant_decaisse)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-primary rounded-full"
                      style={{ width: `${pct(viewItem.montant_decaisse, viewItem.montant_total)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-green-primary">
                    {pct(viewItem.montant_decaisse, viewItem.montant_total)}%
                  </span>
                </div>
              </div>
              {viewItem.description && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-600">{viewItem.description}</p>
                </div>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => { setViewItem(undefined); setEditItem(viewItem); }}
                className="flex-1 py-2.5 bg-green-primary text-white rounded-xl text-sm font-semibold
                           hover:bg-green-dark transition-colors flex items-center justify-center gap-2"
              >
                <Pencil size={14} /> Modifier
              </button>
              <button
                onClick={() => setViewItem(undefined)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création */}
      {showCreate && (
        <FinancementModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {/* Modal Édition */}
      {editItem && (
        <FinancementModal
          financement={editItem}
          onClose={() => setEditItem(undefined)}
          onSave={handleEdit}
        />
      )}

      {/* Modal Suppression */}
      {deleteItem && (
        <DeleteModal
          financement={deleteItem}
          onClose={() => setDeleteItem(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}