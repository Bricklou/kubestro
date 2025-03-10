import { redirect } from 'react-router'
import type { unstable_MiddlewareFunction } from 'react-router'
import { globalGetStatus } from '~/data/queries/global'
import { statusContext } from '~/utils/contexts'
import { queryGetOrFetch } from '~/utils/queryClient'

export const requireSetupMiddleware: unstable_MiddlewareFunction = async ({
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
      throw redirect('/setup')
    }
    else if (status.status === 'installed' && url.pathname === '/setup') {
      throw redirect('/dashboard')
    }
  }
  catch (_) {
    throw redirect('/dashboard')
  }

  await next()
}
