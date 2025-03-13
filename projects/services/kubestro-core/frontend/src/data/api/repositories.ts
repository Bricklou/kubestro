import ky from 'ky'
import type { Repository, RepositoryWithPackages } from '../types/repositories'

export async function repositoriesGetAllApi({
  search
}: { search?: string }): Promise<Repository[]> {
  const searchParams = new URLSearchParams()
  if (search) {
    searchParams.set('search', search)
  }

  return ky.get<{ repositories: Repository[] }>('/api/v1.0/game-managers/repositories', {
    searchParams
  })
    .json()
    .then(data => data.repositories)
}

export async function repositoriesCreateApi(
  repository: {
    name: string
    url: string
  }
): Promise<Repository> {
  return ky.post<{ repository: Repository }>('/api/v1.0/game-managers/repositories', { json: repository })
    .json()
    .then(data => data.repository)
}

export async function repositoriesDeleteApi(id: string): Promise<void> {
  await ky.delete(`/api/v1.0/game-managers/repositories/${id}`)
}

export async function gameManagersGetAllApi({
  search
}: { search?: string }): Promise<RepositoryWithPackages[]> {
  const searchParams = new URLSearchParams()
  if (search) {
    searchParams.set('search', search)
  }

  return ky.get<{ packages: RepositoryWithPackages[] }>('/api/v1.0/game-managers/catalog', {
    searchParams
  })
    .json()
    .then(data => data.packages)
}
