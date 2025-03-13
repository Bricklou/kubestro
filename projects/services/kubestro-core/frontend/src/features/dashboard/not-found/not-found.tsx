import type { RouteObject } from 'react-router'
import { Main } from '../_components/main'

function NotFound() {
  return (
    <Main fixed>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          404
        </h1>

        <p className="text-text-muted text-center">
          Page not found.
        </p>
      </div>
    </Main>
  )
}

const routeObject: RouteObject = {
  element: <NotFound />
}
export default routeObject
