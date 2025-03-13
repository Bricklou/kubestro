import type { RouteObject } from 'react-router'

export const settingsRoutes: RouteObject[] = [
  {
    index: true,
    lazy: async () => import('./profile').then(m => m.default)
  },
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
