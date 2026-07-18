'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ClipboardList, Eye } from 'lucide-react';
import api from '@/lib/api';

type TypeEval = 'stagiaire' | 'entreprise' | 'formation';
type StatutForm = 'actif' | 'inactif' | 'brouillon';

interface Formulaire {
    id: number;
    titre: string;
    type: TypeEval;
    statut: StatutForm;
    questions: number;
    reponses: number;
    date_creation: string;
}

const MOCK: Formulaire[] = [
    { id: 1, titre: 'Évaluation fin de stage stagiaire', type: 'stagiaire', statut: 'actif', questions: 15, reponses: 234, date_creation: '01/01/2026' },
    { id: 2, titre: 'Évaluation entreprise partenaire', type: 'entreprise', statut: 'actif', questions: 10, reponses: 89, date_creation: '15/01/2026' },
    { id: 3, titre: 'Évaluation satisfaction formation', type: 'formation', statut: 'actif', questions: 8, reponses: 156, date_creation: '01/02/2026' },
    { id: 4, titre: 'Questionnaire bilan mi-parcours', type: 'stagiaire', statut: 'brouillon', questions: 6, reponses: 0, date_creation: '10/03/2026' },
    { id: 5, titre: 'Évaluation ancienne version', type: 'stagiaire', statut: 'inactif', questions: 12, reponses: 512, date_creation: '01/09/2025' },
];

const TYPE_CFG = {
    stagiaire: { label: 'Stagiaire', cls: 'bg-blue-50 text-blue-600' },
    entreprise: { label: 'Entreprise', cls: 'bg-purple-50 text-purple-600' },
    formation: { label: 'Formation', cls: 'bg-orange-50 text-orange-500' },
};
const STATUT_CFG = {
    actif: { label: 'Actif', cls: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    inactif: { label: 'Inactif', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
    brouillon: { label: 'Brouillon', cls: 'bg-yellow-50 text-yellow-600', dot: 'bg-yellow-400' },
};

interface FormData { titre: string; type: TypeEval; statut: StatutForm; }
const EMPTY: FormData = { titre: '', type: 'stagiaire', statut: 'brouillon' };

function Modal({ form: item, onClose, onSave }: { form?: Formulaire; onClose: () => void; onSave: (d: FormData) => Promise<void> }) {
    const [form, setForm] = useState<FormData>(item ? { titre: item.titre, type: item.type, statut: item.statut } : EMPTY);
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
                    <h2 className="text-lg font-bold text-gray-900">{item ? 'Modifier le formulaire' : 'Nouveau formulaire'}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><X size={16} className="text-gray-400" /></button>
                </div>
                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre *</label>
                        <input value={form.titre} onChange={e => set('titre', e.target.value)} required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                            placeholder="ex: Évaluation fin de stage" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                            <select value={form.type} onChange={e => set('type', e.target.value as TypeEval)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                                <option value="stagiaire">Stagiaire</option>
                                <option value="entreprise">Entreprise</option>
                                <option value="formation">Formation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
                            <select value={form.statut} onChange={e => set('statut', e.target.value as StatutForm)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                                <option value="brouillon">Brouillon</option>
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
                        <button type="submit" disabled={saving} className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: '#1a7a3c' }}>
                            {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                            {item ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function FormulaireEvalPage() {
    const [items, setItems] = useState<Formulaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState<Formulaire | undefined>();
    const [deleteItem, setDeleteItem] = useState<Formulaire | undefined>();

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    async function handleCreate(form: FormData) { const res = await api.post<Formulaire>('/evaluations/formulaires', form); setItems(p => [res.data, ...p]); }
    async function handleEdit(form: FormData) { const res = await api.put<Formulaire>(`/evaluations/formulaires/${editItem!.id}`, form); setItems(p => p.map(f => f.id === editItem!.id ? res.data : f)); }
    async function handleDelete() { await api.delete(`/evaluations/formulaires/${deleteItem!.id}`); setItems(p => p.filter(f => f.id !== deleteItem!.id)); setDeleteItem(undefined); }

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Formulaires d'évaluation</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{items.length} formulaire{items.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold" style={{ backgroundColor: '#1a7a3c' }}>
                    <Plus size={16} /> Nouveau formulaire
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-36" />) :
                    items.map(f => (
                        <div key={f.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e8f5ee' }}>
                                    <ClipboardList size={18} style={{ color: '#1a7a3c' }} />
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUT_CFG[f.statut].cls}`}>
                                    {STATUT_CFG[f.statut].label}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{f.titre}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_CFG[f.type].cls}`}>{TYPE_CFG[f.type].label}</span>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                                <span>{f.questions} questions · {f.reponses} réponses</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center"><Eye size={12} className="text-blue-400" /></button>
                                    <button onClick={() => setEditItem(f)} className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center"><Pencil size={12} style={{ color: '#1a7a3c' }} /></button>
                                    <button onClick={() => setDeleteItem(f)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 size={12} className="text-red-400" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {showCreate && <Modal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
            {editItem && <Modal form={editItem} onClose={() => setEditItem(undefined)} onSave={handleEdit} />}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                        <h3 className="text-lg font-bold mb-2">Supprimer ce formulaire ?</h3>
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