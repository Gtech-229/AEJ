'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateDocumentPayload } from './documents.dto';
import { documentsKeys } from './documents.keys';
import { documentsService } from './documents.service';

export function useDocuments() {
  return useQuery({
    queryKey: documentsKeys.lists(),
    queryFn: () => documentsService.getAll(),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => documentsService.create(payload),
    onSuccess: () => {
      toast.success('Document joint');
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
    },
    onError: () => toast.error("Échec de l'envoi du document"),
  });
}
