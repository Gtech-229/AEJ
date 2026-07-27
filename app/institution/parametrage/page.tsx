'use client';

import { PageHeader } from '@/components/legacy-ui/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ChangePasswordForm } from '@/features/parametrage';

export default function InstitutionParametragePage() {
    const { user } = useAuth();

    return (
        <div className="p-6 max-w-3xl">
            <PageHeader title="Paramétrage" subtitle="Informations de votre institution et sécurité du compte" />

            <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
                <Tabs defaultValue="profil">
                    <TabsList>
                        <TabsTrigger value="profil">Profil</TabsTrigger>
                        <TabsTrigger value="securite">Sécurité</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profil" className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Nom</Label>
                                <Input defaultValue={user?.name} disabled />
                            </div>
                            <div className="space-y-1.5">
                                <Label>E-mail</Label>
                                <Input defaultValue={user?.email} disabled />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            La modification des informations de l'institution se fera ici une fois l'API disponible.
                        </p>
                    </TabsContent>

                    <TabsContent value="securite" className="mt-4">
                        <ChangePasswordForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}