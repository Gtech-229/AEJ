'use client';

import { useCallback, useMemo, useState } from 'react';

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

export function useDialogState<T>(): DialogState<T> {
  const [mode, setMode] = useState<DialogMode | null>(null);
  const [item, setItem] = useState<T | null>(null);

  const openCreate = useCallback(() => {
    setItem(null);
    setMode('create');
  }, []);

  const openEdit = useCallback((next: T) => {
    setItem(next);
    setMode('edit');
  }, []);

  const openDelete = useCallback((next: T) => {
    setItem(next);
    setMode('delete');
  }, []);

  const close = useCallback(() => {
    setMode(null);
    setItem(null);
  }, []);
  return useMemo(
    () => ({
      mode,
      item,
      openCreate,
      openEdit,
      openDelete,
      close,
      isCreateOpen: mode === 'create',
      isEditOpen: mode === 'edit',
      isDeleteOpen: mode === 'delete',
    }),
    [mode, item, openCreate, openEdit, openDelete, close],
  );
}