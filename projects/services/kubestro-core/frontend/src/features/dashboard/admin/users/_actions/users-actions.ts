import type { ActionFunctionArgs, LazyRouteObject } from 'react-router'

function clientAction({ request }: ActionFunctionArgs) {
  return {}
}

const routeObject: LazyRouteObject = {
  action: clientAction
}
export default routeObject
