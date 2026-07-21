"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const NotFound = () => {
    const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Page introuvable</span>
        <p className='text-center text-muted-foreground'>
          La page que vous recherchez n'existe pas <br />
          ou a été déplacée.
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

export default NotFound
