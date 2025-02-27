import { useFetcher } from 'react-router'
import { Button, FormMessage, Input, Label, Separator, Switch, toast } from '@kubestro/design-system/components'
import { HTTPError } from 'ky'
import { useEffect, useRef } from 'react'
import { useDashboardLayoutData } from '../_layout'
import type { Route } from './+types/security'
import { ContentSection } from '~/layouts/settings/content-section'
import { settingsUpdatePassword } from '~/data/api/user'
import type { ConflictError, ForbiddenError, ValidationError } from '~/data/api/generic-errors'
import { transformErrors } from '~/data/api/transform-errors'

type FormFields = {
  current_password: string
  new_password: string
  confirm_password: string
  submit: 'password-update'
} | {
  '2fa': boolean
  'submit': '2fa-update'
}

function SecurityForm() {
  const { user } = useDashboardLayoutData()
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data?.error

  const oidc = user.provider === 'oidc'

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (fetcher.data?.ok) {
      formRef.current?.reset()
    }
  }, [fetcher.data])

  return (
    <div className="space-y-8">
      {oidc ?
        <p className="text-[0.8rem] text-warning-text mb-4">Some settings are disabled because you are using an external identity provider.</p> :
        null}

      <fetcher.Form className="space-y-8" method="post" ref={formRef}>
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>

          <Input
            aria-describedby="current-password-description"
            disabled={oidc}
            id="current-password"
            name="current_password"
            placeholder="Enter your current password"
            type="password"
          />

          {error?.current_password ? <FormMessage error={error.current_password.detail} /> : null}

          <p className="text-[0.8rem] text-text-muted" id="current-password-description">
            Enter your current password to confirm your identity.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>

          <Input
            aria-describedby="new-password-description"
            disabled={oidc}
            id="new-password"
            name="new_password"
            placeholder="Enter your new password"
            type="password"
          />

          {error?.new_password ? <FormMessage error={error.new_password.detail} /> : null}

          <p className="text-[0.8rem] text-text-muted" id="new-password-description">
            Your new password must be at least 8 characters long.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>

          <Input
            aria-describedby="confirm-password-description"
            disabled={oidc}
            id="confirm-password"
            name="confirm_password"
            placeholder="Confirm your new password"
            type="password"
          />

          {error?.confirm_password ? <FormMessage error={error.confirm_password.detail} /> : null}

          <p className="text-[0.8rem] text-text-muted" id="confirm-password-description">
            Please confirm your new password.
          </p>
        </div>

        <Button
          disabled={oidc || fetcher.state === 'submitting'}
          name="submit"
          type="submit"
          value="password-update"
        >
          Update password
        </Button>
      </fetcher.Form>

      <Separator className="mx-auto" />

      <fetcher.Form className="space-y-8" method="post">
        <div className="space-y-2">
          <div className="flex gap-2 items-center w-full">
            <Label className="flex-1" htmlFor="2fa">Two-Factor Authentication</Label>

            <Switch
              aria-describedby="2fa-description"
              disabled={oidc}
              id="2fa"
              name="2fa"
            />
          </div>

          <p className="text-[0.8rem] text-text-muted" id="2fa-description">
            Secure your account with two-factor authentication.
          </p>
        </div>

        <Button disabled={oidc || fetcher.state === 'submitting'} type="submit">Update 2FA</Button>
      </fetcher.Form>
    </div>
  )
}

export default function SettingsSecurity() {
  return (
    <ContentSection
      desc="Manage your account security settings and set up two-factor authentication."
      title="Security"
    >
      <SecurityForm />
    </ContentSection>
  )
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  if (body.submit === 'password-update') {
    try {
      await settingsUpdatePassword({
        current_password: body.current_password,
        new_password: body.new_password,
        confirm_password: body.confirm_password
      })
    }
    catch (error) {
      if (error instanceof HTTPError) {
        // Unprocessable Entity
        if (error.response.status === 422) {
          const errorBody = await error.response.json<ValidationError<FormFields>>()
          return { error: transformErrors(errorBody.errors) }
        }

        // Forbidden
        if (error.response.status === 403) {
          const errorBody = await error.response.json<ForbiddenError>()
          toast({
            title: errorBody.detail,
            variant: 'error'
          })
          return {}
        }

        // Conflict
        if (error.response.status === 409) {
          type PasswordFields = Extract<FormFields, { submit: 'password-update' }>
          const errorBody = await error.response.json<ConflictError<PasswordFields>>()

          const errors: Partial<Record<keyof PasswordFields, { detail: string }>> = {}

          if (errorBody.fields.new_password) {
            errors.new_password = { detail: errorBody.fields.new_password }
          }
          if (errorBody.fields.current_password) {
            errors.current_password = { detail: errorBody.fields.current_password }
          }
          if (errorBody.fields.confirm_password) {
            errors.confirm_password = { detail: errorBody.fields.confirm_password }
          }

          toast({
            title: errorBody.detail,
            variant: 'error'
          })
          return { error: errors }
        }
      }

      toast({
        title: 'An unexpected error occurred.',
        variant: 'error'
      })
      return {}
    }

    toast({
      title: 'Password updated successfully.',
      variant: 'success'
    })
    return { ok: true }
  }

  return {}
}
