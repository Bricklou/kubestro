import { redirect } from 'react-router'
import { globalGetStatus } from '~/data/queries/global'
import type { ServiceStatus } from '~/data/types/global'
import { queryGetOrFetch } from '~/utils/queryClient'

type SetupResponse = {
  type: 'redirect'
  response: Response
} | {
  type: 'result'
  data: ServiceStatus
}

export async function requireSetup(setupNeeded = true): Promise<SetupResponse> {
  const query = globalGetStatus()

  try {
    const status = await queryGetOrFetch(query)

    // If the setup is needed but the app isn't installed
    if (setupNeeded && status.status === 'not_installed') {
      return {
        type: 'redirect',
        response: redirect('/setup')
      }
    }
    // If the setup isn't needed and the app is installed
    else if (!setupNeeded && status.status === 'installed') {
      return {
        type: 'redirect',
        response: redirect('/')
      }
    }

    return {
      type: 'result',
      data: status
    }
  }
  // eslint-disable-next-line unused-imports/no-unused-vars -- I don't care about the error
  catch (error) {
    return {
      type: 'redirect',
      response: redirect('/')
    }
  }
}
