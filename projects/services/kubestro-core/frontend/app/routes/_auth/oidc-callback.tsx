import { redirect, href } from 'react-router'
import { toast } from '@kubestro/design-system'
import type { Route } from './+types/oidc-callback'
import { requireGuest } from '~/middlewares/requireAuth'
import { authLoginOidcApi } from '~/data/api/user'
import { queryClient } from '~/utils/queryClient'
import { AUTH_GET_USER_KEY } from '~/data/queries/user'

export const meta: Route.MetaFunction = () => [
  { title: 'Logging you in...' }
]

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // In this loader, our goal will be to login the user and then redirect him to the dashboard page

  // First, we need to check if the user isn't already logged in
  const result = await requireGuest()
  if (result.type === 'redirect') return result.response

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
    const user = await authLoginOidcApi(code, state)
    void queryClient.invalidateQueries({ queryKey: AUTH_GET_USER_KEY })

    console.log(user)
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

export default function OidcCallbackPage() {
  return <div>Logging you in...</div>
}
