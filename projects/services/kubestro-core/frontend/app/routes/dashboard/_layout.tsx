import { SidebarProvider } from '@kubestro/design-system'
import { Outlet, useRouteLoaderData } from 'react-router'
import { twJoin } from 'tailwind-merge'
import type { Info } from './+types/_layout'
import { AppSidebar } from '~/layouts/dashboard/app-sidebar'
import { requireAuth } from '~/middlewares/requireAuth'
import { SearchProvider } from '~/hooks/search'

export async function clientLoader() {
  const result = await requireAuth()
  if (result.type === 'redirect') return result.response

  return {
    user: result.user
  }
}

export function useDashboardLayoutData() {
  const data = useRouteLoaderData<Info['loaderData']>('dashboard-layout' satisfies Info['id'])
  if (!data) {
    throw new Error('useDashboardLayoutData() was called outside of a route that uses the dashboard/_layout')
  }
  return data
}

export default function DashboardLayout() {
  return (
    <SearchProvider>
      <SidebarProvider>
        <AppSidebar />

        <div
          className={twJoin(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
