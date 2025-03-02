import ky from 'ky'
import type { UserData } from '../types/user'

export async function authGetUserApi(): Promise<UserData> {
  return ky.get<UserData>('/api/v1.0/authentication')
    .json()
}

export async function authLogoutApi(): Promise<void> {
  await ky.delete('/api/v1.0/authentication')
}

export async function authLoginApi(body: {
  email: string
  password: string
}): Promise<UserData> {
  return ky.post<UserData>('/api/v1.0/authentication', { json: body })
    .json()
}

export async function authLoginOidcApi(code: string, state: string): Promise<UserData> {
  const searchParams = new URLSearchParams()
  searchParams.set('code', code)
  searchParams.set('state', state)

  return ky.get<UserData>('/api/v1.0/authentication/callback', {
    searchParams
  }).json()
}

export async function settingsUpdateProfileApi(body: {
  username: string
  email: string
}): Promise<void> {
  await ky.put<UserData>('/api/v1.0/settings/profile', { json: body })
}

export async function settingsUpdatePasswordApi(body: {
  current_password: string
  new_password: string
  confirm_password: string
}): Promise<void> {
  await ky.put('/api/v1.0/settings/password', { json: body })
}
