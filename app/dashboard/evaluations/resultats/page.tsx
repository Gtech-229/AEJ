'use client';
import { useEffect, useState } from 'react';
import { Search, Download, Star } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import api from '@/lib/api';

interface Resultat {
    id: number;
    formulaire: string;
    repondant: string;
    type: string;
    note_globale: number;
    date: string;
    notes: { critere: string; note: number }[];
}

const MOCK: Resultat[] = [
    { id: 1, formulaire: 'Évaluation fin de stage', repondant: 'Aminata Koné', type: 'Stagiaire', note_globale: 4.2, date: '15/03/2026', notes: [{ critere: 'Intégration', note: 4 }, { critere: 'Compétences', note: 4.5 }, { critere: 'Ponctualité', note: 4 }, { critere: 'Initiative', note: 4.5 }] },
    { id: 2, formulaire: 'Évaluation fin de stage', repondant: 'Moussa Diallo', type: 'Stagiaire', note_globale: 3.8, date: '12/03/2026', notes: [{ critere: 'Intégration', note: 4 }, { critere: 'Compétences', note: 3.5 }, { critere: 'Ponctualité', note: 4 }, { critere: 'Initiative', note: 3.5 }] },
    { id: 3, formulaire: 'Évaluation entreprise', repondant: 'Orange CI', type: 'Entreprise', note_globale: 4.5, date: '10/03/2026', notes: [{ critere: 'Accueil', note: 5 }, { critere: 'Encadrement', note: 4 }, { critere: 'Opportunités', note: 4.5 }, { critere: 'Satisfaction', note: 4.5 }] },
    { id: 4, formulaire: 'Évaluation fin de stage', repondant: 'Fatoumata Touré', type: 'Stagiaire', note_globale: 4.7, date: '08/03/2026', notes: [{ critere: 'Intégration', note: 5 }, { critere: 'Compétences', note: 4.5 }, { critere: 'Ponctualité', note: 5 }, { critere: 'Initiative', note: 4.5 }] },
];

const moyenneData = [
    { mois: 'Jan', note: 3.8 }, { mois: 'Fév', note: 4.0 }, { mois: 'Mar', note: 4.1 },
    { mois: 'Avr', note: 3.9 }, { mois: 'Mai', note: 4.3 }, { mois: 'Jun', note: 4.2 },
];

function Stars({ note }: { note: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={13}
                    fill={i <= Math.round(note) ? '#f97316' : 'none'}
                    className={i <= Math.round(note) ? 'text-orange-400' : 'text-gray-200'} />
            ))}
            <span className="text-xs font-bold text-gray-700 ml-1">{note.toFixed(1)}</span>
        </div>
    );
}

export default function ResultatsPage() {
    const [items, setItems] = useState<Resultat[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Resultat | undefined>();

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const filtered = items.filter(r =>
        !search ||
        r.repondant.toLowerCase().includes(search.toLowerCase()) ||
        r.formulaire.toLowerCase().includes(search.toLowerCase())
    );

    const moyenne = items.length
        ? (items.reduce((s, r) => s + r.note_globale, 0) / items.length).toFixed(1)
        : '—';

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">

            {/* En-tête */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Résultats des évaluations</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {items.length} réponse{items.length > 1 ? 's' : ''} · Moyenne : {moyenne}/5
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <Download size={15} /> Exporter
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Note moyenne', val: `${moyenne}/5`, color: '#1a7a3c' },
                    { label: 'Réponses totales', val: items.length, color: '#3b82f6' },
                    { label: 'Stagiaires évalués', val: items.filter(r => r.type === 'Stagiaire').length, color: '#f97316' },
                    { label: 'Entreprises évaluées', val: items.filter(r => r.type === 'Entreprise').length, color: '#8b5cf6' },
                ].map(k => (
                    <div key={k.label} className="bg-white rounded-2xl p-4 shadow-sm">
                        <p className="text-2xl font-bold" style={{ color: k.color }}>{k.val}</p>
                        <p className="text-xs text-gray-500 mt-1">{k.label}</p>
                    </div>
                ))}
            </div>

            {/* Graphique évolution */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Évolution de la satisfaction</h3>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={moyenneData} barSize={28}>
                        <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        {/* ── Correction : cast explicite pour éviter l'erreur ValueType|undefined ── */}
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}/5`, 'Note moyenne']} />
                        <Bar dataKey="note" fill="#1a7a3c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recherche + Tableau + Détail */}
            <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>

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
                                        {['Répondant', 'Formulaire', 'Type', 'Note globale', 'Date'].map(h => (
                                            <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(r => (
                                        <tr key={r.id} onClick={() => setSelected(r)}
                                            className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer
                        ${selected?.id === r.id ? 'bg-green-50/50' : ''}`}>
                                            <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">{r.repondant}</td>
                                            <td className="px-4 py-3.5 text-sm text-gray-600">{r.formulaire}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                                    {r.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5"><Stars note={r.note_globale} /></td>
                                            <td className="px-4 py-3.5 text-sm text-gray-500">{r.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Panneau détail */}
                {selected && (
                    <div className="w-72 bg-white rounded-2xl shadow-sm p-5 shrink-0">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="font-bold text-gray-900">{selected.repondant}</h3>
                            <button onClick={() => setSelected(undefined)}
                                className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{selected.formulaire} · {selected.date}</p>
                        <Stars note={selected.note_globale} />
                        <div className="mt-4 space-y-3">
                            {selected.notes.map(n => (
                                <div key={n.critere}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600">{n.critere}</span>
                                        <span className="font-bold text-gray-800">{n.note}/5</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${n.note * 20}%`, backgroundColor: '#1a7a3c' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}