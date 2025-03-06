import { Input, ScrollArea, Separator } from '@kubestro/design-system/components'
import { BookDashedIcon, SearchIcon } from 'lucide-react'
import { Suspense, useCallback } from 'react'
import { Await, useFetcher } from 'react-router'
import { Main } from '../../_components/main'
import { MissingRepoAlert } from '../repositories/_components/missing-repo-alert'
import { ManagerCard } from './_components/manager-card'
import type { Route } from './+types/add'
import { ManagersListSkeleton } from './_components/manager-list-skeleton'
import { gameManagersGetAll } from '~/data/queries/repositories'
import { queryGetOrFetch } from '~/utils/queryClient'

export function clientLoader({ request }: Route.ClientActionArgs) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') ?? undefined

  const query = gameManagersGetAll(search)
  return {
    gameManagers: queryGetOrFetch(query)
  }
}

export default function GameManagersAdd({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher()

  const onInstall = useCallback((id: string) => {
    return () => {
      console.log(`Install Game Manager ${id}`)
    }
  }, [])

  return (
    <Main fixed>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Add a Game Managers
        </h1>

        <p className="text-text-muted">
          Deploy a new game manager to your cluster.
        </p>

      </div>

      <Separator className="my-4 lg:my-6" />

      <div className="flex flex-col flex-1 px-2 min-h-0">
        {/* Search */}
        <fetcher.Form className="flex flex-row gap-2 p-1 pb-4" method="get">
          <div className="relative inline-flex items-center w-full">
            <Input
              className="bg-background-contrast pl-8 peer"
              name="search"
              placeholder="Search..."
              type="search"
            />

            <SearchIcon className="size-4 left-2 absolute text-text-muted peer-focus-within:text-text" />
          </div>
        </fetcher.Form>

        {/* Available Game Managers List */}
        <ScrollArea className="scroll-smooth flex-1 -mx-4 px-4 min-h-0 faded-bottom">
          <div className="-mx-1 px-1.5 flex flex-col gap-4">
            <Suspense fallback={<ManagersListSkeleton />} name="managers-list">
              <Await resolve={loaderData.gameManagers}>
                {(gameManagers) => {
                  if (gameManagers.length === 0) {
                    return (
                      <>
                        <div className="pb-2">
                          <MissingRepoAlert withRedirect />
                        </div>

                        <div className="h-[50svh] text-text-muted flex flex-col gap-4 items-center justify-center pb-16">
                          <BookDashedIcon className="size-24 mx-auto" />
                          No repositories found.
                        </div>
                      </>
                    )
                  }

                  return gameManagers.map(repository => (
                    <section className="flex flex-col gap-4" key={repository.id}>
                      <h2 className="text-lg font-bold">{repository.name}</h2>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 pb-16">
                        {repository.packages.map(pkg => (
                          <ManagerCard
                            description={pkg.description}
                            key={pkg.id}
                            name={pkg.name}
                            onInstall={onInstall(pkg.id)}
                            state="installed"
                            version={pkg.version}
                          />
                        ))}
                      </div>
                    </section>
                  ))
                }}
              </Await>
            </Suspense>
          </div>
        </ScrollArea>
      </div>
    </Main >
  )
}
