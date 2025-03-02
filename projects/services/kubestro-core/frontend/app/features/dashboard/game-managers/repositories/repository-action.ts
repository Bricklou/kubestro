import { HTTPError } from 'ky'
import { toast } from '@kubestro/design-system/components'
import type { Route } from './+types/repository-action'
import { repositoriesDeleteApi } from '~/data/api/repositories'
import { queryClient } from '~/utils/queryClient'
import { REPOSITORIES_GET_ALL_KEY } from '~/data/queries/repositories'
import type { ForbiddenError } from '~/data/api/generic-errors'

export async function clientAction({ params }: Route.ActionArgs) {
  const { id } = params

  try {
    await repositoriesDeleteApi(id)
    void queryClient.refetchQueries({ queryKey: REPOSITORIES_GET_ALL_KEY })
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
    }

    toast({
      title: 'An unexpected error occurred.',
      variant: 'error'
    })
    return {}
  }

  toast({
    title: 'Repository deleted successfully.',
    variant: 'success'
  })

  return { ok: true }
}
