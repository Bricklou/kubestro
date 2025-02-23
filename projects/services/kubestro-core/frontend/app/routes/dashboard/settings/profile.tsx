import { Form } from 'react-router'
import { Button, Input, Label } from '@kubestro/design-system'
import type { Route } from '../+types'
import { ContentSection } from '~/layouts/settings/content-section'

export const meta: Route.MetaFunction = () => [
  { title: 'Profile' }
]

function ProfileForm() {
  return (
    <Form className="space-y-8" method="post">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" placeholder="e.g. johndoe" />

        <p className="text-[0.8rem] text-text-muted">
          This is your public display name. It can be your real name or a pseudonym.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" placeholder="e.g. johndoe@acme.com" />

        <p className="text-[0.8rem] text-text-muted">
          Your email address is used to log in and send you notifications.
        </p>
      </div>

      <Button type="submit">Update profile</Button>
    </Form>
  )
}

export default function SettingsProfile() {
  return (
    <ContentSection desc="This is how other will see you on the site" title="Profile">
      <ProfileForm />
    </ContentSection>
  )
}

export function clientAction() {
  return {}
}
