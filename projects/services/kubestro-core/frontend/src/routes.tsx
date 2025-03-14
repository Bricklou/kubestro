import { createBrowserRouter } from 'react-router'
import type { LazyRouteFunction, PatchRoutesOnNavigationFunction, RouteObject, unstable_RouterContextProvider } from 'react-router'
import { requireSetupMiddleware } from './middlewares/requireSetup'
import { indexRedirectMiddleware } from './features/redirect/redirect'
import DoubleSideLayout from './layouts/double-side-layout'
import loginPage from './features/authentication/login'
import oidcCallbackPage from './features/authentication/oidc-callback'
import logoutPage from './features/authentication/logout'
import { dashboardRoutes } from './features/dashboard/_routes'
import { federation } from './utils/module-federation'
import { ErrorBoundary } from './error-boundaries'

declare module 'react-router' {
  interface Future {
    // Enable unstable middleware type
    unstable_middleware: boolean
  }

  interface LoaderFunctionArgs {
    context: unstable_RouterContextProvider
  }
  interface ActionFunctionArgs {
    context: unstable_RouterContextProvider
  }

  type LazyRouteObject = Awaited<ReturnType<LazyRouteFunction<RouteObject>>>
}

const patchRoutesOnNavigation: PatchRoutesOnNavigationFunction = async ({ path, patch }) => {
  /*
   * This is where you would put your code to patch the routes
   * when the user navigates to a new location
   */

  if (import.meta.env.VITE_ENABLE_MF_TEST && path.startsWith('/dashboard/mf-test')) {
    try {
      const module = await federation.loadRemote<{ routeObject: RouteObject }>('mf-test/routes')
      if (module) {
        patch('modules', [module.routeObject])
      }
    }
    catch (error) {
      console.error('Failed to load remote module:', error)
    }
  }
}

export const router = createBrowserRouter([
  {
    id: 'root',
    unstable_middleware: [requireSetupMiddleware],
    errorElement: <ErrorBoundary />,

    children: [
      // Redirect
      {
        id: 'redirect',
        index: true,
        unstable_middleware: [indexRedirectMiddleware],
        loader: () => undefined
      },

      // Setup
      {
        id: 'setup-layout',
        element: <DoubleSideLayout />,
        children: [
          {
            path: 'setup',
            id: 'setup',
            lazy: async () => await import('./features/setup/setup').then(m => m.default)
          }
        ]
      },

      // Authentication
      {
        id: 'auth-layout',
        element: <DoubleSideLayout />,
        children: [
          {
            path: 'login',
            ...loginPage
          },
          {
            path: 'login/callback',
            ...oidcCallbackPage
          },
          {
            path: 'logout',
            ...logoutPage
          }
        ]
      },

      // Dashboard
      {
        path: 'dashboard',
        id: 'dashboard-layout',
        lazy: async () => await import('./features/dashboard/_layout').then(m => m.default),
        children: dashboardRoutes
      }
    ]
  }
], {
  patchRoutesOnNavigation,
  future: {
    unstable_middleware: true
  }
})
