import { Alert, AlertDescription, AlertTitle, buttonVariants } from '@kubestro/design-system'
import { AlertTriangleIcon } from 'lucide-react'
import { href, Link } from 'react-router'

interface MissingRepoAlertProps {
  readonly withRedirect?: boolean
}

export function MissingRepoAlert({ withRedirect }: MissingRepoAlertProps) {
  return (
    <Alert className="flex flex-col lg:flex-row gap-2 items-center justify-between" variant="warning">
      <AlertTriangleIcon className="size-4" />

      <div className="pt-1">
        <AlertTitle>Warning</AlertTitle>

        <AlertDescription>
          Please configure at least one repository in order to be able to install a game manager.

        </AlertDescription>
      </div>

      {withRedirect ?
        (
          <Link
            className={buttonVariants({
              variant: 'warning',
              size: 'sm',
              className: 'border border-warning-text !pl-3'
            })}
            to={href('/dashboard/game-managers/repositories')}
          >
            Add Repository
          </Link>
        ) :
        null}
    </Alert>
  )
}
