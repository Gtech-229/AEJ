import { User } from './types';

const TOKEN_KEY = 'aej_token';
const USER_KEY  = 'aej_user';

// Ce module centralise la gestion de l'authentification côté client. 
// Il fournit des fonctions pour stocker et récupérer le token JWT et les informations utilisateur dans localStorage, 
// ainsi que pour vérifier si l'utilisateur est authentifié ou pour nettoyer la session lors du logout.
export const authHelpers = {
  setSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};