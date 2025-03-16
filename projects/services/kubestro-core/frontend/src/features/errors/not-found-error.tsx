import { useNavigate } from 'react-router'
import type { RouteObject } from 'react-router'
import { Button } from '@kubestro/design-system'
import { useCallback } from 'react'
import { ArrowLeftIcon, HomeIcon } from 'lucide-react'
import { Main } from '../dashboard/_components/main'

function NotFound() {
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    void navigate(-1)
  }, [navigate])
  const goHome = useCallback(() => {
    void navigate('/dashboard')
  }, [navigate])

  return (
    <Main fixed>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          404
        </h1>

        <p className="font-medium text-center">
          Page not found.
        </p>

        <p className="text-center text-text-muted">
          It seems like the page you&apos;re looking for
          {' '}
          <br />
          does not exist or might have been removed.
        </p>

        <div className="mt-6 flex gap-4">
          <Button icon={ArrowLeftIcon} onClick={goBack} variant="secondary">Go back</Button>
          <Button icon={HomeIcon} onClick={goHome}>Go to home</Button>
        </div>
      </div>
    </Main>
  )
}

const routeObject: RouteObject = {
  element: <NotFound />
}
export default routeObject
