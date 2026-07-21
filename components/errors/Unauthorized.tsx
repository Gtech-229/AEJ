"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const Unauthorized = () => {
    const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Non autorisé</span>
        <p className='text-center text-muted-foreground'>
          Votre session a expiré ou vous n'êtes pas connecté. <br />
          Veuillez vous reconnecter pour continuer.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Retour
          </Button>
          <Button onClick={() => router.push('/auth/login')}>Se connecter</Button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
