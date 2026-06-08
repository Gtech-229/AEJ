// // app/(auth)/login/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import Image from 'next/image';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError]       = useState('');
//   const [loading, setLoading]   = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await login(email, password);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || 'Identifiants incorrects');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a7a3c] to-[#0f5228]">
//       {/* Décor de fond */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
//         <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
//       </div>

//       <div className="relative w-full max-w-md mx-4">
//         {/* Card */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {/* Header vert */}
//           <div className="bg-[#1a7a3c] px-8 py-8 text-center">
//             <div className="flex items-center justify-center gap-3 mb-2">
//               {/* Logo texte si pas d'image */}
//               <span className="text-white font-bold text-2xl tracking-tight">
//                 Agence <span className="text-orange-400">Emploi</span> Jeunes
//               </span>
//             </div>
//             <p className="text-white/70 text-sm">Programme Social du Gouvernement</p>
//           </div>

//           {/* Formulaire */}
//           <div className="px-8 py-8">
//             <h1 className="text-xl font-bold text-gray-800 mb-6">Connexion</h1>

//             {error && (
//               <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
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
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
//                              focus:outline-none focus:ring-2 focus:ring-[#1a7a3c]/30 focus:border-[#1a7a3c]
//                              transition-all"
//                   placeholder="admin@agence.ci"
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
//                   className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
//                              focus:outline-none focus:ring-2 focus:ring-[#1a7a3c]/30 focus:border-[#1a7a3c]
//                              transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-[#1a7a3c] hover:bg-[#0f5228] text-white font-semibold
//                            rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Connexion...' : 'Se connecter'}
//               </button>
//             </form>
//           </div>
//         </div>

//         <p className="text-center text-white/50 text-xs mt-6">
//           © 2026 Agence Emploi Jeunes | Financement BAD
//         </p>
//       </div>
//     </div>
//   );
// }