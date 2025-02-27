import { redirect, useFetcher } from 'react-router'
import { Button, FormMessage, Input, Label, toast, PasswordVerification } from '@kubestro/design-system'
import { HTTPError } from 'ky'
import { useCallback, useState } from 'react'
import type { Route } from './+types/setup'
import type { AllHttpErrors, UnauthorizedError, ValidationError } from '~/data/api/generic-errors'
import { transformErrors } from '~/data/api/transform-errors'
import { globalSetupApi } from '~/data/api/global'
import { queryClient } from '~/utils/queryClient'
import { GLOBAL_GET_STATUS_KEY } from '~/data/queries/global'
import { requireSetup } from '~/middlewares/requireSetup'

export const meta: Route.MetaFunction = () => [
  { title: 'Setup' }
]

interface FormFields {
  email: string
  password: string
}

export async function clientLoader() {
  const result = await requireSetup(false)
  if (result.type === 'redirect') return result.response
  return {}
}

export default function Setup() {
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data?.error

  const [isValid, setIsValid] = useState(false)
  const onValidityChange = useCallback((valid: boolean) => {
    setIsValid(valid)
  }, [setIsValid])

  return (
    <fetcher.Form className="flex flex-col gap-6" method="post">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome on Kubestro!</h1>

        <p className="text-balance text-sm text-text-muted">
          First, we need you to configure your Kubestro instance.
          Please, enter the initial admin user details below
        </p>
      </div>

      <div className="grid gap-6">
        {error && 'title' in error && error.title ? <FormMessage error={error.title} /> : null}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>

          <Input
            defaultValue=""
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
          />

          {error && 'email' in error ?
            <FormMessage error={error.email.detail} /> :
            null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>

          <PasswordVerification
            id="password"
            name="password"
            onValidityChange={onValidityChange}
            required
          />

          {error && 'password' in error ?
            <FormMessage error={error.password.detail} /> :
            null}
        </div>
      </div>

      <Button
        className="w-full"
        disabled={!isValid}
        loading={fetcher.state === 'submitting'}
        type="submit"
      >
        Configure
      </Button>
    </fetcher.Form>
  )
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  try {
    // Do something with the form data
    await globalSetupApi(body)
    await queryClient.refetchQueries(({ queryKey: GLOBAL_GET_STATUS_KEY }))
    return redirect('/login')
  }
  catch (error) {
    if (error instanceof HTTPError) {
      // Unprocessable Entity
      if (error.response.status === 422) {
        const errorBody = await error.response.json<ValidationError<FormFields>>()
        return { error: transformErrors(errorBody.errors) }
      }

      // Unauthorized
      if (error.response.status === 401) {
        const errorBody = await error.response.json<UnauthorizedError>()
        toast({
          title: errorBody.detail,
          variant: 'error'
        })
        return {}
      }

      // Other
      return { error: await error.response.json<AllHttpErrors>() }
    }

    toast({
      title: 'An unexpected error occurred.',
      variant: 'error'
    })
    return {}
  }
}
