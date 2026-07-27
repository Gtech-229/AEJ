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

function formatMMSS(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(safe % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

interface SessionWarningDialogProps {
  remainingSeconds: number;
  onExtend: () => void;
  onLogout: () => void;
}

/** Shown shortly before idle expiry; offers to stay signed in. */
export function SessionWarningDialog({
  remainingSeconds,
  onExtend,
  onLogout,
}: SessionWarningDialogProps) {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Vous êtes toujours là ?</AlertDialogTitle>
          <AlertDialogDescription>
            Par sécurité, votre session va expirer pour cause d’inactivité dans{' '}
            <span className="font-semibold text-foreground tabular-nums">
              {formatMMSS(remainingSeconds)}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout}>Se déconnecter</AlertDialogCancel>
          <AlertDialogAction onClick={onExtend}>Rester connecté</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
