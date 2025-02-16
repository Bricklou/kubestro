import { redirect } from 'react-router'
import { authLogoutApi } from '~/data/api/user'
import { authGetUser } from '~/data/queries/user'
import type { User } from '~/data/types/user'
import { queryGetOrFetch } from '~/utils/queryClient'

export async function logout(): Promise<Response> {
  try {
    await authLogoutApi()
  }
  catch (error) {
    console.error('Failed to logout', error)
  }

  return redirect('/login')
}

type AuthResponse = {
  type: 'redirect'
  response: Response
} | {
  type: 'result'
  user: User
}

export async function requireAuth(): Promise<AuthResponse> {
  // Check the query client for existing user key, otherwise fetch the user
  const query = authGetUser()

  try {
    const user = await queryGetOrFetch(query)

    return {
      type: 'result',
      user
    }
  }
  // eslint-disable-next-line unused-imports/no-unused-vars -- I don't care about the error
  catch (error) {
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
  // eslint-disable-next-line unused-imports/no-unused-vars -- I don't care about the error
  catch (error) {
    return { type: 'result' }
  }
}
