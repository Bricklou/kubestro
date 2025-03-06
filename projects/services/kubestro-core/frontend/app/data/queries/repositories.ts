import { gameManagersGetAllApi, repositoriesGetAllApi } from '../api/repositories'

export const REPOSITORIES_GET_ALL_KEY = ['game-managers', 'repositories', 'all']
export const repositoriesGetAll = (search?: string) => ({
  queryKey: [...REPOSITORIES_GET_ALL_KEY, { search }],
  queryFn: async () => repositoriesGetAllApi({ search })
})

export const GAME_MANAGERS_GET_ALL_KEY = ['game-managers', 'all']
export const gameManagersGetAll = (search?: string) => ({
  queryKey: [...GAME_MANAGERS_GET_ALL_KEY, { search }],
  queryFn: async () => gameManagersGetAllApi({ search })
})
