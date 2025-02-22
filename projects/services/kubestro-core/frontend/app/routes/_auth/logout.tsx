import { logout, requireAuth } from '~/middlewares/requireAuth'

export async function clientAction() {
  const result = await requireAuth()
  if (result.type === 'redirect') return result.response

  return await logout()
}
