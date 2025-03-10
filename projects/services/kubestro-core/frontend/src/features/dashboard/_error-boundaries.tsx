import { useRouteError, isRouteErrorResponse } from 'react-router'

export function ErrorBoundary() {
  const error = useRouteError()
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
