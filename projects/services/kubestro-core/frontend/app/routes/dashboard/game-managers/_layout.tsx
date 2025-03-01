import { Outlet } from 'react-router'
import { Header } from '~/layouts/dashboard/header'
import { Main } from '~/layouts/dashboard/main'
import { ProfileDropdown } from '~/layouts/dashboard/profile-dropdown'
import { Search } from '~/layouts/dashboard/search'
import { ThemeSwitch } from '~/layouts/dashboard/theme-switch'

export default function GameManagersLayout() {
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
        <Outlet />
      </Main>
    </>
  )
}
