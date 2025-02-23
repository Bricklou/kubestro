import { Header } from '~/layouts/dashboard/header'
import { ProfileDropdown } from '~/layouts/dashboard/profile-dropdown'
import { Search } from '~/layouts/dashboard/search'
import { ThemeSwitch } from '~/layouts/dashboard/theme-switch'
import { TopNav } from '~/layouts/dashboard/top-nav'

export function meta() {
  return [
    { title: 'Home' }
  ]
}

export default function DashboardHome() {
  return (
    <>
      {/* Top Heading */}
      <Header>
        <TopNav />

        <div className="flex w-full items-center space-x-4">
          <div className="flex-1 flex flex-row items-center justify-center">
            <Search />
          </div>

          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
    </>
  )
}
