import { Input, ScrollArea, Separator, toast } from '@kubestro/design-system/components'
import { Form } from 'react-router'
import { BookDashedIcon, SearchIcon } from 'lucide-react'
import { HTTPError } from 'ky'
import { Main } from '../../_components/main'
import { AddRepository } from './_components/add-repository'
import type { Route } from './+types/repositories'
import { RepositoryCard } from './_components/repository-card'
import { MissingRepoAlert } from './_components/missing-repo-alert'
import { queryClient, queryGetOrFetch } from '~/utils/queryClient'
import { REPOSITORIES_GET_ALL_KEY, repositoriesGetAll } from '~/data/queries/repositories'
import { repositoriesCreateApi } from '~/data/api/repositories'
import type { ConflictError, ForbiddenError, ValidationError } from '~/data/api/generic-errors'
import { transformErrors } from '~/data/api/transform-errors'

export async function clientLoader({ request }: Route.ClientActionArgs) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') ?? undefined

  const query = repositoriesGetAll(search)
  const repositories = await queryGetOrFetch(query)

  return { repositories }
}

export default function Repositories({ loaderData }: Route.ComponentProps) {
  const { repositories } = loaderData

  return (
    <Main fixed>
      <div className="space-y-0.5 ">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Repositories
        </h1>

        <p className="text-text-muted">
          Repositories are used to retrieve a list of game managers available for installation.
        </p>

      </div>

      <Separator className="my-4 lg:my-6" />

      <div className="flex flex-col flex-1 px-2 min-h-0">

        {/* Search */}
        <Form className="flex flex-col md:flex-row gap-2 p-1 pb-4" method="get">
          <div className="relative inline-flex items-center w-full flex-1">
            <Input
              className="bg-background-contrast pl-8 peer"
              name="search"
              placeholder="Search repositories..."
              type="search"
            />

            <SearchIcon className="size-4 left-2 absolute text-text-muted peer-focus-within:text-text" />
          </div>

          <AddRepository />
        </Form>

        {/* Available Repositories List */}
        {repositories.length === 0 ?
          (
            <>
              <div className="pb-2">
                <MissingRepoAlert />
              </div>

              <div className="flex-1 text-text-muted flex flex-col gap-4 items-center justify-center pb-16">
                <BookDashedIcon className="size-24 mx-auto" />
                No repositories found.
              </div>
            </>
          ) :
          (
            <ScrollArea className="scroll-smooth flex-1 -mx-4 px-4 min-h-0 faded-bottom">
              <div className="-mx-1 px-1.5 flex flex-col pb-16 gap-4">
                {repositories.map(repository => (
                  <RepositoryCard key={repository.id} repository={repository} />
                ))}
              </div>
            </ScrollArea>
          )}
      </div>
    </Main>
  )
}

interface FormFields {
  name: string
  url: string
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- I trust the form data
  const body = Object.fromEntries(formData) as unknown as FormFields

  try {
    await repositoriesCreateApi(body)
    void queryClient.refetchQueries({ queryKey: REPOSITORIES_GET_ALL_KEY })
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

        if (errorBody.fields.url) {
          errors.url = { detail: errorBody.fields.url }
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
    title: 'Repository added successfully.',
    variant: 'success'
  })

  return { ok: true }
}
