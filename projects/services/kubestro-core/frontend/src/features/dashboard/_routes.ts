import type { RouteObject } from 'react-router'
import homePage from './home/home'
import notFoundPage from './not-found/not-found'
import { settingsRoutes } from './settings/_routes'
import { gameManagersRoute } from './game-managers/_routes'
import { ErrorBoundary } from './_error-boundaries'

export const dashboardRoutes: RouteObject[] = [
  homePage,
  {
    path: 'game-managers',
    children: gameManagersRoute
  },
  {
    path: 'settings',
    lazy: async () => await import('./settings/_layout').then(m => m.default),
    children: settingsRoutes
  },
  {
    id: 'modules',
    children: [],
    ErrorBoundary
  },
  {
    path: '*',
    ...notFoundPage
  }
]
