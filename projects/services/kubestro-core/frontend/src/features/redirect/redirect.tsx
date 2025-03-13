import { redirect } from 'react-router'
import type { unstable_MiddlewareFunction } from 'react-router'

export const indexRedirectMiddleware: unstable_MiddlewareFunction = ({ request }, next) => {
  console.log('indexRedirectMiddleware')
  const url = new URL(request.url)

  if (url.pathname === '/') {
    throw redirect('/dashboard')
  }

  return next()
}
