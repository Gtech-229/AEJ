'use client';
import { useEffect, useState } from 'react';
import { Save, RefreshCw, Eye, EyeOff, Upload, AlertTriangle, Check } from 'lucide-react';
import api from '@/lib/api/client';

// ── Types ────────────────────────────────────────────────────────────────────

interface Parametres {
    sigle_systeme: string;
    intitule_systeme: string;
    sigle_structure: string;
    intitule_structure: string;
    adresse_structure: string;
    email_structure: string;
    telephone_structure: string;
    whatsapp_structure: string;
    sigle_monnaie: string;
    sigle_devise: string;
    taux_devise: string;
    maintenance: boolean;
    delai_inactivite: string;
    nb_sessions: string;
    nb_tentatives: string;
    delai_code_tp: string;
    delai_mdp: string;
    delai_suppression: string;
    email_notifications: string;
    mdp_email_notifications: string;
    smtp_email: string;
    whatsapp_systeme: string;
    lien_api_parent: string;
}

// ── MOCK — vraies valeurs du config doc ──────────────────────────────────────

const MOCK: Parametres = {
    sigle_systeme: 'SEGAR',
    intitule_systeme: 'Suivi Evaluation Global Axé sur les Résultats',
    sigle_structure: 'CEP',
    intitule_structure: 'Cellule Exécution des Projets',
    adresse_structure: 'Kaloum Conakry',
    email_structure: 'cep@cep.net',
    telephone_structure: '',
    whatsapp_structure: '2522545522',
    sigle_monnaie: 'GNF',
    sigle_devise: 'USD',
    taux_devise: '9000',
    maintenance: false,
    delai_inactivite: '30',
    nb_sessions: '2',
    nb_tentatives: '3',
    delai_code_tp: '5',
    delai_mdp: '6',
    delai_suppression: '5',
    email_notifications: 'cep@cep.net',
    mdp_email_notifications: 'Cep@@@@@125h',
    smtp_email: '557',
    whatsapp_systeme: '2522545522',
    lien_api_parent: '',
};

// ── Sections du formulaire ───────────────────────────────────────────────────

type FieldType = 'text' | 'email' | 'password' | 'number' | 'toggle' | 'file';

interface Field {
    key: keyof Parametres;
    label: string;
    type: FieldType;
    placeholder?: string;
    hint?: string;
}

interface Section {
    titre: string;
    icon: string;
    fields: Field[];
}

const SECTIONS: Section[] = [
    {
        titre: 'Identité du système',
        icon: '🏛',
        fields: [
            { key: 'sigle_systeme', label: 'Sigle du système', type: 'text', placeholder: 'ex: SEGAR' },
            { key: 'intitule_systeme', label: 'Intitulé du système', type: 'text', placeholder: 'ex: Suivi Evaluation...' },
        ],
    },
    {
        titre: 'Identité de la structure',
        icon: '🏢',
        fields: [
            { key: 'sigle_structure', label: 'Sigle de la structure', type: 'text', placeholder: 'ex: CEP' },
            { key: 'intitule_structure', label: 'Intitulé de la structure', type: 'text', placeholder: 'ex: Cellule Exécution...' },
            { key: 'adresse_structure', label: 'Adresse sociale', type: 'text', placeholder: 'ex: Kaloum Conakry' },
            { key: 'email_structure', label: 'Email de la structure', type: 'email', placeholder: 'ex: cep@cep.net' },
            { key: 'telephone_structure', label: 'Téléphone', type: 'text', placeholder: '+224 ...' },
            { key: 'whatsapp_structure', label: 'WhatsApp de la structure', type: 'text', placeholder: '2522545522' },
        ],
    },
    {
        titre: 'Devise & monnaie',
        icon: '💰',
        fields: [
            { key: 'sigle_monnaie', label: 'Sigle monnaie du pays', type: 'text', placeholder: 'GNF' },
            { key: 'sigle_devise', label: 'Sigle devise principale', type: 'text', placeholder: 'USD' },
            { key: 'taux_devise', label: 'Taux de la devise', type: 'number', placeholder: '9000', hint: '1 USD = X GNF' },
        ],
    },
    {
        titre: 'Sécurité & sessions',
        icon: '🔒',
        fields: [
            { key: 'maintenance', label: 'Mise en maintenance', type: 'toggle', hint: 'Seul le super admin a accès en maintenance' },
            { key: 'delai_inactivite', label: "Délai d'inactivité (minutes)", type: 'number', placeholder: '30', hint: '0 = illimité' },
            { key: 'nb_sessions', label: 'Nombre de sessions possibles', type: 'number', placeholder: '2', hint: '0 = illimité' },
            { key: 'nb_tentatives', label: 'Tentatives de connexion', type: 'number', placeholder: '3', hint: '0 = illimité' },
            { key: 'delai_code_tp', label: 'Délai code TP (minutes)', type: 'number', placeholder: '5', hint: '0 = non exigé' },
            { key: 'delai_mdp', label: 'Délai changement mot de passe (mois)', type: 'number', placeholder: '6', hint: '0 = non exigé' },
            { key: 'delai_suppression', label: 'Délai suppression/modification (s)', type: 'number', placeholder: '5', hint: '0 = non exigé' },
        ],
    },
    {
        titre: 'Notifications email',
        icon: '📧',
        fields: [
            { key: 'email_notifications', label: 'Adresse email', type: 'email', placeholder: 'cep@cep.net' },
            { key: 'mdp_email_notifications', label: 'Mot de passe email', type: 'password', placeholder: '••••••••' },
            { key: 'smtp_email', label: 'Port SMTP', type: 'number', placeholder: '557' },
        ],
    },
    {
        titre: 'Intégrations',
        icon: '🔗',
        fields: [
            { key: 'whatsapp_systeme', label: 'Code instance WhatsApp', type: 'text', placeholder: '2522545522' },
            { key: 'lien_api_parent', label: 'Lien API système parent', type: 'text', placeholder: 'https://...' },
        ],
    },
];

// ── Composant champ ──────────────────────────────────────────────────────────

function Field({
    field,
    value,
    onChange,
}: {
    field: Field;
    value: string | boolean;
    onChange: (k: keyof Parametres, v: string | boolean) => void;
}) {
    const [show, setShow] = useState(false);

    const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 transition-all';

    if (field.type === 'toggle') {
        const checked = value as boolean;
        return (
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-700">{field.label}</p>
                    {field.hint && <p className="text-xs text-gray-400 mt-0.5">{field.hint}</p>}
                </div>
                <div
                    onClick={() => onChange(field.key, !checked)}
                    className="relative cursor-pointer w-11 h-6 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: checked ? '#1a7a3c' : '#e5e7eb' }}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'left-6' : 'left-1'}`} />
                </div>
            </div>
        );
    }

    if (field.type === 'file') {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <label className="flex items-center gap-3 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload size={15} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Choisir un fichier…</span>
                </label>
            </div>
        );
    }

    if (field.type === 'password') {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <div className="relative">
                    <input
                        type={show ? 'text' : 'password'}
                        value={value as string}
                        onChange={e => onChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${inputCls} pr-10`}
                    />
                    <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                </div>
                {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
            <input
                type={field.type}
                value={value as string}
                onChange={e => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
            />
            {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SystemePage() {
    const [params, setParams] = useState<Parametres>(MOCK);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setParams(MOCK);
        setLoading(false);
    }, []);

    function set(k: keyof Parametres, v: string | boolean) {
        setParams(p => ({ ...p, [k]: v }));
    }

    async function handleSave() {
        setSaving(true); setError(''); setSaved(false);
        try {
            await api.put('/parametres', params);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        setParams(MOCK);
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-40" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl px-6 py-6 max-w-6xl mx-auto">

            {/* En-tête */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Paramètres système</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Variables globales de configuration — table <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">parametres_systeme</code>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <RefreshCw size={14} /> Réinitialiser
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60"
                        style={{ backgroundColor: '#1a7a3c' }}>
                        {saving
                            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : saved ? <Check size={15} /> : <Save size={15} />}
                        {saved ? 'Enregistré !' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {/* Erreur globale */}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    <AlertTriangle size={15} />{error}
                </div>
            )}

            {/* Succès */}
            {saved && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
                    <Check size={15} /> Paramètres enregistrés avec succès.
                </div>
            )}

            {/* Sections */}
            {SECTIONS.map(section => (
                <div key={section.titre} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header section */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <span className="text-xl">{section.icon}</span>
                        <h2 className="font-bold text-gray-800 text-[15px]">{section.titre}</h2>
                    </div>

                    {/* Fields */}
                    <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {section.fields.map(field => (
                            <div key={field.key}
                                className={field.type === 'toggle' ? 'md:col-span-2 bg-gray-50 rounded-xl px-4 py-3' : ''}>
                                <Field
                                    field={field}
                                    value={params[field.key]}
                                    onChange={set}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Bouton bas de page */}
            <div className="flex justify-end gap-3 pb-6">
                <button onClick={handleReset}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Réinitialiser
                </button>
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60"
                    style={{ backgroundColor: '#1a7a3c' }}>
                    {saving
                        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <Save size={15} />}
                    Enregistrer
                </button>
            </div>
        </div>
    );
}