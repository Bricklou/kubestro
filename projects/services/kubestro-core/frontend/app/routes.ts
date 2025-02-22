import { index, layout, route } from '@react-router/dev/routes'
import type { RouteConfig } from '@react-router/dev/routes'

export default [
  layout('routes/_root-layout.tsx', [
    index('routes/index.tsx'),

    layout('layouts/double-side-layout.tsx', { id: 'auth-layout' }, [
      route('/login', 'routes/_auth/login.tsx'),
      route('/login/callback', 'routes/_auth/oidc-callback.tsx')
    ]),

    route('/logout', 'routes/_auth/logout.tsx'),

    route('/dashboard', 'routes/dashboard/_layout.tsx', [
      index('routes/dashboard/index.tsx')
    ])
  ]),
  layout('layouts/double-side-layout.tsx', { id: 'setup-layout' }, [
    route('/setup', 'routes/setup.tsx')
  ])
] satisfies RouteConfig
