/**
 * Micro-projet documents / pièces jointes (`/documents`). Create contract
 * verified live (2026-08): multipart with `micro_projet_id`, `type_document`,
 * and `fichier` (the uploaded file).
 *
 * TODO(backend): the allowed `type_document` values (enum/referential?), accepted
 * MIME types / max size, and the public URL to read a stored `fichier` back.
 */
export interface Document {
  id: number;
  micro_projet_id: number;
  type_document: string;
  /** Stored path (or URL) of the uploaded file. */
  fichier: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateDocumentPayload = {
  micro_projet_id: number;
  type_document: string;
  fichier: File;
};
