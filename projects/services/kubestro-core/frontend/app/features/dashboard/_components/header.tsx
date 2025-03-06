import { Separator, SidebarTrigger } from '@kubestro/design-system'
import type { HTMLAttributes, RefAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { useScrollPosition } from '~/hooks/scroll-position'

export interface Headerprops extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {
  readonly fixed?: boolean
}

export function Header({ className, fixed, children, ...props }: Headerprops) {
  const offset = useScrollPosition()

  return (
    <header
      className={twMerge(
        'flex h-16 items-center gap-3 bg-background p-4 sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger className="scale-125 sm:scale-100" variant="ghost" />
      <Separator className="h-6" orientation="vertical" />
      {children}
    </header>
  )
}
