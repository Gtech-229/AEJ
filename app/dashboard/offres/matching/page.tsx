'use client';
import { useEffect, useState } from 'react';
import { Search, Zap, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

interface Match {
    id: number;
    stagiaire: string;
    stagiaire_domaine: string;
    offre: string;
    entreprise: string;
    score: number;
    statut: 'suggere' | 'accepte' | 'refuse';
}

const MOCK: Match[] = [
    { id: 1, stagiaire: 'Aminata Koné', stagiaire_domaine: 'IT', offre: 'Développeur Frontend React', entreprise: 'CADO Technologies', score: 94, statut: 'suggere' },
    { id: 2, stagiaire: 'Moussa Diallo', stagiaire_domaine: 'Finance', offre: 'Assistant comptable', entreprise: 'SGCI', score: 88, statut: 'accepte' },
    { id: 3, stagiaire: 'Fatoumata Touré', stagiaire_domaine: 'IT', offre: 'Développeur mobile Flutter', entreprise: 'DL Consulting', score: 82, statut: 'suggere' },
    { id: 4, stagiaire: 'Ibrahim Traoré', stagiaire_domaine: 'Finance', offre: 'Chargé de clientèle', entreprise: 'NSIA Banque', score: 76, statut: 'suggere' },
    { id: 5, stagiaire: 'Kadiatou Sylla', stagiaire_domaine: 'Télécoms', offre: 'Technicien réseau', entreprise: 'MTN CI', score: 91, statut: 'accepte' },
    { id: 6, stagiaire: 'Youssouf Ouattara', stagiaire_domaine: 'IT', offre: 'Ingénieur DevOps', entreprise: 'CADO Technologies', score: 68, statut: 'refuse' },
    { id: 7, stagiaire: 'Mariam Coulibaly', stagiaire_domaine: 'Marketing', offre: 'Chargé communication', entreprise: 'Orange CI', score: 85, statut: 'suggere' },
];

function ScoreBar({ score }: { score: number }) {
    const color = score >= 90 ? '#1a7a3c' : score >= 75 ? '#f97316' : '#ef4444';
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-bold" style={{ color }}>{score}%</span>
        </div>
    );
}

export default function MatchingPage() {
    const [items, setItems] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'tous' | 'suggere' | 'accepte' | 'refuse'>('tous');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const filtered = items.filter(m => {
        const q = search.toLowerCase();
        return (!q || m.stagiaire.toLowerCase().includes(q) || m.offre.toLowerCase().includes(q) || m.entreprise.toLowerCase().includes(q))
            && (filter === 'tous' || m.statut === filter);
    });

    async function genererMatching() {
        setGenerating(true);
        try {
            const res = await api.post<Match[]>('/offres/matching/generer');
            setItems(res.data);
        } catch {
            // En dev : simuler
            await new Promise(r => setTimeout(r, 1500));
        } finally {
            setGenerating(false);
        }
    }

    async function updateStatut(id: number, statut: 'accepte' | 'refuse') {
        setItems(p => p.map(m => m.id === id ? { ...m, statut } : m));
        try { await api.patch(`/offres/matching/${id}`, { statut }); } catch { }
    }

    const stats = {
        total: items.length,
        acceptes: items.filter(m => m.statut === 'accepte').length,
        suggeres: items.filter(m => m.statut === 'suggere').length,
        refuses: items.filter(m => m.statut === 'refuse').length,
    };

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Matching Stagiaires / Offres</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Suggestions automatiques basées sur les profils et les offres</p>
                </div>
                <button onClick={genererMatching} disabled={generating}
                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 transition-all"
                    style={{ backgroundColor: '#1a7a3c' }}>
                    {generating
                        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <Zap size={16} />}
                    {generating ? 'Génération...' : 'Générer le matching'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total suggestions', val: stats.total, color: '#1a7a3c' },
                    { label: 'Suggérés', val: stats.suggeres, color: '#3b82f6' },
                    { label: 'Acceptés', val: stats.acceptes, color: '#10b981' },
                    { label: 'Refusés', val: stats.refuses, color: '#ef4444' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
                        <p className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Stagiaire, offre, entreprise..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="flex gap-2">
                    {(['tous', 'suggere', 'accepte', 'refuse'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ backgroundColor: filter === f ? '#1a7a3c' : '#f3f4f6', color: filter === f ? 'white' : '#6b7280' }}>
                            {f === 'tous' ? 'Tous' : f === 'suggere' ? 'Suggérés' : f === 'accepte' ? 'Acceptés' : 'Refusés'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chargement...</div> : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {['Stagiaire', 'Domaine', 'Offre', 'Entreprise', 'Score', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(m => (
                                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">{m.stagiaire}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">{m.stagiaire_domaine}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[180px] truncate">{m.offre}</td>
                                    <td className="px-4 py-3.5 text-sm text-gray-500">{m.entreprise}</td>
                                    <td className="px-4 py-3.5"><ScoreBar score={m.score} /></td>
                                    <td className="px-4 py-3.5">
                                        {m.statut === 'suggere' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">Suggéré</span>}
                                        {m.statut === 'accepte' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">Accepté</span>}
                                        {m.statut === 'refuse' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-500">Refusé</span>}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {m.statut === 'suggere' && (
                                            <div className="flex gap-1">
                                                <button onClick={() => updateStatut(m.id, 'accepte')}
                                                    className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center" title="Accepter">
                                                    <CheckCircle size={15} className="text-green-600" />
                                                </button>
                                                <button onClick={() => updateStatut(m.id, 'refuse')}
                                                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center" title="Refuser">
                                                    <XCircle size={15} className="text-red-400" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}