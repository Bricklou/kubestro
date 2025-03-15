import { useLoaderData } from 'react-router'
import type { LazyRouteObject, LoaderFunctionArgs } from 'react-router'
import { Separator } from '@kubestro/design-system'
import { Main } from '../../_components/main'
import { UsersPrimaryButton } from './_components/users-primary-button'
import { UsersTable, useUsersTable } from './_components/users-table'
import { UsersSearchForm } from './_components/users-search-form'
import type { User } from '~/data/types/user'

function extractSortingParams(params: URLSearchParams) {
  // Get the sort query parameter
  const sort = params.get('sort')

  // If the sort query parameter is not set, return an empty array
  if (!sort) {
    return []
  }

  // If the sort query parameter is set, check if the value match `id` or `-id`
  if (!(/^-?[\w-]+$/).test(sort)) {
    return []
  }

  // If the sort query parameter is set, return the sorting state
  return sort.startsWith('-') ?
    [{ id: sort.slice(1), desc: true }] :
    [{ id: sort, desc: false }]
}

function clientLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  return {
    users: [
      {
        id: '1',
        email: 'john.doe@acme.me',
        username: 'john.doe',
        status: 'active',
        provider: 'local',
        created_at: '2021-10-01T12:00:00Z',
        updated_at: '2021-10-01T12:00:00Z'
      },
      {
        id: '2',
        email: 'jane.doe@acme.me',
        username: 'jane.doe',
        status: 'inactive',
        provider: 'local',
        created_at: '2021-10-01T12:00:00Z',
        updated_at: '2021-10-01T12:00:00Z'
      },
      {
        id: '3',
        email: 'paul.smith@example.com',
        username: 'paul.smith',
        status: 'invited',
        provider: 'oidc',
        created_at: '2021-10-01T12:00:00Z',
        updated_at: '2021-10-01T12:00:00Z'
      },
      {
        id: '4',
        email: 'oscar.black@example.com',
        username: 'oscar.black',
        status: 'suspended',
        provider: 'oidc',
        created_at: '2021-10-01T12:00:00Z',
        updated_at: '2021-10-01T12:00:00Z'
      }
    ] as User[],
    sort: extractSortingParams(url.searchParams),
    search: url.searchParams.get('search') ?? undefined
  }
}

function Users() {
  const { users } = useLoaderData<typeof clientLoader>()
  const table = useUsersTable(users)

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
        <UsersSearchForm table={table} />
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
