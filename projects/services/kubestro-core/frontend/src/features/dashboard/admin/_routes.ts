import type { RouteObject } from 'react-router'

export const adminRoutes: RouteObject[] = [
  {
    path: 'users',
    lazy: async () => await import('./users/users').then(m => m.default)
  },
  {
    path: 'groups',
    lazy: async () => await import('./users/groups').then(m => m.default)
  }
]
