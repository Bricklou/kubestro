import type { RouteObject } from 'react-router'

export const gameManagersRoute: RouteObject[] = [
  {
    index: true,
    lazy: async () => await import('./overview/overview').then(m => m.default)
  },
  {
    path: 'add',
    lazy: async () => await import('./add/add').then(m => m.default)
  },
  {
    path: 'repositories',
    id: 'repositories',
    lazy: async () => await import('./repositories/repositories').then(m => m.default)
  },
  {
    path: 'repositories/:id',
    lazy: async () => {
      const action = await import('./repositories/repository-action').then(m => m.deleteRepositoryAction)
      return { action }
    }
  }
]
