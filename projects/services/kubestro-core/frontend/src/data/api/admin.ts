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

export async function adminDeleteUserApi(userId: string): Promise<void> {
  return ky.delete(`/api/v1.0/admin/users/${userId}`).json()
}

interface AdminCreateUserPayload {
  email: string
  username: string
  password: string
  status: UserStatus
}

export async function adminCreateUserApi(payload: AdminCreateUserPayload): Promise<void> {
  return ky.post('/api/v1.0/admin/users', { json: payload }).json()
}

interface AdminUpdateUserPayload {
  email: string
  username: string
  status: UserStatus
}

export async function adminUpdateUserApi(
  userId: string,
  payload: AdminUpdateUserPayload
): Promise<void> {
  return ky.put(`/api/v1.0/admin/users/${userId}`, { json: payload }).json()
}

export async function adminInviteUser(email: string, description?: string): Promise<void> {
  return ky.post('/api/v1.0/admin/users/invite', { json: { email, description } }).json()
}
