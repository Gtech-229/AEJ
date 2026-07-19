'use client';
import { useState } from 'react';
import { Download, FileText, BarChart2, Users, Wallet, Calendar } from 'lucide-react';
import { apiDownload } from '@/lib/api/client';
import { PageHeader } from '@/components/UI/PageHeader';
import { Input } from '@/components/UI/Input';

const RAPPORTS = [
    { id: 'stagiaires', titre: 'Rapport stagiaires', desc: 'Liste complète avec statuts, entreprises et dates', icon: Users, formats: ['PDF', 'Excel'], endpoint: '/rapports/stagiaires' },
    { id: 'financements', titre: 'Rapport financements', desc: 'Récapitulatif projets financés, montants, avancement', icon: Wallet, formats: ['PDF', 'Excel'], endpoint: '/rapports/financements' },
    { id: 'emplois', titre: 'Rapport emplois obtenus', desc: 'Analyse des insertions professionnelles par secteur', icon: BarChart2, formats: ['PDF'], endpoint: '/rapports/emplois' },
    { id: 'partenaires', titre: 'Rapport partenaires', desc: 'Liste des entreprises et partenaires financiers', icon: FileText, formats: ['PDF', 'Excel'], endpoint: '/rapports/partenaires' },
    { id: 'mensuel', titre: 'Rapport mensuel', desc: 'Synthèse mensuelle de toutes les activités', icon: Calendar, formats: ['PDF'], endpoint: '/rapports/mensuel' },
    { id: 'annuel', titre: 'Rapport annuel', desc: 'Bilan annuel complet du Programme Social', icon: BarChart2, formats: ['PDF'], endpoint: '/rapports/annuel' },
];

export default function RapportsPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [dates, setDates] = useState<Record<string, { debut: string; fin: string }>>({});

    function getDate(id: string) { return dates[id] ?? { debut: '', fin: '' }; }
    function setDate(id: string, k: 'debut' | 'fin', v: string) { setDates(d => ({ ...d, [id]: { ...getDate(id), [k]: v } })); }

    async function download(r: typeof RAPPORTS[0], fmt: string) {
        const key = `${r.id}-${fmt}`; setLoading(key); setSuccess(null);
        try {
            const d = getDate(r.id);
            const query = new URLSearchParams({ format: fmt, date_debut: d.debut, date_fin: d.fin }).toString();
            const blob = await apiDownload(`${r.endpoint}?${query}`);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `${r.id}_${new Date().toISOString().slice(0, 10)}.${fmt.toLowerCase()}`; a.click();
            URL.revokeObjectURL(url); setSuccess(key); setTimeout(() => setSuccess(null), 3000);
        } catch { setSuccess(key); setTimeout(() => setSuccess(null), 3000); }
        finally { setLoading(null); }
    }

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <PageHeader title="Rapports" subtitle="Générez et téléchargez les rapports du programme" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {RAPPORTS.map(r => {
                    const Icon = r.icon;
                    const d = getDate(r.id);
                    return (
                        <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#e8f5ee' }}>
                                    <Icon size={18} style={{ color: '#1a7a3c' }} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{r.titre}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{r.desc}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <Input label="Début" type="date" value={d.debut} onChange={e => setDate(r.id, 'debut', e.target.value)} className="text-xs" />
                                <Input label="Fin" type="date" value={d.fin} onChange={e => setDate(r.id, 'fin', e.target.value)} className="text-xs" />
                            </div>
                            <div className="flex gap-2">
                                {r.formats.map(fmt => {
                                    const key = `${r.id}-${fmt}`;
                                    const isLoading = loading === key; const isDone = success === key;
                                    return (
                                        <button key={fmt} onClick={() => download(r, fmt)} disabled={!!loading}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 ${isDone ? 'text-white' : fmt === 'PDF' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                            style={isDone ? { backgroundColor: '#1a7a3c' } : undefined}>
                                            {isLoading ? <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" /> : <Download size={12} />}
                                            {isDone ? 'Téléchargé !' : fmt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}