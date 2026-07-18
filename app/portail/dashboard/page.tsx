'use client';

import { Search, Settings } from 'lucide-react';

export default function TableauDeBordPortail() {
    return (
        <div>
            {/* Bandeau vert avec titre + recherche */}
            <div className="px-6 py-8" style={{ backgroundColor: '#1a7a3c' }}>
                <p className="text-white/70 text-sm mb-1">Bienvenue,</p>
                <h1 className="text-3xl font-bold text-white mb-6">Tableau de bord</h1>

                <div className="flex items-center gap-3 max-w-xl">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            placeholder="Rechercher"
                            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                    </div>
                    <button className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                        <Settings size={18} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Contenu */}
            <div className="px-6 py-6 max-w-6xl mx-auto">
                <p className="text-gray-500 text-sm">Contenu du tableau de bord portail jeunes à venir...</p>
            </div>
        </div>
    );
}
