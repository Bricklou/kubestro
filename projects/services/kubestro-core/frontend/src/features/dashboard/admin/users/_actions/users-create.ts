import { toast } from '@kubestro/design-system'
import { HTTPError } from 'ky'
import type { ActionFunctionArgs, LazyRouteObject } from 'react-router'
import { adminCreateUserApi } from '~/data/api/admin'
import type { ValidationError, UnauthorizedError, ForbiddenError, AllHttpErrors } from '~/data/api/generic-errors'
import { transformErrors } from '~/data/api/transform-errors'
import { ADMIN_PAGINATE_USERS_KEY } from '~/data/queries/admin'
import type { UserStatus } from '~/data/types/user'
import { queryClient } from '~/utils/queryClient'

interface FormFields {
  username: string
  email: string
  password: string
  status: UserStatus
}

async function clientAction({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Error('Method not allowed (create)')
  }

  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  try {
    // Create user
    await adminCreateUserApi(body)
    await queryClient.refetchQueries({ queryKey: ADMIN_PAGINATE_USERS_KEY })
  }
  catch (error) {
    if (error instanceof HTTPError) {
      // Unprocessable Entity
      if (error.response.status === 422) {
        const errorBody = await error.response.json<ValidationError<FormFields>>()
        return { error: transformErrors(errorBody.errors) }
      }

      // Unauthorized or Forbidden
      if (error.response.status === 401 || error.response.status === 403) {
        const errorBody = await error.response.json<UnauthorizedError | ForbiddenError>()
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
  }

  return { ok: true }
}

export type CreateUserAction = typeof clientAction

const routeObject: LazyRouteObject = {
  action: clientAction
}
export default routeObject
