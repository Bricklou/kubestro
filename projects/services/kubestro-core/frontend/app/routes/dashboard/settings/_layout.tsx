import { Separator } from '@kubestro/design-system'
import { BellDotIcon, PaletteIcon, ShieldIcon, UserIcon } from 'lucide-react'
import { href, Outlet } from 'react-router'
import { Header } from '~/layouts/dashboard/header'
import { Main } from '~/layouts/dashboard/main'
import { ProfileDropdown } from '~/layouts/dashboard/profile-dropdown'
import { Search } from '~/layouts/dashboard/search'
import { ThemeSwitch } from '~/layouts/dashboard/theme-switch'
import { SidebarNav } from '~/layouts/settings/sidebar-nav'
import type { SidebarNavItem } from '~/layouts/settings/sidebar-nav'

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Profile',
    icon: <UserIcon size={18} />,
    to: href('/dashboard/settings')
  },
  {
    title: 'Security',
    icon: <ShieldIcon size={18} />,
    to: href('/dashboard/settings/security')
  },
  {
    title: 'Appearance',
    icon: <PaletteIcon size={18} />,
    to: href('/dashboard/settings/appearance')
  },
  {
    title: 'Notifications',
    icon: <BellDotIcon size={18} />,
    to: href('/dashboard/settings/notifications')
  }
]

export default function Settings() {
  return (
    <>
      {/* Top Heading */}
      <Header>
        <div className="flex w-full items-center space-x-4">
          <div className="flex-1 flex flex-row items-center justify-center">
            <Search />
          </div>

          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>

          <p className="text-text-muted">
            Manage your account settings and set e-mail preferences.
          </p>

        </div>

        <Separator className="my-4 lg:my-6" />

        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="top-0 lg:sticky lg:w-1/5">
            {/* Sidebar */}
            <SidebarNav items={sidebarNavItems} />
          </aside>

          <div className="flex w-full overflow-y-hidden p-1 pr-4">
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
