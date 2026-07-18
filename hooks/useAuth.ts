// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import api from '@/lib/api';
// import { authHelpers } from '@/lib/auth';
// import { User, AuthResponse } from '@/lib/types';

// export function useAuth() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Vérification de la session au chargement initial (côté client uniquement)
//   useEffect(() => {
//     try {
//       const stored = authHelpers.getUser();
//       if (stored) {
//         setUser(stored);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération de l'utilisateur:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Connexion de l'utilisateur
//   const login = useCallback(async (email: string, password: string) => {
//     setLoading(true); // Optionnel: pour passer en état de chargement pendant la requête
//     try {
//       const { data } = await api.post<AuthResponse>('/auth/login', { email, password });

//       // Stockage des jetons et de l'utilisateur
//       authHelpers.setSession(data.token, data.user);
//       Cookies.set('aej_token', data.token, { expires: 7, sameSite: 'strict', secure: true });

//       setUser(data.user);
//       router.push('/dashboard');
//     } catch (error) {
//       // Gérer les erreurs de connexion 
//       throw error; 
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   // Déconnexion de l'utilisateur
//   const logout = useCallback(async () => {
//     setLoading(true);
//     try {
//       await api.post('/auth/logout');
//     } catch (_) {
//       // Même en cas d'erreur, on veut quand même nettoyer la session côté client
//     } finally {
//       authHelpers.clearSession();
//       Cookies.remove('aej_token');
//       setUser(null);
//       router.push('/login');
//       setLoading(false);
//     }
//   }, [router]);

//   // Changement de mot de passe
//   const changePassword = useCallback(async (
//     current_password: string,
//     new_password: string,
//     new_password_confirmation: string
//   ) => {
//     // 
//     await api.post('/auth/change-password', {
//       current_password,
//       new_password,
//       new_password_confirmation,
//     });
//   }, []);

//   return { user, loading, login, logout, changePassword };
// }

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const FAKE_USER = {
  id: 1,
  name: "Développeur Test",
  email: "test@emploi-jeune.ci",
  password: "password",
  role: "admin"
};

export function useAuth() {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(FAKE_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(async () => {
    Cookies.set("aej_token", "fake-token");
    setUser(FAKE_USER);
    router.push("/dashboard/dashboard");
  }, [router]);

  const logout = useCallback(async () => {
    Cookies.remove("aej_token");
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const changePassword = useCallback(async () => {
    console.log("Mot de passe changé (simulation)");
  }, []);

  return { user, loading, login, logout, changePassword };
}