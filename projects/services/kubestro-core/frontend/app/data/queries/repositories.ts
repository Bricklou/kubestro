import { repositoriesGetAllApi } from '../api/repositories'

export const REPOSITORIES_GET_ALL_KEY = ['game-managers', 'repositories', 'getAll']
export const repositoriesGetAll = () => ({
  queryKey: REPOSITORIES_GET_ALL_KEY,
  queryFn: async () => repositoriesGetAllApi()
})
