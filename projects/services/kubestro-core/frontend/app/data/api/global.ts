import ky from 'ky'
import type { ServiceStatus } from '../types/global'

export async function globalGetStatusApi() {
  return ky.get<ServiceStatus>('/api/v1.0/status').json()
}

export async function globalSetupApi(body: {
  email: string
  password: string
}): Promise<void> {
  await ky.post('/api/v1.0/setup', { json: body }).json()
}
