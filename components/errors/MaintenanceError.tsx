"use client"
import { Button } from "../ui/button"

const MaintenanceError = () => {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>Site en maintenance</span>
        <p className='text-center text-muted-foreground'>
          Le site est actuellement en maintenance. <br />
          Merci de revenir dans quelques instants.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceError
