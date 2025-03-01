import { Badge, Button, Card, CardDescription, CardFooter, CardHeader, CardTitle, Input, ScrollArea, Separator } from '@kubestro/design-system/components'
import { ArrowDownToLineIcon, SearchIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useFetcher } from 'react-router'

interface ManagerCardProps {
  readonly name: string
  readonly description: string
  readonly version: string
  readonly onInstall?: () => void
}

function ManagerCard({ name, description, version, onInstall }: ManagerCardProps) {
  return (
    <Card className="bg-background-contrast">
      <CardHeader>
        <div className="inline-flex flex-row items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <Badge aria-label={`Version ${version}`} className="text-xs px-1" variant="secondary">{version}</Badge>
        </div>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-row">
        <Button
          className="flex-1"
          icon={ArrowDownToLineIcon}
          iconPlacement="left"
          onClick={onInstall}
          variant="primary-soft"
        >
          Install
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function GameManagersAdd() {
  const fetcher = useFetcher()

  const onInstall = useCallback((num: number) => {
    return () => {
      console.log(`Install Game Manager ${num.toString()}`)
    }
  }, [])

  return (
    <div className="space-y-0.5 flex-1 flex flex-col min-h-0">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Add a Game Managers
      </h1>

      <p className="text-text-muted">
        Deploy a new game manager to your cluster.
      </p>

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
          <div className="-mx-1 px-1.5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 pb-16">
            {Array.from({ length: 16 }).map((_, index) => (
              <ManagerCard
                description="Description of the game manager."
                key={index}
                name={`Game Manager ${index.toString()}`}
                onInstall={onInstall(index)}
                version="1.0.0"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
