import { Button, SidebarProvider } from '@kubestro/design-system'
import { Outlet, useRouteLoaderData } from 'react-router'
import { twJoin } from 'tailwind-merge'
import { BellIcon } from 'lucide-react'
import type { Info, Route } from './+types/_layout'
import { Header } from './_components/header'
import { Search } from './_components/search'
import { ProfileDropdown } from './_components/profile-dropdown'
import { AppSidebar } from '~/features/dashboard/_components/app-sidebar'
import { requireAuth } from '~/middlewares/requireAuth'
import { SearchProvider } from '~/hooks/search'
import { ThemeSwitch } from '~/ui/theme-switch'

export async function clientLoader() {
  const result = await requireAuth()
  if (result.type === 'redirect') return result.response

  return {
    user: result.user,
    oidc: result.oidc
  }
}

export function useDashboardLayoutData() {
  const data = useRouteLoaderData<Info['loaderData']>('dashboard-layout' satisfies Info['id'])
  if (!data) {
    throw new Error('useDashboardLayoutData() was called outside of a route that uses the dashboard/_layout')
  }
  return data
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData

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

          {/* Top Heading */}
          <Header>
            <div className="flex w-full items-center space-x-4">
              <div className="flex-1 flex flex-row items-center justify-center">
                <Search />
              </div>

              <div>

                {/* Temporary button */}
                <Button className="rounded-full scale-95" size="icon" variant="ghost">
                  <BellIcon />
                </Button>

                <ThemeSwitch />
              </div>

              <ProfileDropdown user={user} />
            </div>
          </Header>

          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
