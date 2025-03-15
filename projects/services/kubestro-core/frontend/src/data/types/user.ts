export type UserProvider = 'local' | 'oidc'

export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'
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
