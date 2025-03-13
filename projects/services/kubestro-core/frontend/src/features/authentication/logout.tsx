import type { RouteObject } from 'react-router'
import { logout, requireAuthMiddleware } from '~/middlewares/requireAuth'

async function clientAction() {
  return await logout()
}

const routeObject: RouteObject = {
  loader: clientAction,
  unstable_middleware: [requireAuthMiddleware]
}
export default routeObject
