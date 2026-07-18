'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Check, AlertTriangle, UserCheck } from 'lucide-react';
import api from '@/lib/api';

type TypeContrat = 'CDI' | 'CDD' | 'Stage' | 'Freelance';
type StatutEmploi = 'active' | 'pourvue' | 'expiree';

interface OffreEmploi {
    id: number;
    titre: string;
    entreprise: string;
    secteur: string;
    ville: string;
    type_contrat: TypeContrat;
    salaire?: string;
    date_limite: string;
    statut: StatutEmploi;
    candidatures: number;
    description?: string;
}

interface FormData {
    titre: string; entreprise: string; secteur: string; ville: string;
    type_contrat: TypeContrat; salaire: string; date_limite: string;
    statut: StatutEmploi; description: string;
}

const EMPTY: FormData = {
    titre: '', entreprise: '', secteur: '', ville: '',
    type_contrat: 'CDI', salaire: '', date_limite: '', statut: 'active', description: '',
};

const MOCK: OffreEmploi[] = [
    { id: 1, titre: 'Ingénieur DevOps', entreprise: 'CADO Technologies', secteur: 'IT', ville: 'Abidjan', type_contrat: 'CDI', salaire: '800 000 FCFA', date_limite: '30/07/2026', statut: 'active', candidatures: 7 },
    { id: 2, titre: 'Chargé de clientèle', entreprise: 'NSIA Banque', secteur: 'Finance', ville: 'Abidjan', type_contrat: 'CDI', salaire: '600 000 FCFA', date_limite: '15/07/2026', statut: 'active', candidatures: 22 },
    { id: 3, titre: 'Technicien télécoms', entreprise: 'Orange CI', secteur: 'Télécoms', ville: 'Yamoussoukro', type_contrat: 'CDD', salaire: '450 000 FCFA', date_limite: '01/06/2026', statut: 'pourvue', candidatures: 18 },
    { id: 4, titre: 'Data Analyst', entreprise: 'SGCI', secteur: 'Finance', ville: 'Abidjan', type_contrat: 'CDI', salaire: '700 000 FCFA', date_limite: '31/08/2026', statut: 'active', candidatures: 4 },
    { id: 5, titre: 'Développeur Backend Node.js', entreprise: 'DL Consulting', secteur: 'IT', ville: 'Abidjan', type_contrat: 'CDI', date_limite: '15/04/2026', statut: 'expiree', candidatures: 11 },
];

const STATUT_CFG = {
    active: { label: 'Active', cls: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    pourvue: { label: 'Pourvue', cls: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    expiree: { label: 'Expirée', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

const CONTRAT_COLOR: Record<TypeContrat, string> = {
    CDI: 'bg-green-100 text-green-700', CDD: 'bg-orange-100 text-orange-600',
    Stage: 'bg-blue-100 text-blue-600', Freelance: 'bg-purple-100 text-purple-600',
};

function Modal({ offre, onClose, onSave }: { offre?: OffreEmploi; onClose: () => void; onSave: (d: FormData) => Promise<void> }) {
    const [form, setForm] = useState<FormData>(offre
        ? {
            titre: offre.titre, entreprise: offre.entreprise, secteur: offre.secteur, ville: offre.ville,
            type_contrat: offre.type_contrat, salaire: offre.salaire ?? '', date_limite: offre.date_limite,
            statut: offre.statut, description: offre.description ?? ''
        }
        : EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

    async function submit(e: React.FormEvent) {
        e.preventDefault(); setError(''); setSaving(true);
        try { await onSave(form); onClose(); }
        catch (err: any) { setError(err?.response?.data?.message ?? 'Erreur'); }
        finally { setSaving(false); }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">{offre ? "Modifier l'offre" : "Nouvelle offre d'emploi"}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><X size={16} className="text-gray-400" /></button>
                </div>
                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    {error && <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600"><AlertTriangle size={15} />{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre du poste *</label>
                        <input value={form.titre} onChange={e => set('titre', e.target.value)} required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[['entreprise', 'Entreprise *'], ['secteur', 'Secteur'], ['ville', 'Ville'], ['salaire', 'Salaire']].map(([k, l]) => (
                            <div key={k}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label>
                                <input value={form[k as keyof FormData]} onChange={e => set(k as keyof FormData, e.target.value)}
                                    required={l.includes('*')}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type contrat</label>
                            <select value={form.type_contrat} onChange={e => set('type_contrat', e.target.value as TypeContrat)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                                {(['CDI', 'CDD', 'Stage', 'Freelance'] as TypeContrat[]).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date limite</label>
                            <input type="date" value={form.date_limite} onChange={e => set('date_limite', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
                        <select value={form.statut} onChange={e => set('statut', e.target.value as StatutEmploi)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                            <option value="active">Active</option><option value="pourvue">Pourvue</option><option value="expiree">Expirée</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
                        <button type="submit" disabled={saving} className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: '#1a7a3c' }}>
                            {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                            {offre ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function OffresEmploisPage() {
    const [items, setItems] = useState<OffreEmploi[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatut, setFilter] = useState<StatutEmploi | 'tous'>('tous');
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState<OffreEmploi | undefined>();
    const [deleteItem, setDeleteItem] = useState<OffreEmploi | undefined>();

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const filtered = items.filter(o => {
        const q = search.toLowerCase();
        return (!q || o.titre.toLowerCase().includes(q) || o.entreprise.toLowerCase().includes(q))
            && (filterStatut === 'tous' || o.statut === filterStatut);
    });

    async function handleCreate(form: FormData) { const res = await api.post<OffreEmploi>('/offres/emplois', form); setItems(p => [res.data, ...p]); }
    async function handleEdit(form: FormData) { const res = await api.put<OffreEmploi>(`/offres/emplois/${editItem!.id}`, form); setItems(p => p.map(o => o.id === editItem!.id ? res.data : o)); }
    async function handleDelete() { await api.delete(`/offres/emplois/${deleteItem!.id}`); setItems(p => p.filter(o => o.id !== deleteItem!.id)); setDeleteItem(undefined); }

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Offres d'emploi</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} offre{filtered.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold" style={{ backgroundColor: '#1a7a3c' }}>
                    <Plus size={16} /> Nouvelle offre
                </button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Titre, entreprise..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="flex gap-2">
                    {(['tous', 'active', 'pourvue', 'expiree'] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)} className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ backgroundColor: filterStatut === s ? '#1a7a3c' : '#f3f4f6', color: filterStatut === s ? 'white' : '#6b7280' }}>
                            {s === 'tous' ? 'Toutes' : STATUT_CFG[s].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chargement...</div> : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {['Poste', 'Entreprise', 'Lieu', 'Contrat', 'Salaire', 'Date limite', 'Candidatures', 'Statut', ''].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e8f5ee' }}>
                                                <UserCheck size={14} style={{ color: '#1a7a3c' }} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800">{o.titre}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-600">{o.entreprise}</td>
                                    <td className="px-4 py-3.5 text-sm text-gray-500">{o.ville}</td>
                                    <td className="px-4 py-3.5"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${CONTRAT_COLOR[o.type_contrat]}`}>{o.type_contrat}</span></td>
                                    <td className="px-4 py-3.5 text-sm text-gray-500">{o.salaire ?? '—'}</td>
                                    <td className="px-4 py-3.5 text-sm text-gray-500">{o.date_limite}</td>
                                    <td className="px-4 py-3.5 text-sm font-medium text-gray-700">{o.candidatures}</td>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUT_CFG[o.statut].cls}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUT_CFG[o.statut].dot}`} />{STATUT_CFG[o.statut].label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex gap-1">
                                            <button onClick={() => setEditItem(o)} className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center"><Pencil size={13} style={{ color: '#1a7a3c' }} /></button>
                                            <button onClick={() => setDeleteItem(o)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 size={13} className="text-red-400" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCreate && <Modal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
            {editItem && <Modal offre={editItem} onClose={() => setEditItem(undefined)} onSave={handleEdit} />}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                        <h3 className="text-lg font-bold mb-2">Supprimer cette offre ?</h3>
                        <p className="text-sm text-gray-500 mb-6"><span className="font-semibold">{deleteItem.titre}</span><br />Cette action est irréversible.</p>
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