import { authGetUserApi } from '../api/user'

export const authGetUser = () => ({
  queryKey: ['authentication', 'currentUser'],
  queryFn: async () => authGetUserApi()
})
