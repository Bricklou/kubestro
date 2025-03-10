import type { RouteObject } from 'react-router'
import profilePage from './profile'

export const settingsRoutes: RouteObject[] = [
  profilePage,
  {
    path: 'security',
    lazy: async () => import('./security').then(m => m.default)
  },
  {
    path: 'appearance',
    lazy: async () => import('./appearance').then(m => m.default)
  },
  {
    path: 'notifications',
    lazy: async () => import('./notifications').then(m => m.default)
  }
]
