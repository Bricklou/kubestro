import { globalGetStatusApi } from '../api/global'

export const GLOBAL_GET_STATUS_KEY = ['global', 'status']
export const globalGetStatus = () => ({
  queryKey: GLOBAL_GET_STATUS_KEY,
  queryFn: async () => globalGetStatusApi()
})
