import type { LazyRouteObject } from 'react-router'
import { Separator } from '@kubestro/design-system'
import { Main } from '../../_components/main'

function clientLoader() {
  return {}
}

function Groups() {
  return (
    <Main fixed>
      <div className="space-x-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Groups
        </h1>

        <p className="text-text-muted">
          Manage groups used to restrict access to certain resources.
        </p>
      </div>

      <Separator className="my-4 lg:my-6" />

      <div className="flex flex-col flex-1 px-2 min-h-0">
        content
      </div>
    </Main>
  )
}

const routeObject: LazyRouteObject = {
  element: <Groups />,
  loader: clientLoader
}
export default routeObject
