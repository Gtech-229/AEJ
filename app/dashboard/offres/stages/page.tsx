'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Check, AlertTriangle, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import api from '@/lib/api/client';

type StatutOffre = 'active' | 'pourvue' | 'expiree';

interface OffreStage {
    id: number;
    titre: string;
    entreprise: string;
    secteur: string;
    ville: string;
    duree: string;
    date_limite: string;
    statut: StatutOffre;
    candidatures: number;
    description?: string;
}

interface FormData {
    titre: string; entreprise: string; secteur: string; ville: string;
    duree: string; date_limite: string; statut: StatutOffre; description: string;
}

const EMPTY: FormData = {
    titre: '', entreprise: '', secteur: '', ville: '',
    duree: '', date_limite: '', statut: 'active', description: '',
};

const MOCK: OffreStage[] = [
    { id: 1, titre: 'Développeur Frontend React', entreprise: 'CADO Technologies', secteur: 'IT', ville: 'Abidjan', duree: '6 mois', date_limite: '30/06/2026', statut: 'active', candidatures: 12 },
    { id: 2, titre: 'Chargé de communication digitale', entreprise: 'Orange CI', secteur: 'Télécoms', ville: 'Abidjan', duree: '3 mois', date_limite: '15/06/2026', statut: 'active', candidatures: 8 },
    { id: 3, titre: 'Assistant comptable', entreprise: 'SGCI', secteur: 'Finance', ville: 'Abidjan', duree: '6 mois', date_limite: '01/05/2026', statut: 'pourvue', candidatures: 20 },
    { id: 4, titre: 'Technicien réseau', entreprise: 'MTN CI', secteur: 'Télécoms', ville: 'Bouaké', duree: '4 mois', date_limite: '20/07/2026', statut: 'active', candidatures: 5 },
    { id: 5, titre: 'Assistant RH', entreprise: 'NSIA Banque', secteur: 'Finance', ville: 'Abidjan', duree: '6 mois', date_limite: '10/04/2026', statut: 'expiree', candidatures: 15 },
    { id: 6, titre: 'Développeur mobile Flutter', entreprise: 'DL Consulting', secteur: 'IT', ville: 'Abidjan', duree: '6 mois', date_limite: '31/07/2026', statut: 'active', candidatures: 3 },
];

const STATUT_CFG = {
    active: { label: 'Active', cls: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    pourvue: { label: 'Pourvue', cls: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    expiree: { label: 'Expirée', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

function Badge({ statut }: { statut: StatutOffre }) {
    const c = STATUT_CFG[statut];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function Modal({ offre, onClose, onSave }: { offre?: OffreStage; onClose: () => void; onSave: (d: FormData) => Promise<void> }) {
    const [form, setForm] = useState<FormData>(offre
        ? {
            titre: offre.titre, entreprise: offre.entreprise, secteur: offre.secteur, ville: offre.ville,
            duree: offre.duree, date_limite: offre.date_limite, statut: offre.statut, description: offre.description ?? ''
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
                    <h2 className="text-lg font-bold text-gray-900">{offre ? 'Modifier l\'offre' : 'Nouvelle offre de stage'}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>
                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    {error && <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600"><AlertTriangle size={15} />{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre du poste *</label>
                        <input value={form.titre} onChange={e => set('titre', e.target.value)} required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                            placeholder="ex: Développeur Frontend" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Entreprise *</label>
                            <input value={form.entreprise} onChange={e => set('entreprise', e.target.value)} required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Secteur</label>
                            <input value={form.secteur} onChange={e => set('secteur', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                                placeholder="IT, Finance..." />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville</label>
                            <input value={form.ville} onChange={e => set('ville', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                                placeholder="Abidjan" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Durée</label>
                            <input value={form.duree} onChange={e => set('duree', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                                placeholder="6 mois" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date limite</label>
                            <input type="date" value={form.date_limite} onChange={e => set('date_limite', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
                            <select value={form.statut} onChange={e => set('statut', e.target.value as StatutOffre)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary">
                                <option value="active">Active</option>
                                <option value="pourvue">Pourvue</option>
                                <option value="expiree">Expirée</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                            placeholder="Missions, profil recherché..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#1a7a3c' }}>
                            {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                            {offre ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const PAGE_SIZE = 6;

export default function OffresStagesPage() {
    const [items, setItems] = useState<OffreStage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatut, setFilter] = useState<StatutOffre | 'tous'>('tous');
    const [page, setPage] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState<OffreStage | undefined>();
    const [deleteItem, setDeleteItem] = useState<OffreStage | undefined>();

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const filtered = items.filter(o => {
        const q = search.toLowerCase();
        return (!q || o.titre.toLowerCase().includes(q) || o.entreprise.toLowerCase().includes(q) || o.secteur.toLowerCase().includes(q))
            && (filterStatut === 'tous' || o.statut === filterStatut);
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    async function handleCreate(form: FormData) {
        const res = await api.post<OffreStage>('/offres/stages', form);
        setItems(p => [res, ...p]);
    }
    async function handleEdit(form: FormData) {
        const res = await api.put<OffreStage>(`/offres/stages/${editItem!.id}`, form);
        setItems(p => p.map(o => o.id === editItem!.id ? res : o));
    }
    async function handleDelete() {
        await api.delete(`/offres/stages/${deleteItem!.id}`);
        setItems(p => p.filter(o => o.id !== deleteItem!.id));
        setDeleteItem(undefined);
    }

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Offres de stage</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} offre{filtered.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#1a7a3c' }}>
                    <Plus size={16} /> Nouvelle offre
                </button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                        placeholder="Titre, entreprise, secteur..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="flex gap-2">
                    {(['tous', 'active', 'pourvue', 'expiree'] as const).map(s => (
                        <button key={s} onClick={() => { setFilter(s); setPage(0); }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ backgroundColor: filterStatut === s ? '#1a7a3c' : '#f3f4f6', color: filterStatut === s ? 'white' : '#6b7280' }}>
                            {s === 'tous' ? 'Toutes' : STATUT_CFG[s].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-44" />
                )) : paginated.map(o => (
                    <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f5ee' }}>
                                    <Briefcase size={18} style={{ color: '#1a7a3c' }} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm leading-tight">{o.titre}</p>
                                    <p className="text-xs text-gray-400">{o.entreprise}</p>
                                </div>
                            </div>
                            <Badge statut={o.statut} />
                        </div>
                        <div className="space-y-1 mb-3 text-xs text-gray-500">
                            <p>📍 {o.ville} · {o.secteur}</p>
                            <p>⏱ {o.duree} · Limite : {o.date_limite}</p>
                            <p>👥 {o.candidatures} candidature{o.candidatures > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mr-3">
                                <div className="h-full rounded-full" style={{ width: `${Math.min(o.candidatures * 5, 100)}%`, backgroundColor: '#1a7a3c' }} />
                            </div>
                            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditItem(o)} className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center">
                                    <Pencil size={13} style={{ color: '#1a7a3c' }} />
                                </button>
                                <button onClick={() => setDeleteItem(o)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                                    <Trash2 size={13} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                        className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30">
                        <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setPage(i)}
                            className="w-8 h-8 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: page === i ? '#1a7a3c' : 'transparent', color: page === i ? 'white' : '#6b7280' }}>
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                        className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30">
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}

            {showCreate && <Modal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
            {editItem && <Modal offre={editItem} onClose={() => setEditItem(undefined)} onSave={handleEdit} />}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer cette offre ?</h3>
                        <p className="text-sm text-gray-500 mb-6"><span className="font-semibold">{deleteItem.titre}</span><br />Cette action est irréversible.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteItem(undefined)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}