import { authGetUserApi } from '../api/user'

export const AUTH_GET_USER_KEY = ['authentication', 'currentUser']
export const authGetUser = () => ({
  queryKey: AUTH_GET_USER_KEY,
  queryFn: async () => authGetUserApi()
})
