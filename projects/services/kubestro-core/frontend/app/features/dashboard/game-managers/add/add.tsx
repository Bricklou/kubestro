import { Input, ScrollArea, Separator } from '@kubestro/design-system/components'
import { SearchIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useFetcher } from 'react-router'
import { Main } from '../../_components/main'
import { ManagerCard } from './_components/manager-card'

export function clientLoader() {
  return {}
}
export default function GameManagersAdd() {
  const fetcher = useFetcher()

  const onInstall = useCallback((num: number) => {
    return () => {
      console.log(`Install Game Manager ${num.toString()}`)
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
          <div className="-mx-1 px-1.5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 pb-16">
            {Array.from({ length: 16 }).map((_, index) => (
              <ManagerCard
                description="Description of the game manager."
                key={index}
                name={`Game Manager ${index.toString()}`}
                onInstall={onInstall(index)}
                state="available"
                version="1.0.0"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Main>
  )
}
