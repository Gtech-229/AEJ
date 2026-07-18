'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import api from '@/lib/api';

interface Secteur { id: number; nom: string; description?: string; couleur: string; entreprises_count: number; stagiaires_count: number; }
interface FormData { nom: string; description: string; couleur: string; }
const EMPTY: FormData = { nom: '', description: '', couleur: '#1a7a3c' };

const MOCK: Secteur[] = [
  { id: 1, nom: 'Technologies', description: 'IT, développement, cybersécurité', couleur: '#3b82f6', entreprises_count: 45, stagiaires_count: 320 },
  { id: 2, nom: 'Télécommunications', description: 'Réseaux, téléphonie, internet', couleur: '#8b5cf6', entreprises_count: 12, stagiaires_count: 180 },
  { id: 3, nom: 'Finance & Banque', description: 'Banques, assurances, microfinance', couleur: '#f59e0b', entreprises_count: 28, stagiaires_count: 210 },
  { id: 4, nom: 'Agriculture', description: 'Agro-industrie, élevage, pêche', couleur: '#10b981', entreprises_count: 18, stagiaires_count: 95 },
  { id: 5, nom: 'Santé', description: 'Hôpitaux, pharmacies, cliniques', couleur: '#ef4444', entreprises_count: 22, stagiaires_count: 140 },
  { id: 6, nom: 'Commerce', description: 'Distribution, e-commerce, import', couleur: '#f97316', entreprises_count: 35, stagiaires_count: 175 },
  { id: 7, nom: 'BTP', description: 'Construction, architecture', couleur: '#6b7280', entreprises_count: 14, stagiaires_count: 88 },
];

const COLORS = ['#1a7a3c', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#f97316', '#10b981', '#ec4899', '#6b7280', '#0ea5e9'];

function Modal({ secteur, onClose, onSave }: { secteur?: Secteur; onClose: () => void; onSave: (d: FormData) => Promise<void> }) {
  const [form, setForm] = useState<FormData>(secteur ? { nom: secteur.nom, description: secteur.description ?? '', couleur: secteur.couleur } : EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{secteur ? 'Modifier le secteur' : 'Nouveau secteur'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><X size={16} className="text-gray-400" /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
            <input value={form.nom} onChange={e => set('nom', e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
              placeholder="ex: Technologies" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('couleur', c)}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: form.couleur === c ? '#1f2937' : 'transparent' }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: '#1a7a3c' }}>
              {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
              {secteur ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SecteursPage() {
  const [items, setItems] = useState<Secteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<Secteur | undefined>();
  const [deleteItem, setDeleteItem] = useState<Secteur | undefined>();

  useEffect(() => {
    setItems(MOCK);
    setLoading(false);
  }, []);

  async function handleCreate(form: FormData) { const res = await api.post<Secteur>('/secteurs', form); setItems(p => [res.data, ...p]); }
  async function handleEdit(form: FormData) { const res = await api.put<Secteur>(`/secteurs/${editItem!.id}`, form); setItems(p => p.map(s => s.id === editItem!.id ? res.data : s)); }
  async function handleDelete() { await api.delete(`/secteurs/${deleteItem!.id}`); setItems(p => p.filter(s => s.id !== deleteItem!.id)); setDeleteItem(undefined); }

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secteurs d'activité</h1>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} secteur{items.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold" style={{ backgroundColor: '#1a7a3c' }}>
          <Plus size={16} /> Nouveau secteur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-32" />) :
          items.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.couleur + '20' }}>
                    <Tag size={18} style={{ color: s.couleur }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{s.nom}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.couleur }} />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>🏢 {s.entreprises_count} entreprises</span>
                  <span>👤 {s.stagiaires_count} stagiaires</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditItem(s)} className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center"><Pencil size={12} style={{ color: '#1a7a3c' }} /></button>
                  <button onClick={() => setDeleteItem(s)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 size={12} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showCreate && <Modal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
      {editItem && <Modal secteur={editItem} onClose={() => setEditItem(undefined)} onSave={handleEdit} />}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-lg font-bold mb-2">Supprimer ce secteur ?</h3>
            <p className="text-sm text-gray-500 mb-6"><span className="font-semibold">{deleteItem.nom}</span><br />Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteItem(undefined)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

