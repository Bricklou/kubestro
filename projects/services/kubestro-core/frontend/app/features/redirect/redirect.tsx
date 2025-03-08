import { redirect } from 'react-router'
import type { Route } from './+types/redirect'

const indexRedirectMiddleware: Route.unstable_ClientMiddlewareFunction = async ({
  request
}, next) => {
  const url = new URL(request.url)

  if (url.pathname === '/') {
    throw redirect('/dashboard')
  }

  return next()
}

export const unstable_clientMiddleware = [indexRedirectMiddleware]
