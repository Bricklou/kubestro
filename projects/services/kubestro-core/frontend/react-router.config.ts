import type { Config } from '@react-router/dev/config'

declare module 'react-router' {
  interface Future {
    // Enable unstable middleware type
    unstable_middleware: boolean
  }
}

export default {
  buildDirectory: 'dist',

  future: {

    /*
     * Enable middleware feature
     *
     * NOTE: Middleware is unstable and should not be adopted in production.
     * There is at least one known de-optimization in route module loading for clientMiddleware
     * that we will be addressing this before a stable release.
     */
    unstable_middleware: true
  },

  /*
   * Config options...
   * Server-side render by default, to enable SPA mode set this to `false`
   */
  ssr: false
} satisfies Config
