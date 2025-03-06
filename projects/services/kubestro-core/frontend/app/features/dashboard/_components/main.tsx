import type { HTMLAttributes, RefAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface MainProps extends HTMLAttributes<HTMLElement>, RefAttributes<HTMLElement> {
  readonly fixed?: boolean
}

export function Main({ className, fixed, ...props }: MainProps) {
  return (
    <main
      className={twMerge(
        'peer-[.header-fixed]/header:mt-10 px-4 py-6',
        fixed && 'fixed-main flex flex-grow flex-col overflow-hidden',
        className
      )}
      {...props}
    />
  )
}
