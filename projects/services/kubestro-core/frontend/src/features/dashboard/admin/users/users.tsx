import { useLoaderData } from 'react-router'
import type { LazyRouteObject, LoaderFunctionArgs } from 'react-router'
import { Separator } from '@kubestro/design-system'
import type { ParsedQuery } from 'query-string'
import { Main } from '../../_components/main'
import { UsersPrimaryButton } from './_components/users-primary-button'
import { UsersTable, useUsersTable } from './_components/users-table'
import { UsersSearchForm } from './_components/users-search-form'
import { adminPaginateUsers } from '~/data/queries/admin'
import { queryGetOrFetch } from '~/utils/queryClient'
import { isUserProvider, isUserStatus } from '~/data/types/user'
import type { UserProvider, UserStatus } from '~/data/types/user'
import { parseParams } from '~/utils/httpClient'

function extractProviders(query: ParsedQuery): UserProvider[] {
  const val = query.provider

  if (!Array.isArray(val)) return []

  const providers: UserProvider[] = []
  for (const provider of val) {
    if (provider && isUserProvider(provider)) {
      providers.push(provider)
    }
  }

  return providers
}

function extractStatuses(query: ParsedQuery): UserStatus[] {
  const val = query.status

  if (!Array.isArray(val)) return []

  const statuses: UserStatus[] = []
  for (const status of val) {
    if (status && isUserStatus(status)) {
      statuses.push(status)
    }
  }

  return statuses
}

function extractFilters(url: URL): {
  search?: string
  provider?: UserProvider[]
  status?: UserStatus[]
} {
  const params = parseParams(url)

  return {
    search: typeof params.search === 'string' ? params.search : undefined,
    provider: extractProviders(params),
    status: extractStatuses(params)
  }
}

async function clientLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const filters = extractFilters(url)

  const page = Number(url.searchParams.get('page') ?? 1)

  const query = adminPaginateUsers({
    filters,
    page,
    limit: 10
  })

  return {
    users: await queryGetOrFetch(query),
    filters
  }
}

function Users() {
  const { users, filters } = useLoaderData<typeof clientLoader>()
  const table = useUsersTable(users, filters)

  return (
    <Main fixed>
      <div className="space-x-0.5 space-y-4 @container @2xl:space-y-2">
        <div className="flex flex-col @2xl:flex-row @2xl:items-center justify-between space-y-2 @2xl:space-y-0">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Users
            </h1>

            <p className="text-text-muted">
              Manage users that have access to the system.
            </p>
          </div>

          <UsersPrimaryButton />
        </div>

        {/* Search */}
        <UsersSearchForm search={filters.search} table={table} />
      </div>

      <Separator className="mt-1 mb-4 lg:mb-6" />

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <UsersTable table={table} />
      </div>
    </Main>
  )
}

const routeObject: LazyRouteObject = {
  element: <Users />,
  loader: clientLoader
}
export default routeObject
