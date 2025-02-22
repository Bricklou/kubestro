import { redirect } from 'react-router'
import { requireAuth } from '~/middlewares/requireAuth'

export async function clientLoader() {
  const result = await requireAuth()
  if (result.type === 'redirect') return result.response

  return redirect('/dashboard')
}

export default function Index() {
  return null
}
