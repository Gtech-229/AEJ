"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const Forbidden = () => {
    const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>Accès interdit</span>
        <p className='text-center text-muted-foreground'>
          Vous n'avez pas les autorisations nécessaires <br />
          pour accéder à cette ressource.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Retour
          </Button>
          <Button onClick={()=>router.push('/')}>Accueil</Button>
        </div>
      </div>
    </div>
  )
}

export default Forbidden