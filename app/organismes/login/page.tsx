'use client';

import { Suspense, useState } from 'react';
import { Landmark, Construction } from 'lucide-react';
import { SPACES } from '@/features/auth/auth.spaces';
import { getApiErrorMessage } from '@/lib/api/errors';
import { useLogin } from '@/features/auth/auth.hooks';

function OrganismeLoginPageContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin('organismes');
    const { authLive, label } = SPACES.organismes;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        login.mutate({ email, mot_de_passe: password });
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}
        >
            <div className="w-full max-w-md mx-4">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-8 py-8 text-center" style={{ backgroundColor: '#1a7a3c' }}>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Landmark size={28} className="text-white" />
                        </div>
                        <p className="text-white font-bold text-xl">Espace Organismes</p>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Agence Emploi Jeunes — PA-PS Gouv
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <h1 className="text-lg font-bold text-gray-800 mb-6">Connexion</h1>

                        {!authLive && (
                            <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl text-xs text-amber-800" style={{ backgroundColor: '#fffbeb' }}>
                                <Construction size={15} className="shrink-0 mt-0.5" />
                                <span>Cet espace est en aperçu — l'authentification réelle n'est pas encore branchée côté serveur pour {label}.</span>
                            </div>
                        )}

                        {login.isError && (
                            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600" style={{ backgroundColor: '#fef2f2' }}>
                                {getApiErrorMessage(login.error, 'Identifiants incorrects')}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                                    placeholder="contact@organisme.ci"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={login.isPending}
                                className="w-full py-3 text-white font-semibold rounded-xl disabled:opacity-60"
                                style={{ backgroundColor: '#1a7a3c' }}
                            >
                                {login.isPending ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrganismeLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-white">Chargement…</div>}>
            <OrganismeLoginPageContent />
        </Suspense>
    );
}