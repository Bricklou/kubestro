import { logout, requireAuthMiddleware } from '~/middlewares/requireAuth'

export const unstable_clientMiddleware = [requireAuthMiddleware]

export async function clientAction() {
  return await logout()
}
