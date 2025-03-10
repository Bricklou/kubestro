import { ActivityIcon, BellDotIcon, BookMarkedIcon, LayoutDashboardIcon, PaletteIcon, PlusIcon, SettingsIcon, ShieldIcon, UserIcon, UserSearchIcon, UsersIcon } from 'lucide-react'
import type { ElementType } from 'react'
import { href } from 'react-router'
import type { XOR } from '~/types/xor'

interface BaseNavItem {
  title: string
  badge?: string
  icon?: ElementType
}

type LinkTo = string

export type NavLink = BaseNavItem & {
  to: LinkTo
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { to: LinkTo })[]
  to?: never
}

export type NavItem = NavCollapsible | NavLink

export interface NavGroup {
  title: string
  items: NavItem[]
  action?: {
    title: string
    icon: ElementType
  } & XOR<{ to: LinkTo }, { onClick: () => void }>
}

export interface SidebarData {
  navGroups: NavGroup[]
}

function test(): NavGroup[] {
  if (process.env.NODE_ENV === 'development') {
    return [
      {
        title: 'Test',
        items: [
          {
            title: 'Module Federation Test',
            to: '/dashboard/mf-test',
            icon: LayoutDashboardIcon
          }
        ]
      }
    ]
  }

  return []
}

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          to: href('/dashboard'),
          icon: LayoutDashboardIcon
        }
      ]
    },
    {
      title: 'Games Managers',
      action: {
        title: 'Add a Game Manager',
        icon: PlusIcon,
        to: href('/dashboard/game-managers/add')
      },
      items: [
        {
          title: 'Overview',
          to: href('/dashboard/game-managers'),
          icon: LayoutDashboardIcon
        },
        {
          title: 'Repositories',
          to: '/dashboard/game-managers/repositories',
          icon: BookMarkedIcon
        }
      ]
    },
    {
      title: 'Admin',
      items: [
        {
          title: 'Users & Groups',
          icon: UsersIcon,
          items: [
            {
              title: 'Users',
              to: '/dashboard/admin/users',
              icon: UsersIcon
            },
            {
              title: 'Groups',
              to: '/dashboard/admin/groups',
              icon: UserSearchIcon
            }
          ]
        },
        {
          title: 'Activity Log',
          icon: ActivityIcon,
          to: '/dashboard/admin/activity'
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
              to: href('/dashboard/settings'),
              icon: UserIcon
            },
            {
              title: 'Security',
              to: href('/dashboard/settings/security'),
              icon: ShieldIcon
            },
            {
              title: 'Appearance',
              to: href('/dashboard/settings/appearance'),
              icon: PaletteIcon
            },
            {
              title: 'Notifications',
              to: href('/dashboard/settings/notifications'),
              icon: BellDotIcon
            }
          ]
        }
      ]
    },
    ...test()
  ]
}
