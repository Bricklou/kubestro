import { adminPaginateUsersApi } from '../api/admin'
import type { PaginateUsersApiParams } from '../api/admin'

export const ADMIN_PAGINATE_USERS_KEY = ['admin', 'users', 'paginate']
export const adminPaginateUsers = (params: PaginateUsersApiParams) => ({
  queryKey: [...ADMIN_PAGINATE_USERS_KEY, params],
  queryFn: async () => adminPaginateUsersApi(params)
})
