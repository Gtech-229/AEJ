'use client';
import { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api/client';

export default function MotDePassePage() {
    const [form, setForm] = useState({ current: '', new: '', confirm: '' });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const toggleShow = (k: string) => setShow(s => ({ ...s, [k]: !s[k as keyof typeof s] }));

    async function submit(e: React.FormEvent) {
        e.preventDefault(); setError(''); setSuccess(false);
        if (form.new !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return; }
        if (form.new.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return; }
        setSaving(true);
        try {
            await apiClient.post('/auth/change-password', { current_password: form.current, new_password: form.new, new_password_confirmation: form.confirm });
            setSuccess(true);
            setForm({ current: '', new: '', confirm: '' });
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) { setError(err instanceof ApiError ? err.message : 'Erreur lors du changement de mot de passe'); }
        finally { setSaving(false); }
    }

    const fields = [
        { k: 'current', label: 'Mot de passe actuel' },
        { k: 'new', label: 'Nouveau mot de passe' },
        { k: 'confirm', label: 'Confirmer le nouveau mot de passe' },
    ];

    return (
        <div className="max-w-lg space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h1>
                <p className="text-sm text-gray-400 mt-0.5">Sécurisez votre compte avec un mot de passe fort</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
                {error && <div className="mb-4 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>}
                {success && (
                    <div className="mb-4 px-4 py-3 bg-green-50 rounded-xl text-sm text-green-700 flex items-center gap-2">
                        <Check size={14} />Mot de passe changé avec succès
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    {fields.map(({ k, label }) => (
                        <div key={k}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                            <div className="relative">
                                <input
                                    type={show[k as keyof typeof show] ? 'text' : 'password'}
                                    value={form[k as keyof typeof form]}
                                    onChange={e => set(k, e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => toggleShow(k)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {show[k as keyof typeof show] ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
                        <p className="font-medium text-gray-700 mb-1">Critères de sécurité :</p>
                        <p className={form.new.length >= 8 ? 'text-green-600' : ''}>✓ Au moins 8 caractères</p>
                        <p className={/[A-Z]/.test(form.new) ? 'text-green-600' : ''}>✓ Une lettre majuscule</p>
                        <p className={/[0-9]/.test(form.new) ? 'text-green-600' : ''}>✓ Un chiffre</p>
                    </div>

                    <button type="submit" disabled={saving}
                        className="w-full py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#1a7a3c' }}>
                        {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                        Changer le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
}