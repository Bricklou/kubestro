import { init } from '@module-federation/enhanced/runtime'

export const federation = init({
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
    },
    'lucide-react': {
      version: '0.479.0',
      lib: async () => import('lucide-react'),
      shareConfig: {
        requiredVersion: '^0.479.0'
      }
    }
  }
})
