'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ProfilInput } from './profil.schema';

/**
 * SIMULATED — intégrations API suspendues (directive équipe, en attendant
 * confirmation du backend sur le schéma de données réel).
 *
 * Point de branchement unique : remplacer le corps de `mutationFn` par un
 * vrai appel (ex: `apiClient.put(`/personnels/${user.id}`, payload)`) une
 * fois le contrat confirmé. Rien d'autre à changer dans le composant.
 */
export function useUpdateProfil() {
  return useMutation({
    mutationFn: async (payload: ProfilInput) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return payload;
    },
    onSuccess: () => {
      toast.success('Profil mis à jour (simulation — non connecté au backend)');
    },
    onError: () => {
      toast.error('Échec de la mise à jour du profil');
    },
  });
}