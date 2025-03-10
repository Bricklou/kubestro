import { useRouteError, isRouteErrorResponse } from 'react-router'

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
