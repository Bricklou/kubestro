import type { Meta, StoryObj } from '@storybook/react'
import { Home, Inbox, Calendar, Search, Settings, LayoutDashboardIcon } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [
    Story => (
      <SidebarProvider className="w-full">
        <Story />

        <main className="px-4 py-6 w-full peer-[.header-fixed]/header:mt-16">
          <SidebarTrigger />
        </main>
      </SidebarProvider>
    )
  ]
}

export default meta
type Story = StoryObj<typeof Sidebar>

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar
  },
  {
    title: 'Search',
    url: '#',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export const Default: Story = {
  render: () => (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>

          <SidebarMenuItem className="inline-flex gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-text">
              <LayoutDashboardIcon className="size-4" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                Sidebar
              </span>

              <span className="truncate text-xs">Subtitle</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
