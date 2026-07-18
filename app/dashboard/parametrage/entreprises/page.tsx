'use client';
import { useEffect, useState } from 'react';
import {
    Plus, Search, Pencil, Trash2, X, Check,
    AlertTriangle, MapPin, Phone, Mail, Building2,
} from 'lucide-react';
import api from '@/lib/api';

// ── Types ────────────────────────────────────────────────────────────────────

type Statut = 'actif' | 'inactif' | 'suspendu';

interface Entreprise {
    id: number;
    nom: string;
    secteur: string;
    secteur_couleur: string;
    adresse: string;
    telephone: string;
    email: string;
    responsable: string;
    statut: Statut;
    stagiaires_count: number;
    offres_count: number;
    date_adhesion: string;
}

interface FormData {
    nom: string;
    secteur: string;
    adresse: string;
    telephone: string;
    email: string;
    responsable: string;
    statut: Statut;
}

const EMPTY: FormData = {
    nom: '', secteur: '', adresse: '', telephone: '',
    email: '', responsable: '', statut: 'actif',
};

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK: Entreprise[] = [
    { id: 1, nom: 'Banque Mondiale', secteur: 'Financier', secteur_couleur: '#f59e0b', adresse: 'Plateau, Abidjan', telephone: '+225 27 20 22 40 00', email: 'bm@banquemondiale.org', responsable: 'Jean-Marc Dupont', statut: 'actif', stagiaires_count: 32, offres_count: 8, date_adhesion: '12/01/2022' },
    { id: 2, nom: "Orange Côte d'Ivoire", secteur: 'Télécommunications', secteur_couleur: '#8b5cf6', adresse: 'Marcory, Abidjan', telephone: '+225 27 21 23 00 00', email: 'contact@orange.ci', responsable: 'Awa Koné', statut: 'actif', stagiaires_count: 48, offres_count: 12, date_adhesion: '05/03/2021' },
    { id: 3, nom: "MTN Côte d'Ivoire", secteur: 'Télécommunications', secteur_couleur: '#8b5cf6', adresse: 'Cocody, Abidjan', telephone: '+225 27 22 23 23 23', email: 'info@mtn.ci', responsable: 'Seydou Diallo', statut: 'actif', stagiaires_count: 56, offres_count: 15, date_adhesion: '18/06/2021' },
    { id: 4, nom: "Nestlé Côte d'Ivoire", secteur: 'Agriculture', secteur_couleur: '#10b981', adresse: 'Zone Industrielle, Vridi', telephone: '+225 27 21 75 10 00', email: 'nestle@nestle.ci', responsable: 'Mariam Touré', statut: 'actif', stagiaires_count: 24, offres_count: 6, date_adhesion: '22/09/2020' },
    { id: 5, nom: 'Clinique Biasa', secteur: 'Santé', secteur_couleur: '#ef4444', adresse: 'Cocody 2 Plateaux', telephone: '+225 27 22 41 44 44', email: 'info@biasa.ci', responsable: 'Dr. Koné Albert', statut: 'actif', stagiaires_count: 18, offres_count: 4, date_adhesion: '03/02/2022' },
    { id: 6, nom: 'CFAO Motors', secteur: 'Commerce', secteur_couleur: '#f97316', adresse: 'Treichville, Abidjan', telephone: '+225 27 21 24 24 24', email: 'cfao@cfao.ci', responsable: 'Pierre Martin', statut: 'inactif', stagiaires_count: 10, offres_count: 2, date_adhesion: '15/11/2020' },
    { id: 7, nom: 'Société Générale CI', secteur: 'Financier', secteur_couleur: '#f59e0b', adresse: 'Plateau, Abidjan', telephone: '+225 27 20 20 12 34', email: 'sgci@sgci.ci', responsable: 'Fatou Bamba', statut: 'actif', stagiaires_count: 28, offres_count: 9, date_adhesion: '08/04/2021' },
    { id: 8, nom: 'BCEAO', secteur: 'Financier', secteur_couleur: '#f59e0b', adresse: 'Plateau, Abidjan', telephone: '+225 27 20 25 57 00', email: 'info@bceao.int', responsable: 'Moussa Traoré', statut: 'suspendu', stagiaires_count: 5, offres_count: 0, date_adhesion: '30/07/2019' },
    { id: 9, nom: 'TotalEnergies CI', secteur: 'Commerce', secteur_couleur: '#f97316', adresse: 'Zone Industrielle', telephone: '+225 27 21 75 00 75', email: 'total@totalci.ci', responsable: 'Yves Dubois', statut: 'actif', stagiaires_count: 22, offres_count: 7, date_adhesion: '14/01/2022' },
    { id: 10, nom: 'Université FHB', secteur: 'Technologies', secteur_couleur: '#3b82f6', adresse: 'Cocody, Abidjan', telephone: '+225 27 22 44 00 44', email: 'ufhb@ufhb.edu.ci', responsable: 'Pr. Aka Kouamé', statut: 'actif', stagiaires_count: 120, offres_count: 20, date_adhesion: '01/09/2020' },
];

const SECTEURS = ['Technologies', 'Télécommunications', 'Financier', 'Agriculture', 'Santé', 'Commerce', 'BTP'];

const STATUT_CFG: Record<Statut, { label: string; cls: string; dot: string }> = {
    actif: { label: 'Actif', cls: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
    inactif: { label: 'Inactif', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
    suspendu: { label: 'Suspendu', cls: 'bg-red-50 text-red-500', dot: 'bg-red-400' },
};

// ── Modal ────────────────────────────────────────────────────────────────────

function Modal({ entreprise, onClose, onSave }: {
    entreprise?: Entreprise;
    onClose: () => void;
    onSave: (d: FormData) => Promise<void>;
}) {
    const [form, setForm] = useState<FormData>(
        entreprise
            ? {
                nom: entreprise.nom, secteur: entreprise.secteur, adresse: entreprise.adresse,
                telephone: entreprise.telephone, email: entreprise.email,
                responsable: entreprise.responsable, statut: entreprise.statut
            }
            : EMPTY
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

    async function submit(e: React.FormEvent) {
        e.preventDefault(); setError(''); setSaving(true);
        try { await onSave(form); onClose(); }
        catch (err: any) { setError(err?.response?.data?.message ?? 'Erreur serveur'); }
        finally { setSaving(false); }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">
                        {entreprise ? "Modifier l'entreprise" : 'Nouvelle entreprise'}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">
                            <AlertTriangle size={15} />{error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'entreprise *</label>
                        <input value={form.nom} onChange={e => set('nom', e.target.value)} required
                            placeholder="ex: Orange Côte d'Ivoire"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Secteur *</label>
                            <select value={form.secteur} onChange={e => set('secteur', e.target.value)} required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                                <option value="">Choisir…</option>
                                {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
                            <select value={form.statut} onChange={e => set('statut', e.target.value as Statut)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                                <option value="suspendu">Suspendu</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Responsable</label>
                        <input value={form.responsable} onChange={e => set('responsable', e.target.value)}
                            placeholder="Nom du contact principal"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                placeholder="contact@entreprise.ci"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                            <input value={form.telephone} onChange={e => set('telephone', e.target.value)}
                                placeholder="+225 27 20 …"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
                        <input value={form.adresse} onChange={e => set('adresse', e.target.value)}
                            placeholder="Quartier, Ville"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Annuler
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#1a7a3c' }}>
                            {saving
                                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                : <Check size={15} />}
                            {entreprise ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EntreprisesPage() {
    const [items, setItems] = useState<Entreprise[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStat, setFilterStat] = useState<Statut | 'tous'>('tous');
    const [filterSect, setFilterSect] = useState('tous');
    const [view, setView] = useState<'table' | 'cards'>('table');
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState<Entreprise | undefined>();
    const [deleteItem, setDeleteItem] = useState<Entreprise | undefined>();

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const filtered = items.filter(e => {
        const q = search.toLowerCase();
        return (
            (!q || e.nom.toLowerCase().includes(q) || e.responsable.toLowerCase().includes(q) || e.secteur.toLowerCase().includes(q))
            && (filterStat === 'tous' || e.statut === filterStat)
            && (filterSect === 'tous' || e.secteur === filterSect)
        );
    });


    const stats = {
        total: items.length,
        actifs: items.filter(e => e.statut === 'actif').length,
        stages: items.reduce((a, e) => a + e.stagiaires_count, 0),
        offres: items.reduce((a, e) => a + e.offres_count, 0),
    };

    async function handleCreate(form: FormData) {
        try {
            const res = await api.post<Entreprise>('/entreprises', form);
            setItems(p => [res.data, ...p]);
            setShowCreate(false);
        }
        catch (error) {
            console.error(error);
        }
    }
    async function handleEdit(form: FormData) {
        try {
            if (!editItem) return;

            const res = await api.put<Entreprise>(
                `/entreprises/${editItem.id}`,
                form
            );

            setItems(prev =>
                prev.map(e =>
                    e.id === editItem.id ? res.data : e
                )
            );

            setEditItem(undefined);
        }
        catch (error) {
            console.error(error);
        }
    }
    async function handleDelete() {
        try {
            if (!deleteItem) return;
            await api.delete(`/entreprises/${deleteItem.id}`);
            setItems(p => p.filter(e => e.id !== deleteItem!.id));
            setDeleteItem(undefined);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">

            {/* En-tête */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Entreprises Partenaires</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} entreprise{filtered.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: '#1a7a3c' }}>
                    <Plus size={16} /> Nouvelle entreprise
                </button>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total entreprises', value: stats.total, icon: '🏢', color: '#1a7a3c' },
                    { label: 'Entreprises actives', value: stats.actifs, icon: '✅', color: '#2EA84F' },
                    { label: 'Total stagiaires', value: stats.stages, icon: '👤', color: '#F7941D' },
                    { label: 'Offres actives', value: stats.offres, icon: '📋', color: '#3b82f6' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ backgroundColor: s.color + '18' }}>{s.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-xs text-gray-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtres + toggle vue */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Nom, responsable, secteur…"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                </div>

                <div className="flex gap-1.5">
                    {(['tous', 'actif', 'inactif', 'suspendu'] as const).map(s => (
                        <button key={s} onClick={() => setFilterStat(s)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ backgroundColor: filterStat === s ? '#1a7a3c' : '#f3f4f6', color: filterStat === s ? 'white' : '#6b7280' }}>
                            {s === 'tous' ? 'Tous' : STATUT_CFG[s].label}
                        </button>
                    ))}
                </div>

                <select value={filterSect} onChange={e => setFilterSect(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-600 focus:outline-none">
                    <option value="tous">Tous les secteurs</option>
                    {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                    {(['table', 'cards'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                                backgroundColor: view === v ? 'white' : 'transparent',
                                color: view === v ? '#1a7a3c' : '#6b7280',
                                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            }}>
                            {v === 'table' ? '☰ Tableau' : '⊞ Cartes'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Vue Tableau ── */}
            {view === 'table' && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                            <span className="w-5 h-5 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin mr-2" />
                            Chargement…
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Entreprise', 'Secteur', 'Responsable', 'Contact', 'Stagiaires', 'Offres', 'Statut', ''].map(h => (
                                        <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            Aucune entreprise trouvée.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((e) => (
                                        <tr
                                            key={e.id}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                        style={{ backgroundColor: e.secteur_couleur }}
                                                    >
                                                        {e.nom.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                                                            {e.nom}
                                                        </p>
                                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                                            <MapPin size={10} />
                                                            {e.adresse}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <span
                                                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        backgroundColor: e.secteur_couleur + '20',
                                                        color: e.secteur_couleur,
                                                    }}
                                                >
                                                    {e.secteur}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                                                {e.responsable}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Phone size={10} />
                                                        {e.telephone}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail size={10} />
                                                        {e.email}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                                                {e.stagiaires_count}
                                            </td>

                                            <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                                                {e.offres_count}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUT_CFG[e.statut].cls}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${STATUT_CFG[e.statut].dot}`}
                                                    />
                                                    {STATUT_CFG[e.statut].label}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setEditItem(e)}
                                                        className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center"
                                                    >
                                                        <Pencil
                                                            size={13}
                                                            style={{ color: '#1a7a3c' }}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() => setDeleteItem(e)}
                                                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"
                                                    >
                                                        <Trash2
                                                            size={13}
                                                            className="text-red-400"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ── Vue Cartes ── */}
            {view === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {loading
                        ? Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-44" />)
                        : filtered.map(e => (
                            <div key={e.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                                            style={{ backgroundColor: e.secteur_couleur }}>
                                            {e.nom.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm leading-tight">{e.nom}</p>
                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 inline-block"
                                                style={{ backgroundColor: e.secteur_couleur + '20', color: e.secteur_couleur }}>
                                                {e.secteur}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_CFG[e.statut].cls}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${STATUT_CFG[e.statut].dot}`} />
                                        {STATUT_CFG[e.statut].label}
                                    </span>
                                </div>
                                <div className="space-y-1.5 mb-3">
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin size={11} />{e.adresse}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone size={11} />{e.telephone}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail size={11} />{e.email}</p>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex gap-4 text-xs text-gray-500">
                                        <span>👤 <strong className="text-gray-800">{e.stagiaires_count}</strong> stagiaires</span>
                                        <span>📋 <strong className="text-gray-800">{e.offres_count}</strong> offres</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditItem(e)} className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center">
                                            <Pencil size={12} style={{ color: '#1a7a3c' }} />
                                        </button>
                                        <button onClick={() => setDeleteItem(e)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                                            <Trash2 size={12} className="text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Modals */}
            {showCreate && <Modal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
            {editItem && <Modal entreprise={editItem} onClose={() => setEditItem(undefined)} onSave={handleEdit} />}

            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Supprimer cette entreprise ?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            <span className="font-semibold">{deleteItem.nom}</span><br />
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteItem(undefined)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                                Annuler
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}