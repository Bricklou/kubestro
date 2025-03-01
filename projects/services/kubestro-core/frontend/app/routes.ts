import { index, layout, route } from '@react-router/dev/routes'
import type { RouteConfig } from '@react-router/dev/routes'

export default [
  layout('routes/_root-layout.tsx', [
    index('routes/index.tsx'),

    layout('layouts/double-side-layout.tsx', { id: 'auth-layout' }, [
      route('login', 'routes/_auth/login.tsx'),
      route('login/callback', 'routes/_auth/oidc-callback.tsx')
    ]),

    route('logout', 'routes/_auth/logout.tsx'),

    route('dashboard', 'routes/dashboard/_layout.tsx', { id: 'dashboard-layout' }, [
      index('routes/dashboard/index.tsx'),

      route('game-managers', 'routes/dashboard/game-managers/_layout.tsx', { id: 'game-managers-layout' }, [
        index('routes/dashboard/game-managers/overview.tsx', { id: 'game-managers-overview' }),
        route('add', 'routes/dashboard/game-managers/add.tsx', { id: 'game-managers-add' })
      ]),

      route('settings', 'routes/dashboard/settings/_layout.tsx', { id: 'settings-layout' }, [
        index('routes/dashboard/settings/profile.tsx', { id: 'settings-profile' }),
        route('security', 'routes/dashboard/settings/security.tsx', { id: 'settings-security' }),
        route('appearance', 'routes/dashboard/settings/appearance.tsx', { id: 'settings-appearance' }),
        route('notifications', 'routes/dashboard/settings/notifications.tsx', { id: 'settings-notifications' })
      ])
    ])
  ]),
  layout('layouts/double-side-layout.tsx', { id: 'setup-layout' }, [
    route('setup', 'routes/setup.tsx')
  ])
] satisfies RouteConfig
