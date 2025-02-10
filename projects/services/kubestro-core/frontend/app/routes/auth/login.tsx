import {
  Link, redirect, useFetcher
} from 'react-router'

import { HTTPError } from 'ky'
import {
  Button, FormMessage, Input, Label, linkVariants,
  toast,
  ToastProvider
} from '@kubestro/design-system'
import { LucideLogIn } from 'lucide-react'
import type { Route } from './+types/login'
import { requireGuest } from '~/middlewares/requireAuth'
import { authLoginApi } from '~/data/api/user'
import type {
  UnauthorizedError,
  AllHttpErrors,
  ValidationError
} from '~/data/api/generic-errors'
import { queryClient } from '~/utils/queryClient'
import { transformErrors } from '~/data/api/transform-errors'

export function meta() {
  return [
    { title: 'Login' }
  ]
}

export async function clientLoader() {
  const result = await requireGuest()
  if (result.type === 'redirect') return result.response

  return {}
}

interface FormFields {
  email: string
  password: string
}

function LoginBackground() {
  return (
    <div className="inset-0 -z-10 bg-white bg-grid-pattern bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-inner-circle" />
    </div>
  )
}

function LoginForm() {
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data?.error

  return (
    <fetcher.Form className="flex flex-col gap-6" method="post">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>

        <p className="text-balance text-sm text-text-muted">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        {error && 'title' in error && error.title ? <FormMessage error={error.title} /> : null}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>

          <Input
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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>

            <a className={linkVariants({ className: 'ml-auto text-xs' })} href="/">
              Forgot your password?
            </a>
          </div>

          <Input
            id="password"
            name="password"
            required
            type="password"
          />

          {error && 'password' in error ?
            <FormMessage error={error.password.detail} /> :
            null}
        </div>

        <Button className="w-full" type="submit">
          Login
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-text-muted">
            Or continue with
          </span>
        </div>

        <Button
          className="w-full"
          icon={LucideLogIn}
          iconPlacement="right"
          variant="secondary"
        >
          External auth provider
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?
        {' '}

        <Link className={linkVariants()} to="/register">
          Sign up
        </Link>
      </div>
    </fetcher.Form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex flex-row min-h-svh overflow-hidden">
      <div className="relative hidden lg:block overflow-hidden flex-1">
        <LoginBackground />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 border-l border-border bg-background w-full lg:max-w-[45vw] flex-1">
        <div className="flex justify-center gap-2 md:justify-start">
          <h1 className="text-2xl font-bold">Kubestro</h1>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <ToastProvider>
              <LoginForm />
            </ToastProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  try {
    const user = await authLoginApi(body)
    void queryClient.invalidateQueries({ queryKey: ['authentication', 'currentUser'] })

    console.log(user)
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
      title: 'An unexpected error occurred.'
    })
  }

  return redirect('/dashboard')
}
