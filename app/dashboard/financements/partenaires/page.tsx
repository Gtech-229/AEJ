'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Building2 } from 'lucide-react';
import api from '@/lib/api/client';
import { Badge } from '@/components/legacy-ui/Badge';
import { Button } from '@/components/legacy-ui/Button';
import { Input, Select } from '@/components/legacy-ui/Input';
import { Modal } from '@/components/legacy-ui/Modal';
import { ConfirmDialog } from '@/components/legacy-ui/ConfirmDialog';
import { PageHeader } from '@/components/legacy-ui/PageHeader';

interface Partenaire { id: number; nom: string; type: string; pays: string; contact: string; email: string; projets_count: number; }
interface FormState { nom: string; type: string; pays: string; contact: string; email: string; }
const INIT: FormState = { nom: '', type: 'International', pays: '', contact: '', email: '' };

const MOCK: Partenaire[] = [
  { id: 1, nom: 'Banque Mondiale', type: 'International', pays: 'USA', contact: 'John Smith', email: 'j.smith@wb.org', projets_count: 3 },
  { id: 2, nom: 'BAD', type: 'International', pays: "Côte d'Ivoire", contact: 'Oumar Diallo', email: 'o.diallo@afdb.org', projets_count: 2 },
  { id: 3, nom: 'Union Européenne', type: 'International', pays: 'Belgique', contact: 'Marie Dupont', email: 'm.dupont@eu.org', projets_count: 1 },
  { id: 4, nom: 'ONU Femmes', type: 'International', pays: 'USA', contact: 'Aïcha Koné', email: 'a.kone@unwomen.org', projets_count: 1 },
  { id: 5, nom: 'FIDA', type: 'International', pays: 'Italie', contact: 'Luca Romani', email: 'l.romani@ifad.org', projets_count: 1 },
  { id: 6, nom: 'GIZ', type: 'Bilatéral', pays: 'Allemagne', contact: 'Hans Müller', email: 'h.muller@giz.de', projets_count: 1 },
];

const TYPE_OPTS = ['International', 'Bilatéral', 'National', 'ONG'].map(t => ({ value: t, label: t }));

const TYPE_VARIANT: Record<string, 'blue' | 'purple' | 'green' | 'orange'> = {
  International: 'blue', Bilatéral: 'purple', National: 'green', ONG: 'orange',
};

export default function PartenairesPage() {
  const [items, setItems] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Partenaire | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partenaire | null>(null);
  const [form, setForm] = useState<FormState>(INIT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(MOCK);
    setLoading(false);
  }, []);

  const filtered = items.filter(p => !search || p.nom.toLowerCase().includes(search.toLowerCase()) || p.pays.toLowerCase().includes(search.toLowerCase()));

  function setField(k: keyof FormState, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function openCreate() { setEditTarget(null); setForm(INIT); setError(''); setModalOpen(true); }
  function openEdit(p: Partenaire) { setEditTarget(p); setForm({ nom: p.nom, type: p.type, pays: p.pays, contact: p.contact, email: p.email }); setError(''); setModalOpen(true); }

  async function handleSave() {
    setSaving(true); setError('');
    try {
      if (editTarget) { const r = await api.put<Partenaire>(`/financements/partenaires/${editTarget.id}`, form); setItems(p => p.map(x => x.id === editTarget.id ? r : x)); }
      else { const r = await api.post<Partenaire>('/financements/partenaires', form); setItems(p => [r, ...p]); }
      setModalOpen(false);
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Erreur'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await api.delete(`/financements/partenaires/${deleteTarget.id}`);
    setItems(p => p.filter(x => x.id !== deleteTarget.id)); setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      <PageHeader title="Partenaires financiers" subtitle={`${filtered.length} partenaire${filtered.length > 1 ? 's' : ''}`}
        actions={<Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Nouveau partenaire</Button>} />

      <Input icon={<Search size={15} />} value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher..." className="max-w-sm" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-36" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f5ee' }}>
                    <Building2 size={18} style={{ color: '#1a7a3c' }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{p.nom}</p>
                    <p className="text-xs text-gray-400">{p.pays}</p>
                  </div>
                </div>
                <Badge label={p.type} variant={TYPE_VARIANT[p.type] ?? 'blue'} dot={false} />
              </div>
              {p.contact && <p className="text-xs text-gray-500 mb-1">👤 {p.contact}</p>}
              {p.email && <p className="text-xs text-gray-500 mb-3">✉️ {p.email}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{p.projets_count} projet{p.projets_count > 1 ? 's' : ''}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center"><Pencil size={13} style={{ color: '#1a7a3c' }} /></button>
                  <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 size={13} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editTarget ? 'Modifier le partenaire' : 'Nouveau partenaire'}
        footer={<div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>{editTarget ? 'Enregistrer' : 'Créer'}</Button>
        </div>}>
        <div className="space-y-4">
          {error && <div className="px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>}
          <Input label="Nom *" value={form.nom} onChange={e => setField('nom', e.target.value)} required placeholder="ex: Banque Mondiale" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={form.type} onChange={e => setField('type', e.target.value)} options={TYPE_OPTS} />
            <Input label="Pays *" value={form.pays} onChange={e => setField('pays', e.target.value)} required placeholder="ex: USA" />
          </div>
          <Input label="Contact" value={form.contact} onChange={e => setField('contact', e.target.value)} placeholder="Nom du contact" />
          <Input label="Email" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="contact@org.ci" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Supprimer ce partenaire ?" description={deleteTarget ? `${deleteTarget.nom} — cette action est irréversible.` : ''} />
    </div>
  );
}