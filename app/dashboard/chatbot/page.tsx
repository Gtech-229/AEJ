'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from '@/lib/api/client';
import { PageHeader } from '@/components/legacy-ui/PageHeader';

interface Message { id: number; role: 'user' | 'assistant'; content: string; time: string; }

const SUGGESTIONS = [
    'Combien de jeunes sont en stage ?',
    'Liste les entreprises Télécommunications',
    'Résume les financements en cours',
    'Quels partenaires bancaires avons-nous ?',
];

let seq = 1;
const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    async function send(text: string) {
        if (!text.trim() || loading) return;
        setMessages(p => [...p, { id: seq++, role: 'user', content: text, time: now() }]);
        setInput(''); setLoading(true);
        try {
            const res = await api.post<{ response: string }>('/chatbot', { message: text });
            setMessages(p => [...p, { id: seq++, role: 'assistant', content: res.response, time: now() }]);
        } catch {
            setMessages(p => [...p, { id: seq++, role: 'assistant', content: "Désolé, je n'ai pas pu traiter votre demande.", time: now() }]);
        } finally { setLoading(false); }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1a7a3c' }}>
                    <Sparkles size={18} className="text-white" />
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm">Assistant IA</p>
                    <p className="text-xs text-gray-400">Posez vos questions sur les données du programme</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-xs font-medium" style={{ color: '#1a7a3c' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#1a7a3c' }} />En ligne
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-2">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center pb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#e8f5ee' }}>
                            <Bot size={32} style={{ color: '#1a7a3c' }} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-1">Comment puis-je vous aider ?</h2>
                        <p className="text-sm text-gray-400 mb-6">Interrogez les données du programme en langage naturel</p>
                        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Exemples :</p>
                        <div className="space-y-2 w-full max-w-md">
                            {SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => send(s)}
                                    className="w-full text-left px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 text-sm text-gray-700 hover:border-green-primary/40 transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${m.role === 'user' ? 'text-white' : 'bg-gray-100'}`}
                            style={m.role === 'user' ? { backgroundColor: '#1a7a3c' } : undefined}>
                            {m.role === 'user' ? <User size={15} className="text-white" /> : <Bot size={15} className="text-gray-500" />}
                        </div>
                        <div className={`max-w-[75%] flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'text-white rounded-tr-md' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-tl-md'}`}
                                style={m.role === 'user' ? { backgroundColor: '#1a7a3c' } : undefined}>
                                {m.content}
                            </div>
                            <span className="text-xs text-gray-400 px-1">{m.time}</span>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-1"><Bot size={15} className="text-gray-500" /></div>
                        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                            <div className="flex gap-1 items-center h-4">
                                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-3 mt-3 flex items-center gap-3">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                    placeholder="Écrivez votre question..." disabled={loading}
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50" />
                <button onClick={() => send(input)} disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                    style={{ backgroundColor: '#1a7a3c' }}>
                    <Send size={16} className="text-white" />
                </button>
            </div>
        </div>
    );
}