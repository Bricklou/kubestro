export type UserProvider = 'local' | 'oidc'
export function isUserProvider(value: string): value is UserProvider {
  return ['local', 'oidc'].includes(value)
}

export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'
export function isUserStatus(value: string): value is UserStatus {
  return ['active', 'inactive', 'invited', 'suspended'].includes(value)
}

export interface User {
  id: string
  username: string
  email: string
  created_at: string
  updated_at: string
  provider: UserProvider
  status: UserStatus
}

export interface UserData {
  user: User
}

export type UserFields = keyof User
export function isUserField(value: string): value is UserFields {
  return [
    'username',
    'email',
    'provider',
    'status'
  ].includes(value)
}
