'use client';
import { useEffect, useState } from 'react';
import { UserCheck, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

interface DashboardEntreprise {
    total_embauches: number;
    embauches_ce_mois: number;
    contrats_actifs: number;
    fin_contrats_proches: number;
}

const MOCK = { total_embauches: 12, embauches_ce_mois: 3, contrats_actifs: 9, fin_contrats_proches: 2 };

export default function EntrepriseDashboard() {
    const [data, setData] = useState(MOCK);

    useEffect(() => {
        api.get('/entreprise/dashboard').then(r => setData(r.data)).catch(() => { });
    }, []);

    const kpis = [
        { label: 'Total embauches déclarées', val: data.total_embauches, icon: UserCheck, color: '#1a7a3c' },
        { label: 'Embauches ce mois', val: data.embauches_ce_mois, icon: TrendingUp, color: '#3b82f6' },
        { label: 'Contrats actifs', val: data.contrats_actifs, icon: CheckCircle, color: '#10b981' },
        { label: 'Fin de contrat proches', val: data.fin_contrats_proches, icon: Clock, color: '#f97316' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-sm text-gray-400 mt-0.5">Suivi des embauches déclarées</p>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map(k => {
                    const Icon = k.icon;
                    return (
                        <div key={k.label} className="bg-white rounded-2xl p-5 shadow-sm">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: k.color + '15' }}>
                                <Icon size={18} style={{ color: k.color }} />
                            </div>
                            <p className="text-3xl font-bold" style={{ color: k.color }}>{k.val}</p>
                            <p className="text-sm text-gray-500 mt-1">{k.label}</p>
                        </div>
                    );
                })}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-3">Prochaine action recommandée</h2>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#e8f5ee' }}>
                    <UserCheck size={20} style={{ color: '#1a7a3c' }} />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Déclarez vos nouvelles embauches</p>
                        <p className="text-xs text-gray-500 mt-0.5">Aidez l'AEJ à mesurer l'impact du programme sur l'insertion des jeunes</p>
                    </div>
                    <a href="/entreprise/embauches"
                        className="ml-auto px-4 py-2 text-white text-sm font-semibold rounded-xl"
                        style={{ backgroundColor: '#1a7a3c' }}>
                        Déclarer
                    </a>
                </div>
            </div>
        </div>
    );
}