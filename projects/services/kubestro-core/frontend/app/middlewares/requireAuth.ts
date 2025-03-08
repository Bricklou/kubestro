import { href, redirect } from 'react-router'
import type { unstable_MiddlewareFunction } from 'react-router'
import { authLogoutApi } from '~/data/api/user'
import { AUTH_GET_USER_KEY, authGetUser } from '~/data/queries/user'
import { userContext } from '~/utils/contexts'
import { queryClient, queryGetOrFetch } from '~/utils/queryClient'

export async function logout(): Promise<Response> {
  console.debug('Logout')
  try {
    await authLogoutApi()
    queryClient.removeQueries({ queryKey: AUTH_GET_USER_KEY })
  }
  catch (error) {
    console.error('Failed to logout', error)
  }

  return redirect(href('/login'))
}

export const requireAuthMiddleware: unstable_MiddlewareFunction = async ({ context }, next) => {
  console.debug('Auth middleware')
  // Check the query client for existing user key, otherwise fetch the user
  const query = authGetUser()

  try {
    const userData = await queryGetOrFetch(query)

    context.set(userContext, userData.user)
    await next()
  }
  catch (_) {
    await logout()
  }
}

export const requireGuestMiddleware: unstable_MiddlewareFunction = async ({ context }, next) => {
  console.log('Guest middleware')
  const query = authGetUser()

  try {
    const userData = await queryGetOrFetch(query)

    context.set(userContext, userData.user)
    redirect('/dashboard')
  }
  catch (_) {
    await next()
  }
}
