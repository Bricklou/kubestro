import { href, redirect } from 'react-router'
import { authLogoutApi } from '~/data/api/user'
import { AUTH_GET_USER_KEY, authGetUser } from '~/data/queries/user'
import type { User } from '~/data/types/user'
import { queryClient, queryGetOrFetch } from '~/utils/queryClient'

export async function logout(): Promise<Response> {
  try {
    await authLogoutApi()
    queryClient.removeQueries({ queryKey: AUTH_GET_USER_KEY })
  }
  catch (error) {
    console.error('Failed to logout', error)
  }

  return redirect(href('/login'))
}

type AuthResponse = {
  type: 'redirect'
  response: Response
} | {
  type: 'result'
  user: User
  oidc?: boolean
}

export async function requireAuth(): Promise<AuthResponse> {
  // Check the query client for existing user key, otherwise fetch the user
  const query = authGetUser()

  try {
    const userData = await queryGetOrFetch(query)

    return {
      type: 'result',
      ...userData
    }
  }
  catch (_) {
    return {
      type: 'redirect',
      response: await logout()
    }
  }
}

type GuestResponse = {
  type: 'redirect'
  response: Response
} | {
  type: 'result'
}

export async function requireGuest(): Promise<GuestResponse> {
  const query = authGetUser()

  try {
    await queryGetOrFetch(query)

    return {
      type: 'redirect',
      response: redirect('/dashboard')
    }
  }
  catch (_) {
    return { type: 'result' }
  }
}
