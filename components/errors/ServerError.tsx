"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const ServerError = () => {
    const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        <span className='font-medium'>Erreur interne du serveur</span>
        <p className='text-center text-muted-foreground'>
          Une erreur est survenue de notre côté. <br />
          Veuillez réessayer dans quelques instants.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Retour
          </Button>
          <Button onClick={() => router.push('/')}>Accueil</Button>
        </div>
      </div>
    </div>
  )
}

export default ServerError
