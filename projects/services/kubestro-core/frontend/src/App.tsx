import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, Toaster } from '@kubestro/design-system'
import { RouterProvider } from 'react-router'
import { queryClient } from './utils/queryClient'
import { router } from './routes'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
