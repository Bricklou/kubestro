import ky from 'ky'
import queryString from 'query-string'
import type { Paginated } from '../types/pagination'
import type { User, UserFields, UserProvider, UserStatus } from '../types/user'

interface UserFilters {
  search?: string
  status?: UserStatus[]
  provider?: UserProvider[]
}

export interface PaginateUsersApiParams {
  page: number
  limit: number
  filters?: UserFilters
  order?: UserFields | `-${UserFields}`
}

export async function adminPaginateUsersApi(
  { page = 1, limit = 10, filters, order }: PaginateUsersApiParams
): Promise<Paginated<User>> {
  const searchParams = queryString.stringify({
    page,
    limit,
    search: filters?.search,
    status: filters?.status,
    provider: filters?.provider,
    order
  }, { arrayFormat: 'bracket' })

  return ky.get<Paginated<User>>('/api/v1.0/admin/users', { searchParams }).json()
}
