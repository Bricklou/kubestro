import { redirect, href } from 'react-router'
import type { LoaderFunctionArgs, RouteObject } from 'react-router'
import { toast } from '@kubestro/design-system'
import { requireGuestMiddleware } from '~/middlewares/requireAuth'
import { authLoginOidcApi } from '~/data/api/user'
import { queryClient } from '~/utils/queryClient'
import { AUTH_GET_USER_KEY } from '~/data/queries/user'

async function clientLoader({ request }: LoaderFunctionArgs) {
  // In this loader, our goal will be to login the user and then redirect him to the dashboard page

  // Extract the url from the request
  const url = new URL(request.url)

  // Then, we need to retrieve the code AND the state from the query parameters
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  // We need to ensure the `code` isn't absent
  if (typeof code !== 'string' || typeof state !== 'string') {
    toast({
      title: 'Invalid request',
      description: 'We were unable to authenticate you. Please try again.',
      variant: 'error'
    })

    return redirect(href('/'))
  }

  // Now, we need to make a request to the backend to exchange the code and the state
  try {
    await authLoginOidcApi(code, state)
    void queryClient.invalidateQueries({ queryKey: AUTH_GET_USER_KEY })
  }
  catch (_ignored) {
    toast({
      title: 'An error occurred',
      description: 'We were unable to authenticate you. Please try again.',
      variant: 'error'
    })

    return redirect(href('/'))
  }

  return redirect('/dashboard')
}

function OidcCallbackPage() {
  return <div>Logging you in...</div>
}

const routeObject: RouteObject = {
  element: <OidcCallbackPage />,
  loader: clientLoader,
  unstable_middleware: [requireGuestMiddleware]
}
export default routeObject
