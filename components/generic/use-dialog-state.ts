'use client';

import { useState } from 'react';

export type DialogMode = 'create' | 'edit' | 'delete';

export interface DialogState<T> {
  mode: DialogMode | null;
  item: T | null;
  openCreate: () => void;
  openEdit: (item: T) => void;
  openDelete: (item: T) => void;
  close: () => void;
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
}

/**
 * Drives the add / edit / delete dialogs for a resource. One hook instance per
 * table; pass it to `GenericDialogs` and to the row-action builders.
 */
export function useDialogState<T>(): DialogState<T> {
  const [mode, setMode] = useState<DialogMode | null>(null);
  const [item, setItem] = useState<T | null>(null);

  return {
    mode,
    item,
    openCreate: () => {
      setItem(null);
      setMode('create');
    },
    openEdit: (next: T) => {
      setItem(next);
      setMode('edit');
    },
    openDelete: (next: T) => {
      setItem(next);
      setMode('delete');
    },
    close: () => {
      setMode(null);
      setItem(null);
    },
    isCreateOpen: mode === 'create',
    isEditOpen: mode === 'edit',
    isDeleteOpen: mode === 'delete',
  };
}
