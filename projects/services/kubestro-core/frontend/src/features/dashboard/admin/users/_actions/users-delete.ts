import { toast } from '@kubestro/design-system'
import { HTTPError } from 'ky'
import type { ActionFunctionArgs, LazyRouteObject } from 'react-router'
import { adminDeleteUserApi } from '~/data/api/admin'
import type { ForbiddenError } from '~/data/api/generic-errors'
import { ADMIN_PAGINATE_USERS_KEY } from '~/data/queries/admin'
import { queryClient } from '~/utils/queryClient'

async function clientAction({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'DELETE') {
    throw new Error('Method not allowed (delete)')
  }

  const userId = params.id
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  try {
    await adminDeleteUserApi(userId)
    await queryClient.refetchQueries({ queryKey: ADMIN_PAGINATE_USERS_KEY })
  }
  catch (error) {
    if (error instanceof HTTPError) {
      // Forbidden
      if (error.response.status === 403) {
        const errorBody = await error.response.json<ForbiddenError>()
        toast({
          title: errorBody.detail,
          variant: 'error'
        })
        return {}
      }

      // Not Found
      if (error.response.status === 404) {
        toast({
          title: 'User not found',
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

  toast({
    title: 'The user has been deleted',
    variant: 'success'
  })
  return { ok: true }
}

export type DeleteUserAction = typeof clientAction

const routeObject: LazyRouteObject = {
  action: clientAction
}
export default routeObject
