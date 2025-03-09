import { Separator } from '@kubestro/design-system'
import { init } from '@module-federation/enhanced/runtime'
import { isRouteErrorResponse } from 'react-router'
import { lazy, Suspense } from 'react'
import { Main } from '../_components/main'
import type { Route } from './+types/mf-test'
import type { User } from '~/data/types/user'
import { userContext } from '~/utils/contexts'

const federation = init({
  name: 'kubestro-core',
  remotes: [
    {
      name: 'module-federation-test',
      entry: 'http://localhost:5174/mf-manifest.json',
      alias: 'mf-test'
    }
  ],
  shared: {
    'react': {
      version: '19.0.0',
      lib: async () => import('react'),
      shareConfig: {
        singleton: true,
        eager: true,
        requiredVersion: '^19.0.0'
      }
    },
    'react-dom': {
      version: '19.0.0',
      lib: async () => import('react-dom'),
      shareConfig: {
        singleton: true,
        eager: true,
        requiredVersion: '^19.0.0'
      }
    },
    'react-router': {
      version: '7.3.0',
      lib: async () => import('react-router'),
      shareConfig: {
        singleton: true,
        eager: true,
        requiredVersion: '^7.3.0'
      }
    },
    '@kubestro/design-system/': {
      version: '1.0.0',
      lib: async () => import('@kubestro/design-system'),
      shareConfig: {
        singleton: true,
        eager: true,
        requiredVersion: '^1.0.0'
      }
    }
  }
})

function System({ user }: { readonly user: User }) {
  // @ts-expect-error -- TS7016: Could not find a declaration file for module 'mf-test/export-app'.
  const Component = lazy(async () => federation.loadRemote('mf-test/export-app'))

  return (
    <Suspense fallback="Loading module...">
      <Component user={user.username} />
    </Suspense>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full p-8">
        <h1>
          {error.status} {error.statusText}
        </h1>

        <p>{error.data}</p>
      </div>
    )
  }
  else if (error instanceof Error) {
    return (
      <div className="w-full p-8">
        <h1 className="font-bold text-2xl mb-4">Error</h1>
        <p className="text-red-500 mb-2">{error.message}</p>
        <p>The stack trace is:</p>
        <pre className="overflow-auto rounded-md border border-border p-2">{error.stack}</pre>
      </div>
    )
  }
  return <h1>Unknown Error</h1>
}

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  console.debug('mf-test clientLoader', context.get(userContext))
  return {
    user: context.get(userContext)
  }
}

export default function ModuleFederationTest({ loaderData }: Route.ComponentProps) {
  return (
    <Main fixed>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Module Federation Test
        </h1>
      </div>

      <Separator className="my-4 lg:my-6" />
      <System user={loaderData.user} />
    </Main>
  )
}
