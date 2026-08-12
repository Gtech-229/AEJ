import { LoginForm } from '@/features/auth/components/login-form';
import { Suspense } from 'react';

export const metadata = {
    title: 'Connexion — Agence Emploi Jeunes',
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-svh flex items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
            <LoginForm space="agence" homeRoute="/dashboard" />
        </Suspense>
    );
}