'use client';
import { useEffect, useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import api from '@/lib/api/client';
import { PageHeader } from '@/components/UI/PageHeader';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';

type TypeNotif = 'alerte' | 'info' | 'succes' | 'avertissement';
interface Notification { id: number; titre: string; message: string; type: TypeNotif; categorie: string; lue: boolean; date: string; lien?: string; }

const MOCK: Notification[] = [
    { id: 1, titre: 'Échéance en retard — Touré Fatoumata', message: 'L\'échéance ECH-2026-003 est en retard de 14 jours.', type: 'alerte', categorie: 'Échéance', lue: false, date: '27/06/2026 09:15', lien: '/dashboard/financements/echeances' },
    { id: 2, titre: 'Nouveau dossier soumis', message: 'Traoré Ibrahim a soumis le dossier DOS-2026-004 pour 700 000 FCFA.', type: 'info', categorie: 'Dossier', lue: false, date: '27/06/2026 08:30', lien: '/dashboard/financements/instruction' },
    { id: 3, titre: 'Décaissement confirmé', message: 'Le décaissement DEC-2026-001 de 2 500 000 FCFA a été confirmé.', type: 'succes', categorie: 'Décaissement', lue: false, date: '26/06/2026 16:45' },
    { id: 4, titre: 'Stage arrivant à terme', message: 'Le stage de Bamba Seydou se termine dans 7 jours.', type: 'avertissement', categorie: 'Stage', lue: true, date: '26/06/2026 10:00' },
    { id: 5, titre: 'Objectif taux insertion atteint', message: 'Le taux d\'insertion mensuel a atteint 62,4%, dépassant l\'objectif.', type: 'succes', categorie: 'Indicateur', lue: true, date: '25/06/2026 14:20' },
];

const TYPE_CFG: Record<TypeNotif, { icon: any; borderColor: string; bg: string; iconColor: string }> = {
    alerte: { icon: AlertTriangle, borderColor: '#ef4444', bg: '#fef2f2', iconColor: '#ef4444' },
    info: { icon: Info, borderColor: '#3b82f6', bg: '#eff6ff', iconColor: '#3b82f6' },
    succes: { icon: CheckCircle, borderColor: '#1a7a3c', bg: '#f0fdf4', iconColor: '#1a7a3c' },
    avertissement: { icon: AlertTriangle, borderColor: '#f97316', bg: '#fff7ed', iconColor: '#f97316' },
};

export default function NotificationsPage() {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'tous' | 'lues' | 'non_lues'>('tous');

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const nonLues = items.filter(n => !n.lue).length;
    const filtered = items.filter(n => filter === 'tous' || (filter === 'lues' && n.lue) || (filter === 'non_lues' && !n.lue));

    async function marquerLue(id: number) { setItems(p => p.map(n => n.id === id ? { ...n, lue: true } : n)); try { await api.patch(`/notifications/${id}`, { lue: true }); } catch { } }
    async function toutLire() { setItems(p => p.map(n => ({ ...n, lue: true }))); try { await api.post('/notifications/tout-lire'); } catch { } }
    async function supprimer(id: number) { setItems(p => p.filter(n => n.id !== id)); try { await api.delete(`/notifications/${id}`); } catch { } }

    return (
        <div className="space-y-6 max-w-3xl mx-auto px-6 py-6">
            <PageHeader title="Notifications" subtitle={`${nonLues} non lue${nonLues > 1 ? 's' : ''} · ${items.length} au total`}
                actions={nonLues > 0 ? <Button variant="secondary" icon={<Check size={14} />} onClick={toutLire}>Tout marquer comme lu</Button> : undefined} />

            <div className="flex gap-2">
                {(['tous', 'non_lues', 'lues'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ backgroundColor: filter === f ? '#1a7a3c' : '#f3f4f6', color: filter === f ? 'white' : '#6b7280' }}>
                        {f === 'tous' ? 'Toutes' : f === 'non_lues' ? 'Non lues' : 'Lues'}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-20" />) :
                    filtered.map(n => {
                        const cfg = TYPE_CFG[n.type]; const Icon = cfg.icon;
                        return (
                            <div key={n.id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${!n.lue ? 'ring-1 ring-blue-100' : ''}`}
                                style={{ borderLeftColor: cfg.borderColor }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: cfg.bg }}>
                                        <Icon size={16} style={{ color: cfg.iconColor }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className={`text-sm font-bold ${!n.lue ? 'text-gray-900' : 'text-gray-700'}`}>{n.titre}</p>
                                                    {!n.lue && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                                                    <Badge label={n.categorie} variant="gray" dot={false} />
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                                                <p className="text-xs text-gray-300 mt-1.5">{n.date}</p>
                                                {n.lien && <a href={n.lien} className="text-xs font-semibold mt-2 inline-block" style={{ color: '#1a7a3c' }}>Voir le détail →</a>}
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                {!n.lue && <button onClick={() => marquerLue(n.id)} className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center"><Check size={12} style={{ color: '#1a7a3c' }} /></button>}
                                                <button onClick={() => supprimer(n.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 size={12} className="text-red-400" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                {filtered.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Bell size={40} className="text-gray-200 mb-3" />
                        <p className="text-sm">Aucune notification</p>
                    </div>
                )}
            </div>
        </div>
    );
}