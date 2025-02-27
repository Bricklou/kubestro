export type UserProvider = 'local' | 'oidc'

export interface User {
  id: string
  username: string
  email: string
  created_at: string
  updated_at: string
  provider: UserProvider
}

export interface UserData {
  user: User
}
