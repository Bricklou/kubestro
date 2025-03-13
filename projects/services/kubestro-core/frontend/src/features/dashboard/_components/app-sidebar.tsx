import { SidebarHeader, Sidebar, SidebarContent, SidebarFooter, SidebarMenuButton, SidebarMenu, SidebarMenuItem } from '@kubestro/design-system'
import { LayoutDashboardIcon } from 'lucide-react'
import { Suspense, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { Await, href, Link } from 'react-router'
import { sidebarData } from './sidebar-data'
import type { NavGroup as NavGroupData } from './sidebar-data'
import { NavGroup } from './nav-group'
import { federation } from '~/utils/module-federation'

function AppSidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="data-[state=open]:bg-sidebar-hover data-[state=open]:text-sidebar-hover-text" size="lg">
          <Link to={href('/dashboard')}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-text">
              <LayoutDashboardIcon className="size-4" />
            </div>

            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-lg">
                Kubestro
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function FederatedModuleContent() {
  const modulePromise = useMemo(async () => federation.loadRemote<{ sidebarItems: NavGroupData[] }>('mf-test/routes'), [])

  return (
    <Suspense>
      <Await resolve={modulePromise}>
        {module => (module ?
          module.sidebarItems.map(groupProps => (
            <NavGroup key={groupProps.title} {...groupProps} />
          )) :
          null)}
      </Await>
    </Suspense>
  )
}

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <AppSidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        {/* Sidebar content */}
        {sidebarData.navGroups.map(groupProps => (
          <NavGroup key={groupProps.title} {...groupProps} />
        ))}

        {import.meta.env.VITE_ENABLE_MF_TEST ? <FederatedModuleContent /> : null}
      </SidebarContent>

      <SidebarFooter>
        {/* Sidebar footer */}
      </SidebarFooter>
    </Sidebar>
  )
}
