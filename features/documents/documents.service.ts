import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateDocumentPayload, Document } from './documents.dto';

const BASE_URL = '/documents';

/** Responses are enveloped: { message, data: … } — methods unwrap `data`. */
export const documentsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Document[]> => {
    const res = await client.request<{ data: Document[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  /**
   * Upload a document (multipart). `request` passes a `FormData` body through
   * untouched — the browser sets the Content-Type + boundary, never set by hand.
   */
  create: async (payload: CreateDocumentPayload, client: ApiClient = apiClient): Promise<Document> => {
    const form = new FormData();
    form.append('micro_projet_id', String(payload.micro_projet_id));
    form.append('type_document', payload.type_document);
    form.append('fichier', payload.fichier);
    const res = await client.request<{ data: Document }>(BASE_URL, { method: 'POST', body: form });
    return res.data;
  },
};
