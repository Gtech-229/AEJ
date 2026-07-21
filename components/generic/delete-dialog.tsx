'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface GenericDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

/** Confirm-delete dialog built on shadcn AlertDialog. */
export function GenericDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Confirmer la suppression',
  description = 'Cette action est irréversible.',
  confirmText = 'Supprimer',
  cancelText = 'Annuler',
  isLoading,
}: GenericDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              // Keep the dialog controlled by the caller (so it can close on success).
              e.preventDefault();
              onConfirm();
            }}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            {isLoading ? 'Suppression…' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
