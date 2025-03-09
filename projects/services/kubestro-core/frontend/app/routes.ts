import { index, layout, prefix, route } from '@react-router/dev/routes'
import type { RouteConfig, RouteConfigEntry } from '@react-router/dev/routes'

function testRoutes(): RouteConfigEntry[] {
  if (process.env.NODE_ENV === 'development') {
    return [route('mf-test/*', 'features/dashboard/test/mf-test.tsx')]
  }

  return []
}

export default [
  // Redirect
  index('features/redirect/redirect.tsx'),

  // Setup
  layout('layouts/double-side-layout.tsx', { id: 'setup-layout' }, [
    route('setup', 'features/setup/setup.tsx')
  ]),

  // Authentication
  layout('layouts/double-side-layout.tsx', { id: 'auth-layout' }, [
    route('login', 'features/authentication/login.tsx'),
    route('login/callback', 'features/authentication/oidc-callback.tsx')
  ]),
  route('logout', 'features/authentication/logout.tsx'),

  // Dashboard
  route('dashboard', 'features/dashboard/_layout.tsx', { id: 'dashboard-layout' }, [
    index('features/dashboard/home/home.tsx'),

    ...prefix('game-managers', [
      index('features/dashboard/game-managers/overview/overview.tsx', { id: 'game-managers-overview' }),
      route('add', 'features/dashboard/game-managers/add/add.tsx', { id: 'game-managers-add' }),
      route('repositories', 'features/dashboard/game-managers/repositories/repositories.tsx'),
      route('repositories/:id', 'features/dashboard/game-managers/repositories/repository-action.ts')
    ]),

    route('settings', 'features/dashboard/settings/_layout.tsx', { id: 'settings-layout' }, [
      index('features/dashboard/settings/profile.tsx', { id: 'settings-profile' }),
      route('security', 'features/dashboard/settings/security.tsx', { id: 'settings-security' }),
      route('appearance', 'features/dashboard/settings/appearance.tsx', { id: 'settings-appearance' }),
      route('notifications', 'features/dashboard/settings/notifications.tsx', { id: 'settings-notifications' })
    ]),

    ...testRoutes(),

    route('*', 'features/dashboard/not-found/not-found.tsx')
  ])
] satisfies RouteConfig
