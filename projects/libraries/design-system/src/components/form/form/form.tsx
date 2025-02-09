import type { HTMLAttributes, RefAttributes } from 'react'

export interface FormMessageProps
  extends HTMLAttributes<HTMLParagraphElement>, RefAttributes<HTMLParagraphElement> {
  readonly error?: string | Error
}

export function FormMessage({ children, error, ref }: FormMessageProps) {
  const errorBody = error ?
      (
        error instanceof Error ? error.message : error
      ) :
    children

  if (!errorBody) return null

  return (
    <p className="text-xs font-medium text-danger" ref={ref}>
      {errorBody}
    </p>
  )
}
