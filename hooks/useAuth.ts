'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { authHelpers } from '@/lib/auth';
import { User, AuthResponse } from '@/lib/types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

// Au chargement du composant, on vérifie s'il y a un utilisateur stocké dans localStorage. 
// Si oui, on le charge dans l'état et on considère que l'utilisateur est déjà connecté. 
// Sinon, on reste avec user à null et loading à false, ce qui signifie que l'utilisateur n'est pas connecté.
  useEffect(() => {
    const stored = authHelpers.getUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    
    // Stocker dans localStorage (pour axios) ET cookie (pour middleware)
    authHelpers.setSession(data.token, data.user);
    Cookies.set('aej_token', data.token, { expires: 7, sameSite: 'strict' });
    
    setUser(data.user);
    router.push('/dashboard');
  }, [router]);

//   Lors du logout, on tente d'informer le backend pour invalider la session côté serveur. 
//  Quoi qu'il arrive (même en cas d'erreur réseau), on nettoie la session côté client, 
//  on supprime le cookie et on redirige vers la page de login.
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // ignorer les erreurs réseau lors du logout
    } finally {
      authHelpers.clearSession();
      Cookies.remove('aej_token');
      setUser(null);
      router.push('/login');
    }
  }, [router]);

//   Cette fonction permet à l'utilisateur de changer son mot de passe. 
//  Elle envoie une requête au backend avec l'ancien mot de passe et le nouveau mot de passe (avec confirmation). 
//  Si la requête réussit, le mot de passe est changé côté serveur. 
//  En cas d'erreur (ex : ancien mot de passe incorrect), une exception est levée que le composant appelant peut gérer pour afficher un message d'erreur.
  const changePassword = useCallback(async (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) => {
    await api.post('/auth/change-password', {
      current_password,
      new_password,
      new_password_confirmation,
    });
  }, []);

  return { user, loading, login, logout, changePassword };
}