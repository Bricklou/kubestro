import { Card, CardDescription, CardTitle, CardFooter, Button, CardHeader, Badge } from '@kubestro/design-system/components'
import { ArrowDownToLineIcon, PackageCheckIcon, CircleSlashIcon, XCircleIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useFetcher } from 'react-router'

export interface ManagerCardProps {
  readonly name: string
  readonly description: string
  readonly version: string
  readonly onInstall?: () => void

  readonly state?: 'available' | 'installed' | 'installing' | 'incompatible' | 'error'
}

export function ManagerCard({
  name,
  description,
  version,
  state = 'available',
  onInstall
}: ManagerCardProps) {
  const fetcher = useFetcher()

  const stateText = useMemo(() => {
    switch (state) {
      case 'available':
        return 'Install'
      case 'installed':
        return 'Installed'
      case 'installing':
        return 'Installing...'
      case 'incompatible':
        return 'Incompatible'
      case 'error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }, [state])

  const stateVariant = useMemo(() => {
    switch (state) {
      case 'available':
        return 'primary-soft'
      case 'installed':
        return 'primary'
      case 'installing':
        return 'primary'
      case 'incompatible':
        return 'warning'
      case 'error':
        return 'danger'
      default:
        return 'primary-soft'
    }
  }, [state])

  const stateIcon = useMemo(() => {
    switch (state) {
      case 'available':
        return ArrowDownToLineIcon
      case 'installed':
        return PackageCheckIcon
      case 'incompatible':
        return CircleSlashIcon
      case 'error':
        return XCircleIcon
      case 'installing':
      default:
        return undefined
    }
  }, [state])

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
          disabled={state === 'installing'}
          icon={stateIcon}
          loading={state === 'installing'}
          onClick={onInstall}
          variant={stateVariant}
        >
          {stateText}
        </Button>
      </CardFooter>
    </Card>
  )
}
