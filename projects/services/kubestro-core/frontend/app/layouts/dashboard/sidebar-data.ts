import { BellDotIcon, LayoutDashboardIcon, PaletteIcon, SettingsIcon, ShieldIcon, UserIcon, WrenchIcon } from 'lucide-react'
import type { ElementType } from 'react'
import { href } from 'react-router'

interface BaseNavItem {
  title: string
  badge?: string
  icon?: ElementType
}

type LinkTo = string

export type NavLink = BaseNavItem & {
  url: LinkTo
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkTo })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarData {
  navGroups: NavGroup[]
}

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: href('/dashboard'),
          icon: LayoutDashboardIcon
        }
      ]
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: SettingsIcon,
          items: [
            {
              title: 'Profile',
              url: href('/dashboard/settings'),
              icon: UserIcon
            },
            {
              title: 'Account',
              url: '/dashboard/settings/account',
              icon: WrenchIcon
            },
            {
              title: 'Security',
              url: '/dashboard/settings/security',
              icon: ShieldIcon
            },
            {
              title: 'Appearance',
              url: '/dashboard/settings/appearance',
              icon: PaletteIcon
            },
            {
              title: 'Notifications',
              url: '/dashboard/settings/notifications',
              icon: BellDotIcon
            }
          ]
        }
      ]
    }
  ]
}
