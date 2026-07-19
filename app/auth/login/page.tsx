// 'use client';

// import { useState } from 'react';

// export default function LoginPage() {
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError]       = useState('');
//   const [loading, setLoading]   = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Identifiants incorrects');

//       // Stocker le token
//       localStorage.setItem('aej_token', data.token);
//       localStorage.setItem('aej_user', JSON.stringify(data.user));
//       // Cookie pour le proxy
//       document.cookie = `aej_token=${data.token}; path=/; max-age=604800`;

//       window.location.href = '/dashboard/dashboard';
//     } catch (err: any) {
//       setError(err.message || 'Identifiants incorrects');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center"
//       style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}>

//       {/* Décor */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
//         <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
//       </div>

//       <div className="relative w-full max-w-md mx-4">
//         {/* Card */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

//           {/* Header */}
//           <div className="px-8 py-8 text-center" style={{ backgroundColor: '#1a7a3c' }}>
//             <span className="text-white font-bold text-2xl tracking-tight">
//               Agence <span style={{ color: '#f97316' }}>Emploi</span> Jeunes
//             </span>
//             <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
//               Programme Social du Gouvernement
//             </p>
//           </div>

//           {/* Formulaire */}
//           <div className="px-8 py-8">
//             <h1 className="text-xl font-bold text-gray-800 mb-6">Connexion</h1>

//             {error && (
//               <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600"
//                 style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Adresse email
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   placeholder="admin@agence.ci"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
//                              focus:outline-none transition-all"
//                   style={{ borderColor: email ? '#1a7a3c' : '' }}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Mot de passe
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
//                              focus:outline-none transition-all"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 text-white font-semibold rounded-xl transition-all
//                            disabled:opacity-60 disabled:cursor-not-allowed"
//                 style={{ backgroundColor: '#1a7a3c' }}
//               >
//                 {loading ? 'Connexion...' : 'Se connecter'}
//               </button>
//             </form>
//           </div>
//         </div>

//         <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
//           © 2026 Agence Emploi Jeunes | Financement BAD
//         </p>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Cookie-only login: the backend sets httpOnly cookies and `useAuth`
      // handles the redirect. While the backend is absent, `login` falls back
      // to a dev bypass so the prototype stays navigable (see hooks/useAuth.ts).
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}>

      {/* Décor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-8 py-8 text-center" style={{ backgroundColor: '#1a7a3c' }}>
            <span className="text-white font-bold text-2xl tracking-tight">
              Agence <span style={{ color: '#f97316' }}>Emploi</span> Jeunes
            </span>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Programme Social du Gouvernement
            </p>
          </div>

          {/* Formulaire */}
          <div className="px-8 py-8">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Connexion</h1>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600"
                style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@agence.ci"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none transition-all"
                  style={{ borderColor: email ? '#1a7a3c' : '' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                             focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl transition-all
                           disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1a7a3c' }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2026 Agence Emploi Jeunes | Financement BAD
        </p>
      </div>
    </div>
  );
}