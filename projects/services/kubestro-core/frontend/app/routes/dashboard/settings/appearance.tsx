import { TriangleAlertIcon } from 'lucide-react'
import type { Route } from './+types/appearance'
import { ContentSection } from '~/layouts/settings/content-section'

export const meta: Route.MetaFunction = () => [
  { title: 'Appearance' }
]

export default function SettingsAppearance() {
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
