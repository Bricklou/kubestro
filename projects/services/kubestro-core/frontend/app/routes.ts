import { index, layout, prefix, route } from '@react-router/dev/routes'
import type { RouteConfig } from '@react-router/dev/routes'

export default [
  layout('layouts/root-layout.tsx', [
    // Index route used to redirect the user
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
        route('repositories', 'features/dashboard/game-managers/repositories/repositories.tsx')
      ]),

      route('settings', 'features/dashboard/settings/_layout.tsx', { id: 'settings-layout' }, [
        index('features/dashboard/settings/profile.tsx', { id: 'settings-profile' }),
        route('security', 'features/dashboard/settings/security.tsx', { id: 'settings-security' }),
        route('appearance', 'features/dashboard/settings/appearance.tsx', { id: 'settings-appearance' }),
        route('notifications', 'features/dashboard/settings/notifications.tsx', { id: 'settings-notifications' })
      ]),

      route('*', 'features/dashboard/not-found/not-found.tsx')
    ])
  ])
] satisfies RouteConfig
