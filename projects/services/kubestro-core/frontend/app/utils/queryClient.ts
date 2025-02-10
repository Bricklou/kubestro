import { QueryClient } from '@tanstack/react-query'
import type { FetchQueryOptions } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export async function queryGetOrFetch<T>(query: FetchQueryOptions<T>): Promise<T> {
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
