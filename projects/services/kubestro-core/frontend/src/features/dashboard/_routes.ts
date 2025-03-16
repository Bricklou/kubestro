import type { RouteObject } from 'react-router'
import notFoundPage from '../errors/not-found-error'
import homePage from './home/home'
import { settingsRoutes } from './settings/_routes'
import { gameManagersRoute } from './game-managers/_routes'
import { ErrorBoundary } from './_error-boundaries'
import { adminRoutes } from './admin/_routes'

export const dashboardRoutes: RouteObject[] = [
  homePage,
  {
    path: 'game-managers',
    children: gameManagersRoute
  },
  {
    path: 'admin',
    children: adminRoutes
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
