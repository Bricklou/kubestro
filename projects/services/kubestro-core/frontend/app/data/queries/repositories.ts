import { repositoriesGetAllApi } from '../api/repositories'

export const REPOSITORIES_GET_ALL_KEY = ['game-managers', 'repositories', 'all']
export const repositoriesGetAll = (search?: string) => ({
  queryKey: [...REPOSITORIES_GET_ALL_KEY, { search }],
  queryFn: async () => repositoriesGetAllApi({ search })
})
