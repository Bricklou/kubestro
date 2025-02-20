import ky from 'ky'
import type { User } from '../types/user'

export async function authGetUserApi(): Promise<User> {
  return ky.get<{ user: User }>('/api/v1.0/authentication')
    .json()
    .then(data => data.user)
}

export async function authLogoutApi(): Promise<void> {
  await ky.delete('/api/v1.0/authentication')
}

export async function authLoginApi(body: {
  email: string
  password: string
}): Promise<User> {
  return ky.post<{ user: User }>('/api/v1.0/authentication', { json: body })
    .json()
    .then(data => data.user)
}

export async function authLoginOidcApi(code: string, state: string): Promise<User> {
  const searchParams = new URLSearchParams()
  searchParams.set('code', code)
  searchParams.set('state', state)

  return ky.get<{ user: User }>('/api/v1.0/authentication/callback', {
    searchParams
  }).json()
}
