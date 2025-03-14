import {
  Link, redirect, useFetcher,
  useLoaderData

} from 'react-router'
import type { ActionFunctionArgs, LoaderFunctionArgs, RouteObject } from 'react-router'

import { HTTPError } from 'ky'
import {
  Button, FormMessage, Input, Label, linkVariants,
  toast
} from '@kubestro/design-system'
import { LucideLogIn } from 'lucide-react'
import { requireGuestMiddleware } from '~/middlewares/requireAuth'
import { authLoginApi } from '~/data/api/user'
import type {
  UnauthorizedError,
  ValidationError
} from '~/data/api/generic-errors'
import { queryClient } from '~/utils/queryClient'
import { transformErrors } from '~/data/api/transform-errors'
import { AUTH_GET_USER_KEY } from '~/data/queries/user'
import { statusContext } from '~/utils/contexts'

interface FormFields {
  email: string
  password: string
}

function clientLoader({ context }: LoaderFunctionArgs) {
  const { oidc } = context.get(statusContext)
  return { oidc }
}

function LoginPage() {
  const loaderData = useLoaderData<typeof clientLoader>()
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

        {loaderData.oidc ?
          (
            <>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-text-muted">
                  Or continue with
                </span>
              </div>

              <Button
                asChild
                className="w-full"
                icon={LucideLogIn}
                iconPlacement="right"
                variant="secondary"
              >
                <a href={loaderData.oidc.redirect_url}>
                  {loaderData.oidc.display_name ?? 'External auth provider'}
                </a>
              </Button>
            </>
          ) :
          null}
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

async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  try {
    await authLoginApi(body)
    void queryClient.invalidateQueries({ queryKey: AUTH_GET_USER_KEY })
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
    }

    toast({
      title: 'An unexpected error occurred.',
      variant: 'error'
    })
    return {}
  }

  return redirect('/dashboard')
}

const routeObject: RouteObject = {
  element: <LoginPage />,
  loader: clientLoader,
  action: clientAction,
  unstable_middleware: [requireGuestMiddleware]
}

export default routeObject
