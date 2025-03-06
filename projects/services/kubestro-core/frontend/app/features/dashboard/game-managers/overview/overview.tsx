import { Separator } from '@kubestro/design-system/components'
import { Main } from '../../_components/main'

export default function GameManagersOverview() {
  return (
    <Main fixed>
      <div className="space-y-0.5 ">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Game Managers
        </h1>

        <p className="text-text-muted">
          Manage your game managers.
        </p>

      </div>

      <Separator className="my-4 lg:my-6" />
    </Main>
  )
}
