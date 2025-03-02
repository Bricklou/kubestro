import { useFetcher } from 'react-router'
import { Button, FormMessage, Input, Label, toast } from '@kubestro/design-system/components'
import { HTTPError } from 'ky'
import { useEffect, useRef } from 'react'
import { useDashboardLayoutData } from '../_layout'
import type { Route } from './+types/security'
import { ContentSection } from './_components/content-section'
import { settingsUpdatePasswordApi } from '~/data/api/user'
import type { ConflictError, ForbiddenError, ValidationError } from '~/data/api/generic-errors'
import { transformErrors } from '~/data/api/transform-errors'

interface FormFields {
  current_password: string
  new_password: string
  confirm_password: string
}

function UpdatePasswordForm({ formDisabled }: { readonly formDisabled: boolean }) {
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data && 'error' in fetcher.data ? fetcher.data.error : undefined

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (fetcher.data && 'ok' in fetcher.data && fetcher.data.ok) {
      formRef.current?.reset()
    }
  }, [fetcher.data])

  return (

    <fetcher.Form className="space-y-8" method="post" ref={formRef}>
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>

        <Input
          aria-describedby="current-password-description"
          disabled={formDisabled}
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
          disabled={formDisabled}
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
          disabled={formDisabled}
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
        className="w-full md:w-[unset]"
        disabled={formDisabled || fetcher.state === 'submitting'}
        name="submit"
        type="submit"
      >
        Update password
      </Button>
    </fetcher.Form>

  )
}

function SecurityForm() {
  const { user } = useDashboardLayoutData()
  const oidc = user.provider === 'oidc'

  return (
    <div className="space-y-8">
      {oidc ?
        <p className="text-[0.8rem] text-warning-text mb-4">Some settings are disabled because you are using an external identity provider.</p> :
        null}

      <UpdatePasswordForm formDisabled={oidc} />
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

  // Password update
  try {
    await settingsUpdatePasswordApi({
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
