import { useFetcher, useLoaderData } from 'react-router'
import type { ActionFunctionArgs, LazyRouteObject, LoaderFunctionArgs } from 'react-router'
import { Button, FormMessage, Input, Label, toast } from '@kubestro/design-system'
import { HTTPError } from 'ky'
import { ContentSection } from './_components/content-section'
import { queryClient } from '~/utils/queryClient'
import { AUTH_GET_USER_KEY } from '~/data/queries/user'
import { settingsUpdateProfileApi } from '~/data/api/user'
import type { ConflictError, ForbiddenError, ValidationError } from '~/data/api/generic-errors'
import { transformErrors } from '~/data/api/transform-errors'
import { userContext } from '~/utils/contexts'

interface FormFields {
  username: string
  email: string
}

function clientLoader({ context }: LoaderFunctionArgs) {
  return { user: context.get(userContext) }
}

function SettingsProfile() {
  const { user } = useLoaderData<typeof clientLoader>()
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data?.error

  const oidc = user.provider === 'oidc'

  return (
    <ContentSection desc="This is how other will see you on the site" title="Profile">
      <fetcher.Form className="space-y-8" method="post">

        {oidc ?
          <p className="text-[0.8rem] text-warning-text mb-4">Some settings are disabled because you are using an external identity provider.</p> :
          null}

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>

          <Input
            aria-describedby="username-description"
            defaultValue={user.username}
            disabled={oidc}
            id="username"
            name="username"
            placeholder="e.g. johndoe"
          />

          {error?.username ? <FormMessage error={error.username.detail} /> : null}

          <p className="text-[0.8rem] text-text-muted" id="username-description">
            This is your public display name. It can be your real name or a pseudonym.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            aria-describedby="email-description"
            defaultValue={user.email}
            disabled={oidc}
            id="email"
            name="email"
            placeholder="e.g. johndoe@acme.com"
            type="email"
          />

          {error?.email ? <FormMessage error={error.email.detail} /> : null}

          <p className="text-[0.8rem] text-text-muted" id="email-description">
            Your email address is used to log in and send you notifications.
          </p>
        </div>

        <Button className="w-full md:w-[unset]" disabled={oidc || fetcher.state === 'submitting'} type="submit">Update profile</Button>
      </fetcher.Form>
    </ContentSection>
  )
}

async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  try {
    await settingsUpdateProfileApi(body)
    await queryClient.refetchQueries({ queryKey: AUTH_GET_USER_KEY })
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
        const errorBody = await error.response.json<ConflictError<FormFields>>()

        const errors: Partial<Record<keyof FormFields, { detail: string }>> = {}

        if (errorBody.fields.username) {
          errors.username = { detail: errorBody.fields.username }
        }
        if (errorBody.fields.email) {
          errors.email = { detail: errorBody.fields.email }
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
    title: 'Profile updated successfully.',
    variant: 'success'
  })

  return {}
}

const routeObject: LazyRouteObject = {
  element: <SettingsProfile />,
  loader: clientLoader,
  action: clientAction
}
export default routeObject
