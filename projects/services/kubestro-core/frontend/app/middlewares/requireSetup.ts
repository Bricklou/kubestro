import { redirect } from 'react-router'
import type { Route } from '../+types/root'
import { globalGetStatus } from '~/data/queries/global'
import { statusContext } from '~/utils/contexts'
import { queryGetOrFetch } from '~/utils/queryClient'

export const requireSetupMiddleware: Route.unstable_ClientMiddlewareFunction = async ({
  request,
  context
}, next) => {
  const query = globalGetStatus()

  try {
    const status = await queryGetOrFetch(query)
    context.set(statusContext, status)

    const url = new URL(request.url)

    // If the setup is needed but the app isn't installed
    if (status.status === 'not_installed' && url.pathname !== '/setup') {
      redirect('/setup')
    }
    else if (status.status === 'installed' && url.pathname === '/setup') {
      redirect('/dashboard')
    }

    await next()
  }
  // eslint-disable-next-line unused-imports/no-unused-vars -- I don't care about the error
  catch (error) {
    redirect('/dashboard')
  }
}
