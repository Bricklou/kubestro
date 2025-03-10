import { TriangleAlertIcon } from 'lucide-react'
import type { LazyRouteObject } from 'react-router'
import { ContentSection } from './_components/content-section'

function SettingsAppearance() {
  return (
    <ContentSection
      desc="Customize the appearance of the app."
      title="Appearance"
    >

      <p className="text-sm text-warning-text inline-flex gap-2">
        <TriangleAlertIcon className="size-4" />

        <span>
          Appearance are not implemented yet.
        </span>
      </p>
    </ContentSection>
  )
}

const routeObject: LazyRouteObject = {
  element: <SettingsAppearance />
}
export default routeObject
