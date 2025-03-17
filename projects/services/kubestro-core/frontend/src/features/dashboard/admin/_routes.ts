import type { RouteObject } from 'react-router'

export const adminRoutes: RouteObject[] = [
  {
    path: 'users',
    lazy: async () => await import('./users/users').then(m => m.default)
  },
  {
    path: 'users/invite',
    lazy: async () => await import('./users/_actions/users-invite').then(m => m.default)
  },
  {
    path: 'users/create',
    lazy: async () => await import('./users/_actions/users-create').then(m => m.default)
  },
  {
    path: 'users/:id/update',
    lazy: async () => await import('./users/_actions/users-update').then(m => m.default)
  },
  {
    path: 'users/:id/delete',
    lazy: async () => await import('./users/_actions/users-delete').then(m => m.default)
  },
  {
    path: 'groups',
    lazy: async () => await import('./users/groups').then(m => m.default)
  }
]
