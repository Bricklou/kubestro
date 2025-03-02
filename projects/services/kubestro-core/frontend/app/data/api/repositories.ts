import ky from 'ky'
import type { Repository } from '../types/repositories'

export async function repositoriesGetAllApi(): Promise<Repository[]> {
  return ky.get<{ repositories: Repository[] }>('/api/v1.0/game-managers/repositories')
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
