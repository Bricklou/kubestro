import { SidebarHeader, Sidebar, SidebarContent, SidebarFooter, SidebarMenuButton, SidebarMenu, SidebarMenuItem } from '@kubestro/design-system'
import { LayoutDashboardIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { href, Link } from 'react-router'

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

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <AppSidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        {/* Sidebar content */}
      </SidebarContent>

      <SidebarFooter>
        {/* Sidebar footer */}
      </SidebarFooter>
    </Sidebar>
  )
}
