import { Outlet, useRouteLoaderData } from 'react-router'
import type { Info } from './+types/app-layout'
import { requireSetup } from '~/middlewares/requireSetup'

export async function clientLoader() {
  const result = await requireSetup(true)
  if (result.type === 'redirect') return result.response

  return {
    ...result.data
  }
}

export function useRootLayoutData() {
  const data = useRouteLoaderData<Info['loaderData']>('layouts/app-layout' satisfies Info['id'])
  if (!data) {
    throw new Error('useRootLayoutData() was called outside of a route that uses the app-layout')
  }
  return data
}

export default function AppLayout() {
  return <Outlet />
}
