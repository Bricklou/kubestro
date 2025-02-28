import { TriangleAlertIcon } from 'lucide-react'
import type { Route } from './+types/notifications'
import { ContentSection } from '~/layouts/settings/content-section'

export const meta: Route.MetaFunction = () => [
  { title: 'Notifications' }
]

export default function SettingsNotifications() {
  return (
    <ContentSection
      desc="Manage your notifications here."
      title="Notifications"
    >
      <p className="text-sm text-warning-text inline-flex gap-2">
        <TriangleAlertIcon className="size-4" />

        <span>
          Notifications are not implemented yet.
        </span>
      </p>
    </ContentSection>
  )
}
