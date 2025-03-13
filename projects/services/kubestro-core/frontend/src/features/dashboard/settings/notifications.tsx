import { TriangleAlertIcon } from 'lucide-react'
import type { LazyRouteObject } from 'react-router'
import { ContentSection } from './_components/content-section'

function SettingsNotifications() {
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

const routeObject: LazyRouteObject = {
  element: <SettingsNotifications />
}
export default routeObject
