import { Outlet } from 'react-router'
import { requireSetup } from '~/middlewares/requireSetup'

export async function clientLoader() {
  const result = await requireSetup(true)
  if (result.type === 'redirect') return result.response

  return {}
}

export default function AppLayout() {
  return <Outlet />
}
