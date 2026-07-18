'use client';
import { useState, useEffect } from 'react';
import { Check, User } from 'lucide-react';
import api from '@/lib/api';
import { authHelpers } from '@/lib/auth';

export default function ProfilPage() {
    const user = authHelpers.getUser();
    const [form, setForm] = useState({ nom: user?.name ?? '', email: user?.email ?? '' });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    async function submit(e: React.FormEvent) {
        e.preventDefault(); setError(''); setSaving(true); setSuccess(false);
        try {
            await api.put('/auth/profil', form);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) { setError(err?.response?.data?.message ?? 'Erreur'); }
        finally { setSaving(false); }
    }

    return (
        <div className="max-w-lg space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
                <p className="text-sm text-gray-400 mt-0.5">Informations de votre compte</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: '#1a7a3c' }}>
                        {form.nom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{form.nom}</p>
                        <p className="text-sm text-gray-400">{user?.role ?? 'Administrateur'}</p>
                    </div>
                </div>

                {error && <div className="mb-4 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>}
                {success && <div className="mb-4 px-4 py-3 bg-green-50 rounded-xl text-sm text-green-700 flex items-center gap-2"><Check size={14} />Profil mis à jour avec succès</div>}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                        <input value={form.nom} onChange={e => set('nom', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <button type="submit" disabled={saving}
                        className="w-full py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#1a7a3c' }}>
                        {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}