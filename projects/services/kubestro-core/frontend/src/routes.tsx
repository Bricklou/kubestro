import { createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router'
import type { LazyRouteFunction, PatchRoutesOnNavigationFunction, RouteObject, unstable_RouterContextProvider } from 'react-router'
import { requireSetupMiddleware } from './middlewares/requireSetup'
import { indexRedirectMiddleware } from './features/redirect/redirect'
import DoubleSideLayout from './layouts/double-side-layout'
import loginPage from './features/authentication/login'
import oidcCallbackPage from './features/authentication/oidc-callback'
import logoutPage from './features/authentication/logout'
import { dashboardRoutes } from './features/dashboard/_routes'
import { federation } from './utils/module-federation'

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

  if (path.startsWith('/dashboard/mf-test')) {
    try {
      const modulePromise = federation.loadRemote<{ routeObject: RouteObject }>('mf-test/routes')
      const module = await modulePromise
      console.log('Module: %o', module)
      if (module) {
        patch('modules', [module.routeObject])
      }
    }
    catch (error) {
      console.error('Failed to load remote module:', error)
    }
  }
}

export function ErrorBoundary() {
  const error = useRouteError()

  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404 ?
        'The requested page could not be found.' :
        error.statusText || details
  }
  else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- destructuring isn't possible here
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>

      {stack ?
        (
          <pre className="w-full overflow-x-auto p-4">
            <code>{stack}</code>
          </pre>
        ) :
        null}
    </main>
  )
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
        unstable_middleware: [indexRedirectMiddleware]
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
