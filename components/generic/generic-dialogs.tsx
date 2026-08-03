'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DIALOG_SIZES, type DialogSize } from '@/components/forms';
import { GenericDeleteDialog } from './delete-dialog';
import type { DialogState } from './use-dialog-state';

interface GenericDialogsProps<T> {
  state: DialogState<T>;
  titles: { create: string; edit: string; delete?: string };
  descriptions?: { create?: string; edit?: string };
  dialogSize?: DialogSize;
  /** Renders the add/edit form (typically a <DynamicForm/>). */
  renderForm: (args: {
    mode: 'create' | 'edit';
    item: T | null;
    close: () => void;
  }) => React.ReactNode;
  onDelete: (item: T) => void | Promise<void>;
  deleteDescription?: (item: T) => React.ReactNode;
  isDeleting?: boolean;
}

/**
 * Orchestrates the add / edit / delete dialogs for a resource, driven by a
 * `useDialogState` instance. Pass `renderForm` to render the feature's
 * `DynamicForm`, and `onDelete` to call the delete mutation.
 */
export function GenericDialogs<T>({
  state,
  titles,
  descriptions,
  dialogSize = 'lg',
  renderForm,
  onDelete,
  deleteDescription,
  isDeleting,
}: GenericDialogsProps<T>) {
  const isFormOpen = state.isCreateOpen || state.isEditOpen;
  const mode = state.isEditOpen ? 'edit' : 'create';
  const description = state.isEditOpen ? descriptions?.edit : descriptions?.create;

  return (
    <>
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) state.close();
        }}
      >
        <DialogContent className={cn(DIALOG_SIZES[dialogSize], 'max-h-[90vh] overflow-y-auto')}>
          <DialogHeader>
            <DialogTitle>{state.isEditOpen ? titles.edit : titles.create}</DialogTitle>
            <DialogDescription className={description ? undefined : 'sr-only'}>
              {description ?? 'Renseignez le formulaire ci-dessous.'}
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && renderForm({ mode, item: state.item, close: state.close })}
        </DialogContent>
      </Dialog>

      <GenericDeleteDialog
        open={state.isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) state.close();
        }}
        onConfirm={() => {
          if (state.item) onDelete(state.item);
        }}
        title={titles.delete}
        description={
          state.item && deleteDescription ? deleteDescription(state.item) : undefined
        }
        isLoading={isDeleting}
      />
    </>
  );
}
